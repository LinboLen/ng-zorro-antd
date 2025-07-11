/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  inject,
  type AfterViewInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgClassInterface } from 'ng-zorro-antd/core/types';
import { isNotNil } from 'ng-zorro-antd/core/util';

import { TriRowDirective } from './row.directive';

export interface EmbeddedProperty {
  span?: number;
  pull?: number;
  push?: number;
  offset?: number;
  order?: number;
}

@Directive({
  selector: '[tri-col],tri-col,tri-form-control,tri-form-label',
  exportAs: 'triCol',
  host: {
    '[style.flex]': 'hostFlexStyle'
  }
})
export class TriColDirective implements OnInit, OnChanges, AfterViewInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  private classMap: Record<string, boolean> = {};
  hostFlexStyle: string | null = null;
  dir: Direction = 'ltr';
  @Input() flex: string | number | null = null;
  @Input() span: string | number | null = null;
  @Input() order: string | number | null = null;
  @Input() offset: string | number | null = null;
  @Input() push: string | number | null = null;
  @Input() pull: string | number | null = null;
  @Input() xs: string | number | EmbeddedProperty | null = null;
  @Input() sm: string | number | EmbeddedProperty | null = null;
  @Input() md: string | number | EmbeddedProperty | null = null;
  @Input() lg: string | number | EmbeddedProperty | null = null;
  @Input() xl: string | number | EmbeddedProperty | null = null;
  @Input() xXl: string | number | EmbeddedProperty | null = null;

  setHostClassMap(): void {
    const hostClassMap = {
      ['ant-col']: true,
      [`ant-col-${this.span}`]: isNotNil(this.span),
      [`ant-col-order-${this.order}`]: isNotNil(this.order),
      [`ant-col-offset-${this.offset}`]: isNotNil(this.offset),
      [`ant-col-pull-${this.pull}`]: isNotNil(this.pull),
      [`ant-col-push-${this.push}`]: isNotNil(this.push),
      ['ant-col-rtl']: this.dir === 'rtl',
      ...this.generateClass()
    };
    for (const i in this.classMap) {
      if (this.classMap.hasOwnProperty(i)) {
        this.renderer.removeClass(this.elementRef.nativeElement, i);
      }
    }
    this.classMap = { ...hostClassMap };
    for (const i in this.classMap) {
      if (this.classMap.hasOwnProperty(i) && this.classMap[i]) {
        this.renderer.addClass(this.elementRef.nativeElement, i);
      }
    }
  }

  setHostFlexStyle(): void {
    this.hostFlexStyle = this.parseFlex(this.flex);
  }

  parseFlex(flex: number | string | null): string | null {
    if (typeof flex === 'number') {
      return `${flex} ${flex} auto`;
    } else if (typeof flex === 'string') {
      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
      }
    }
    return flex;
  }

  generateClass(): object {
    const listOfSizeInputName: Array<keyof TriColDirective> = ['nzXs', 'nzSm', 'nzMd', 'nzLg', 'nzXl', 'nzXXl'];
    const listClassMap: NgClassInterface = {};
    listOfSizeInputName.forEach(name => {
      const sizeName = name.replace('nz', '').toLowerCase();
      if (isNotNil(this[name])) {
        if (typeof this[name] === 'number' || typeof this[name] === 'string') {
          listClassMap[`ant-col-${sizeName}-${this[name]}`] = true;
        } else {
          const embedded = this[name] as EmbeddedProperty;
          const prefixArray: Array<keyof EmbeddedProperty> = ['span', 'pull', 'push', 'offset', 'order'];
          prefixArray.forEach(prefix => {
            const prefixClass = prefix === 'span' ? '-' : `-${prefix}-`;
            listClassMap[`ant-col-${sizeName}${prefixClass}${embedded[prefix]}`] =
              embedded && isNotNil(embedded[prefix]);
          });
        }
      }
    });
    return listClassMap;
  }

  rowDirective = inject(TriRowDirective, { host: true, optional: true });

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.setHostClassMap();
    });

    this.setHostClassMap();
    this.setHostFlexStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setHostClassMap();
    const { nzFlex } = changes;
    if (nzFlex) {
      this.setHostFlexStyle();
    }
  }

  ngAfterViewInit(): void {
    if (this.rowDirective) {
      this.rowDirective.actualGutter$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([horizontalGutter, verticalGutter]) => {
          const renderGutter = (name: string, gutter: number | null): void => {
            const nativeElement = this.elementRef.nativeElement;
            if (gutter !== null) {
              this.renderer.setStyle(nativeElement, name, `${gutter / 2}px`);
            }
          };
          renderGutter('padding-left', horizontalGutter);
          renderGutter('padding-right', horizontalGutter);
          renderGutter('padding-top', verticalGutter);
          renderGutter('padding-bottom', verticalGutter);
        });
    }
  }
}
