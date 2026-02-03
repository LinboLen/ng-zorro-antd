/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  isDevMode,
  numberAttribute,
  Renderer2
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { isNotNil } from 'ng-zorro-antd/core/util';

import { TriInputDirective } from './input.directive';

@Component({
  selector: 'tri-textarea-count',
  template: `<ng-content select="textarea[nz-input]" />`,
  host: {
    class: 'tri-input-textarea-show-count'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriTextareaCountComponent implements AfterContentInit {
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  @ContentChild(TriInputDirective, { static: true }) inputDirective!: TriInputDirective;
  @Input({ transform: numberAttribute }) maxCharacterCount: number = 0;
  @Input() computeCharacterCount: (v: string) => number = v => v.length;
  @Input() formatter: (cur: number, max: number) => string = (c, m) => `${c}${m > 0 ? `/${m}` : ``}`;

  ngAfterContentInit(): void {
    if (!this.inputDirective && isDevMode()) {
      throw new Error('[nz-textarea-count]: Could not find matching textarea[nz-input] child.');
    }

    if (this.inputDirective.ngControl) {
      const valueChanges = this.inputDirective.ngControl.valueChanges || EMPTY;
      valueChanges
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map(() => this.inputDirective.ngControl!.value),
          startWith(this.inputDirective.ngControl.value as string)
        )
        .subscribe(value => {
          this.setDataCount(value);
        });
    }
  }

  setDataCount(value: string): void {
    const inputValue = isNotNil(value) ? String(value) : '';
    const currentCount = this.computeCharacterCount(inputValue);
    const dataCount = this.formatter(currentCount, this.maxCharacterCount);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-count', dataCount);
  }
}
