/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { COMPOSITION_BUFFER_MODE, FormsModule } from '@angular/forms';

import { requestAnimationFrame } from 'ng-zorro-antd/core/polyfill';

@Component({
  selector: 'tri-select-search',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #inputElement
      [attr.id]="id"
      autocomplete="off"
      class="tri-select-selection-search-input"
      [ngModel]="value"
      [attr.autofocus]="autofocus ? 'autofocus' : null"
      [disabled]="disabled"
      [style.opacity]="showInput ? null : 0"
      (ngModelChange)="onValueChange($event)"
      (compositionstart)="setCompositionState(true)"
      (compositionend)="setCompositionState(false)"
    />
    @if (mirrorSync) {
      <span #mirrorElement class="tri-select-selection-search-mirror"></span>
    }
  `,
  host: { class: 'tri-select-selection-search' },
  providers: [{ provide: COMPOSITION_BUFFER_MODE, useValue: false }],
  imports: [FormsModule]
})
export class TriSelectSearchComponent implements AfterViewInit, OnChanges {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly focusMonitor = inject(FocusMonitor);

  @Input() id: string | null = null;
  @Input() disabled = false;
  @Input() mirrorSync = false;
  @Input() showInput = true;
  @Input() focusTrigger = false;
  @Input() value = '';
  @Input() autofocus = false;
  @Output() readonly valueChange = new EventEmitter<string>();
  @Output() readonly isComposingChange = new EventEmitter<boolean>();
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef;
  @ViewChild('mirrorElement', { static: false }) mirrorElement?: ElementRef;

  setCompositionState(isComposing: boolean): void {
    this.isComposingChange.next(isComposing);
  }

  onValueChange(value: string): void {
    this.value = value;
    this.valueChange.next(value);
    if (this.mirrorSync) {
      this.syncMirrorWidth();
    }
  }

  clearInputValue(): void {
    const inputDOM = this.inputElement.nativeElement;
    inputDOM.value = '';
    this.onValueChange('');
  }

  syncMirrorWidth(): void {
    requestAnimationFrame(() => {
      const mirrorDOM = this.mirrorElement!.nativeElement;
      const hostDOM = this.elementRef.nativeElement;
      const inputDOM = this.inputElement.nativeElement;
      this.renderer.removeStyle(hostDOM, 'width');
      this.renderer.setProperty(mirrorDOM, 'textContent', `${inputDOM.value}\u00a0`);
      this.renderer.setStyle(hostDOM, 'width', `${mirrorDOM.scrollWidth}px`);
    });
  }

  focus(): void {
    this.focusMonitor.focusVia(this.inputElement, 'keyboard');
  }

  blur(): void {
    this.inputElement.nativeElement.blur();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const inputDOM = this.inputElement.nativeElement;
    const { focusTrigger, showInput } = changes;

    if (showInput) {
      if (this.showInput) {
        this.renderer.removeAttribute(inputDOM, 'readonly');
      } else {
        this.renderer.setAttribute(inputDOM, 'readonly', 'readonly');
      }
    }

    // IE11 cannot input value if focused before removing readonly
    if (focusTrigger && focusTrigger.currentValue === true && focusTrigger.previousValue === false) {
      inputDOM.focus();
    }
  }

  ngAfterViewInit(): void {
    if (this.mirrorSync) {
      this.syncMirrorWidth();
    }
    if (this.autofocus) {
      this.focus();
    }
  }
}
