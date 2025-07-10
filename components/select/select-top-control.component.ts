/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BACKSPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
  numberAttribute,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriSelectItemComponent } from './select-item.component';
import { TriSelectPlaceholderComponent } from './select-placeholder.component';
import { TriSelectSearchComponent } from './select-search.component';
import { TriSelectItemInterface, TriSelectModeType, TriSelectTopControlItemType } from './select.types';

@Component({
  selector: '',
  exportAs: 'triSelectTopControl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!--single mode-->
    @switch (mode) {
      @case ('default') {
        <tri-select-search
          [id]="id"
          [disabled]="disabled"
          [value]="inputValue!"
          [showInput]="showSearch"
          [mirrorSync]="false"
          [autofocus]="autofocus"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></tri-select-search>
        @if (isShowSingleLabel) {
          <tri-select-item
            [removeIcon]="removeIcon"
            [label]="label"
            [contentTemplateOutlet]="customTemplate"
            [contentTemplateOutletContext]="listOfTopItem[0]"
          ></tri-select-item>
        }
      }
      @default {
        <!--multiple or tags mode-->
        @for (item of listOfSlicedItem; track value) {
          <tri-select-item
            [removeIcon]="removeIcon"
            [label]="label"
            [disabled]="disabled || disabled"
            [contentTemplateOutlet]="item.contentTemplateOutlet"
            deletable
            [contentTemplateOutletContext]="item.contentTemplateOutletContext"
            (delete)="onDeleteItem(item.contentTemplateOutletContext)"
          ></tri-select-item>
        }
        <tri-select-search
          [id]="id"
          [disabled]="disabled"
          [value]="inputValue!"
          [autofocus]="autofocus"
          [showInput]="true"
          [mirrorSync]="true"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></tri-select-search>
      }
    }
    @if (isShowPlaceholder) {
      <tri-select-placeholder [placeholder]="placeHolder"></tri-select-placeholder>
    }
  `,
  host: { class: 'tri-select-selector' },
  imports: [TriSelectSearchComponent, TriSelectItemComponent, TriSelectPlaceholderComponent]
})
export class TriSelectTopControlComponent implements OnChanges, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  readonly noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });

  @Input() id: string | null = null;
  @Input() showSearch = false;
  @Input() placeHolder: string | TemplateRef<TriSafeAny> | null = null;
  @Input() open = false;
  @Input({ transform: numberAttribute }) maxTagCount: number = Infinity;
  @Input() autofocus = false;
  @Input() disabled = false;
  @Input() mode: TriSelectModeType = 'default';
  @Input() customTemplate: TemplateRef<{ $implicit: TriSelectItemInterface }> | null = null;
  @Input() maxTagPlaceholder: TemplateRef<{ $implicit: TriSafeAny[] }> | null = null;
  @Input() removeIcon: TemplateRef<TriSafeAny> | null = null;
  @Input() listOfTopItem: TriSelectItemInterface[] = [];
  @Input() tokenSeparators: string[] = [];
  @Output() readonly tokenize = new EventEmitter<string[]>();
  @Output() readonly inputValueChange = new EventEmitter<string>();
  @Output() readonly deleteItem = new EventEmitter<TriSelectItemInterface>();
  @ViewChild(TriSelectSearchComponent) selectSearchComponent!: TriSelectSearchComponent;
  listOfSlicedItem: TriSelectTopControlItemType[] = [];
  isShowPlaceholder = true;
  isShowSingleLabel = false;
  isComposing = false;
  inputValue: string | null = null;

  updateTemplateVariable(): void {
    const isSelectedValueEmpty = this.listOfTopItem.length === 0;
    this.isShowPlaceholder = isSelectedValueEmpty && !this.isComposing && !this.inputValue;
    this.isShowSingleLabel = !isSelectedValueEmpty && !this.isComposing && !this.inputValue;
  }

  isComposingChange(isComposing: boolean): void {
    this.isComposing = isComposing;
    this.updateTemplateVariable();
  }

  onInputValueChange(value: string): void {
    if (value !== this.inputValue) {
      this.inputValue = value;
      this.updateTemplateVariable();
      this.inputValueChange.emit(value);
      this.tokenSeparate(value, this.tokenSeparators);
    }
  }

  tokenSeparate(inputValue: string, tokenSeparators: string[]): void {
    const includesSeparators = (str: string, separators: string[]): boolean => {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < separators.length; ++i) {
        if (str.lastIndexOf(separators[i]) > 0) {
          return true;
        }
      }
      return false;
    };
    const splitBySeparators = (str: string, separators: string[]): string[] => {
      const reg = new RegExp(`[${separators.join()}]`);
      const array = str.split(reg).filter(token => token);
      return [...new Set(array)];
    };
    if (
      inputValue &&
      inputValue.length &&
      tokenSeparators.length &&
      this.mode !== 'default' &&
      includesSeparators(inputValue, tokenSeparators)
    ) {
      const listOfLabel = splitBySeparators(inputValue, tokenSeparators);
      this.tokenize.next(listOfLabel);
    }
  }

  clearInputValue(): void {
    if (this.selectSearchComponent) {
      this.selectSearchComponent.clearInputValue();
    }
  }

  focus(): void {
    if (this.selectSearchComponent) {
      this.selectSearchComponent.focus();
    }
  }

  blur(): void {
    if (this.selectSearchComponent) {
      this.selectSearchComponent.blur();
    }
  }

  onDeleteItem(item: TriSelectItemInterface): void {
    if (!this.disabled && !item.nzDisabled) {
      this.deleteItem.next(item);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { listOfTopItem, maxTagCount, customTemplate, maxTagPlaceholder } = changes;
    if (listOfTopItem) {
      this.updateTemplateVariable();
    }
    if (listOfTopItem || maxTagCount || customTemplate || maxTagPlaceholder) {
      const listOfSlicedItem: TriSelectTopControlItemType[] = this.listOfTopItem.slice(0, this.maxTagCount).map(o => ({
        nzLabel: o.nzLabel,
        nzValue: o.nzValue,
        nzDisabled: o.nzDisabled,
        contentTemplateOutlet: this.customTemplate,
        contentTemplateOutletContext: o
      }));
      if (this.listOfTopItem.length > this.maxTagCount) {
        const exceededLabel = `+ ${this.listOfTopItem.length - this.maxTagCount} ...`;
        const listOfSelectedValue = this.listOfTopItem.map(item => item.nzValue);
        const exceededItem = {
          nzLabel: exceededLabel,
          nzValue: '$$__nz_exceeded_item',
          nzDisabled: true,
          contentTemplateOutlet: this.maxTagPlaceholder,
          contentTemplateOutletContext: listOfSelectedValue.slice(this.maxTagCount)
        };
        listOfSlicedItem.push(exceededItem);
      }
      this.listOfSlicedItem = listOfSlicedItem;
    }
  }

  ngOnInit(): void {
    fromEventOutsideAngular<MouseEvent>(this.elementRef.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        // `HTMLElement.focus()` is a native DOM API that doesn't require Angular to run change detection.
        if (event.target !== this.selectSearchComponent.inputElement.nativeElement) {
          this.selectSearchComponent.focus();
        }
      });

    fromEventOutsideAngular<KeyboardEvent>(this.elementRef.nativeElement, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event.target instanceof HTMLInputElement) {
          const inputValue = event.target.value;

          if (event.keyCode === BACKSPACE && this.mode !== 'default' && !inputValue && this.listOfTopItem.length > 0) {
            event.preventDefault();
            // Run change detection only if the user has pressed the `Backspace` key and the following condition is met.
            this.ngZone.run(() => this.onDeleteItem(this.listOfTopItem[this.listOfTopItem.length - 1]));
          }
        }
      });
  }
}
