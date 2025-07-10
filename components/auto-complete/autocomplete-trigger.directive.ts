/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  DOCUMENT,
  ElementRef,
  ExistingProvider,
  forwardRef,
  inject,
  Input,
  NgZone,
  ViewContainerRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';

import { TriSafeAny, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { TriInputGroupWhitSuffixOrPrefixDirective } from 'ng-zorro-antd/input';

import { TriAutocompleteOptionComponent } from './autocomplete-option.component';
import { TriAutocompleteComponent } from './autocomplete.component';

/**
 * @deprecated Internally used, will be removed in v21, please do not use it.
 */
export const TRI_AUTOCOMPLETE_VALUE_ACCESSOR: ExistingProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TriAutocompleteTriggerDirective),
  multi: true
};

/**
 * @deprecated Internally used, will not be exported in v21, please do not use it.
 */
export function getNzAutocompleteMissingPanelError(): Error {
  return Error(
    'Attempting to open an undefined instance of `nz-autocomplete`. ' +
      'Make sure that the id passed to the `nzAutocomplete` is correct and that ' +
      "you're attempting to open it after the ngAfterContentInit hook."
  );
}

@Directive({
  selector: `input[nzAutocomplete], textarea[nzAutocomplete]`,
  exportAs: 'triAutocompleteTrigger',
  providers: [TRI_AUTOCOMPLETE_VALUE_ACCESSOR],
  host: {
    autocomplete: 'off',
    'aria-autocomplete': 'list',
    '(focusin)': 'handleFocus()',
    '(blur)': 'handleBlur()',
    '(input)': 'handleInput($any($event))',
    '(keydown)': 'handleKeydown($any($event))',
    '(click)': 'handleClick()'
  }
})
export class TriAutocompleteTriggerDirective implements AfterViewInit, ControlValueAccessor {
  private ngZone = inject(NgZone);
  private elementRef = inject(ElementRef<HTMLElement>);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);
  /** Bind nzAutocomplete component */
  @Input() autocomplete!: TriAutocompleteComponent;

  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  panelOpen: boolean = false;

  /** Current active option */
  get activeOption(): TriAutocompleteOptionComponent | null {
    if (this.autocomplete && this.autocomplete.options.length) {
      return this.autocomplete.activeItem;
    } else {
      return null;
    }
  }

  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal<{}> | null = null;
  private positionStrategy!: FlexibleConnectedPositionStrategy;
  private previousValue: string | number | null = null;
  private selectionChangeSubscription!: Subscription;
  private optionsChangeSubscription!: Subscription;
  private overlayOutsideClickSubscription!: Subscription;
  private document: Document = inject(DOCUMENT);
  private inputGroupWhitSuffixOrPrefixDirective = inject(TriInputGroupWhitSuffixOrPrefixDirective, { optional: true });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyPanel();
    });
  }

  ngAfterViewInit(): void {
    if (this.autocomplete) {
      this.autocomplete.animationStateChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
        if (event.toState === 'void') {
          if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
          }
        }
      });
    }
  }

  writeValue(value: TriSafeAny): void {
    this.ngZone.runOutsideAngular(() => {
      Promise.resolve(null).then(() => this.setTriggerValue(value));
    });
  }

  registerOnChange(fn: (value: {}) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const element: HTMLInputElement = this.elementRef.nativeElement;
    element.disabled = isDisabled;
    this.closePanel();
  }

  openPanel(): void {
    this.previousValue = this.elementRef.nativeElement.value;
    this.attachOverlay();
    this.updateStatus();
  }

  closePanel(): void {
    if (this.panelOpen) {
      this.autocomplete.isOpen = this.panelOpen = false;

      if (this.overlayRef && this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
        this.selectionChangeSubscription.unsubscribe();
        this.overlayOutsideClickSubscription.unsubscribe();
        this.optionsChangeSubscription.unsubscribe();
        this.portal = null;
      }
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;

    if (keyCode === ESCAPE) {
      event.preventDefault();
    }

    if (this.panelOpen && (keyCode === ESCAPE || keyCode === TAB)) {
      // Reset value when tab / ESC close
      if (this.activeOption && this.activeOption.getLabel() !== this.previousValue) {
        this.setTriggerValue(this.previousValue);
      }
      this.closePanel();
    } else if (this.panelOpen && keyCode === ENTER) {
      if (this.autocomplete.showPanel) {
        event.preventDefault();
        if (this.activeOption) {
          this.activeOption.selectViaInteraction();
        } else {
          this.closePanel();
        }
      }
    } else if (this.panelOpen && isArrowKey && this.autocomplete.showPanel) {
      event.stopPropagation();
      event.preventDefault();
      if (keyCode === UP_ARROW) {
        this.autocomplete.setPreviousItemActive();
      } else {
        this.autocomplete.setNextItemActive();
      }
      if (this.activeOption) {
        this.activeOption.scrollIntoViewIfNeeded();
      }
      this.doBackfill();
    }
  }

  handleInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    const document = this.document as Document;
    let value: number | string | null = target.value;

    if (target.type === 'number') {
      value = value === '' ? null : parseFloat(value);
    }
    if (this.previousValue !== value) {
      this.previousValue = value;
      this.onChange(value);

      if (this.canOpen() && document.activeElement === event.target) {
        this.openPanel();
      }
    }
  }

  handleFocus(): void {
    if (this.canOpen()) {
      this.openPanel();
    }
  }

  handleClick(): void {
    if (this.canOpen() && !this.panelOpen) {
      this.openPanel();
    }
  }

  handleBlur(): void {
    this.onTouched();
  }

  /**
   * Subscription data source changes event
   */
  private subscribeOptionsChange(): Subscription {
    const optionChanges = this.autocomplete.options.changes.pipe(
      tap(() => this.positionStrategy.reapplyLastPosition()),
      delay(0)
    );
    return optionChanges.subscribe(() => {
      this.resetActiveItem();
      if (this.panelOpen) {
        this.overlayRef!.updatePosition();
      }
    });
  }

  /**
   * Subscription option changes event and set the value
   */
  private subscribeSelectionChange(): Subscription {
    return this.autocomplete.selectionChange.subscribe((option: TriAutocompleteOptionComponent) => {
      this.setValueAndClose(option);
    });
  }

  private subscribeOverlayOutsideClick(): Subscription {
    return this.overlayRef!.outsidePointerEvents()
      .pipe(filter((e: MouseEvent) => !this.elementRef.nativeElement.contains(e.target)))
      .subscribe(() => {
        this.closePanel();
      });
  }

  private attachOverlay(): void {
    if (!this.autocomplete) {
      throw getNzAutocompleteMissingPanelError();
    }

    if (!this.portal && this.autocomplete.template) {
      this.portal = new TemplatePortal(this.autocomplete.template, this.viewContainerRef);
    }

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(this.getOverlayConfig());
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
      this.selectionChangeSubscription = this.subscribeSelectionChange();
      this.optionsChangeSubscription = this.subscribeOptionsChange();
      this.overlayOutsideClickSubscription = this.subscribeOverlayOutsideClick();
      this.overlayRef
        .detachments()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.closePanel();
        });
    }
    this.autocomplete.isOpen = this.panelOpen = true;
  }

  private updateStatus(): void {
    if (this.overlayRef) {
      this.overlayRef.updateSize({ width: this.autocomplete.width || this.getHostWidth() });
    }
    this.autocomplete.setVisibility();
    this.resetActiveItem();
    if (this.activeOption) {
      this.activeOption.scrollIntoViewIfNeeded();
    }
  }

  private destroyPanel(): void {
    if (this.overlayRef) {
      this.closePanel();
    }
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.getOverlayPosition(),
      disposeOnNavigation: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // default host element width
      width: this.autocomplete.width || this.getHostWidth()
    });
  }

  private getConnectedElement(): ElementRef {
    return this.inputGroupWhitSuffixOrPrefixDirective?.elementRef ?? this.elementRef;
  }

  private getHostWidth(): number {
    return this.getConnectedElement().nativeElement.getBoundingClientRect().width;
  }

  private getOverlayPosition(): PositionStrategy {
    const positions = [
      new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
      new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
    ];
    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.getConnectedElement())
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions(positions)
      .withTransformOriginOn('.ant-select-dropdown');
    return this.positionStrategy;
  }

  private resetActiveItem(): void {
    const index = this.autocomplete.getOptionIndex(this.previousValue);
    this.autocomplete.clearSelectedOptions(null, true);
    if (index !== -1) {
      this.autocomplete.setActiveItem(index);
      this.autocomplete.activeItem!.select(false);
    } else {
      this.autocomplete.setActiveItem(this.autocomplete.defaultActiveFirstOption ? 0 : -1);
    }
  }

  private setValueAndClose(option: TriAutocompleteOptionComponent): void {
    const value = option.value;
    this.setTriggerValue(option.getLabel());
    this.onChange(value);
    this.elementRef.nativeElement.focus();
    this.closePanel();
  }

  private setTriggerValue(value: TriSafeAny): void {
    const option = this.autocomplete.getOption(value);
    const displayValue = option ? option.getLabel() : value;
    this.elementRef.nativeElement.value = displayValue != null ? displayValue : '';
    if (!this.autocomplete.backfill) {
      this.previousValue = displayValue;
    }
  }

  private doBackfill(): void {
    if (this.autocomplete.backfill && this.autocomplete.activeItem) {
      this.setTriggerValue(this.autocomplete.activeItem.getLabel());
    }
  }

  private canOpen(): boolean {
    const element: HTMLInputElement = this.elementRef.nativeElement;
    return !element.readOnly && !element.disabled;
  }
}
