/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Subject, combineLatest, fromEvent, merge } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { POSITION_MAP } from 'ng-zorro-antd/core/overlay';
import { IndexableObject } from 'ng-zorro-antd/core/types';

import { TriDropdownMenuComponent, TriPlacementType } from './dropdown-menu.component';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'dropDown';

const listOfPositions = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topRight,
  POSITION_MAP.topLeft
];

@Directive({
  selector: '[tri-dropdown]',
  exportAs: 'triDropdown',
  host: {
    class: 'tri-dropdown-trigger'
  }
})
export class TriDropDownDirective implements AfterViewInit, OnChanges {
  public readonly configService = inject(TriConfigService);
  private renderer = inject(Renderer2);
  private viewContainerRef = inject(ViewContainerRef);
  private platform = inject(Platform);
  private destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;
  public elementRef = inject(ElementRef);
  private overlay = inject(Overlay);

  private portal?: TemplatePortal;
  private overlayRef: OverlayRef | null = null;

  private positionStrategy = this.overlay
    .position()
    .flexibleConnectedTo(this.elementRef.nativeElement)
    .withLockedPosition()
    .withTransformOriginOn('.ant-dropdown');
  private inputVisible$ = new BehaviorSubject<boolean>(false);
  private trigger$ = new BehaviorSubject<'click' | 'hover'>('hover');
  private overlayClose$ = new Subject<boolean>();
  @Input() dropdownMenu: TriDropdownMenuComponent | null = null;
  @Input() trigger: 'click' | 'hover' = 'hover';
  @Input() matchWidthElement: ElementRef | null = null;
  @Input({ transform: booleanAttribute }) @WithConfig() backdrop = false;
  @Input({ transform: booleanAttribute }) clickHide = true;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) visible = false;
  @Input() overlayClassName: string = '';
  @Input() overlayStyle: IndexableObject = {};
  @Input() placement: TriPlacementType = 'bottomLeft';
  @Output() readonly visibleChange = new EventEmitter<boolean>();

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.overlayRef?.dispose();
      this.overlayRef = null;
    });
  }

  setDropdownMenuValue<T extends keyof TriDropdownMenuComponent>(key: T, value: TriDropdownMenuComponent[T]): void {
    if (this.dropdownMenu) {
      this.dropdownMenu.setValue(key, value);
    }
  }

  ngAfterViewInit(): void {
    if (this.dropdownMenu) {
      const nativeElement: HTMLElement = this.elementRef.nativeElement;
      /** host mouse state **/
      const hostMouseState$ = merge(
        fromEvent(nativeElement, 'mouseenter').pipe(map(() => true)),
        fromEvent(nativeElement, 'mouseleave').pipe(map(() => false))
      );
      /** menu mouse state **/
      const menuMouseState$ = this.dropdownMenu.mouseState$;
      /** merged mouse state **/
      const mergedMouseState$ = merge(menuMouseState$, hostMouseState$);
      /** host click state **/
      const hostClickState$ = fromEvent(nativeElement, 'click').pipe(map(() => !this.visible));
      /** visible state switch by nzTrigger **/
      const visibleStateByTrigger$ = this.trigger$.pipe(
        switchMap(trigger => {
          if (trigger === 'hover') {
            return mergedMouseState$;
          } else if (trigger === 'click') {
            return hostClickState$;
          } else {
            return EMPTY;
          }
        })
      );
      const descendantMenuItemClick$ = this.dropdownMenu.descendantMenuItemClick$.pipe(
        filter(() => this.clickHide),
        map(() => false)
      );
      const domTriggerVisible$ = merge(visibleStateByTrigger$, descendantMenuItemClick$, this.overlayClose$).pipe(
        filter(() => !this.disabled)
      );
      const visible$ = merge(this.inputVisible$, domTriggerVisible$);
      combineLatest([visible$, this.dropdownMenu.isChildSubMenuOpen$])
        .pipe(
          map(([visible, sub]) => visible || sub),
          auditTime(150),
          distinctUntilChanged(),
          filter(() => this.platform.isBrowser),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((visible: boolean) => {
          const element = this.matchWidthElement ? this.matchWidthElement.nativeElement : nativeElement;
          const triggerWidth = element.getBoundingClientRect().width;
          if (this.visible !== visible) {
            this.visibleChange.emit(visible);
          }
          this.visible = visible;
          if (visible) {
            /** set up overlayRef **/
            if (!this.overlayRef) {
              /** new overlay **/
              this.overlayRef = this.overlay.create({
                positionStrategy: this.positionStrategy,
                minWidth: triggerWidth,
                disposeOnNavigation: true,
                hasBackdrop: this.backdrop && this.trigger === 'click',
                scrollStrategy: this.overlay.scrollStrategies.reposition()
              });
              merge(
                this.overlayRef.backdropClick(),
                this.overlayRef.detachments(),
                this.overlayRef
                  .outsidePointerEvents()
                  .pipe(filter((e: MouseEvent) => !this.elementRef.nativeElement.contains(e.target))),
                this.overlayRef.keydownEvents().pipe(filter(e => e.keyCode === ESCAPE && !hasModifierKey(e)))
              )
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                  this.overlayClose$.next(false);
                });
            } else {
              /** update overlay config **/
              const overlayConfig = this.overlayRef.getConfig();
              overlayConfig.minWidth = triggerWidth;
            }
            /** open dropdown with animation **/
            this.positionStrategy.withPositions([POSITION_MAP[this.placement], ...listOfPositions]);
            /** reset portal if needed **/
            if (!this.portal || this.portal.templateRef !== this.dropdownMenu!.templateRef) {
              this.portal = new TemplatePortal(this.dropdownMenu!.templateRef, this.viewContainerRef);
            }
            this.overlayRef.attach(this.portal);
          } else {
            /** detach overlayRef if needed **/
            if (this.overlayRef) {
              this.overlayRef.detach();
            }
          }
        });

      this.dropdownMenu!.animationStateChange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
        if (event.toState === 'void') {
          if (this.overlayRef) {
            this.overlayRef.dispose();
          }
          this.overlayRef = null;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzVisible, nzDisabled, nzOverlayClassName, nzOverlayStyle, nzTrigger } = changes;
    if (nzTrigger) {
      this.trigger$.next(this.trigger);
    }
    if (nzVisible) {
      this.inputVisible$.next(this.visible);
    }
    if (nzDisabled) {
      const nativeElement = this.elementRef.nativeElement;
      if (this.disabled) {
        this.renderer.setAttribute(nativeElement, 'disabled', '');
        this.inputVisible$.next(false);
      } else {
        this.renderer.removeAttribute(nativeElement, 'disabled');
      }
    }
    if (nzOverlayClassName) {
      this.setDropdownMenuValue('nzOverlayClassName', this.overlayClassName);
    }
    if (nzOverlayStyle) {
      this.setDropdownMenuValue('nzOverlayStyle', this.overlayStyle);
    }
  }
}
