/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { collapseMotion } from 'ng-zorro-antd/core/animation';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriMenuModeType } from './menu.types';

@Component({
  selector: '',
  animations: [collapseMotion],
  exportAs: 'triSubmenuInlineChild',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template [ngTemplateOutlet]="templateOutlet"></ng-template>`,
  host: {
    class: 'tri-menu ant-menu-inline ant-menu-sub',
    '[class.tri-menu-rtl]': `dir === 'rtl'`,
    '[@collapseMotion]': 'expandState'
  },
  imports: [NgTemplateOutlet]
})
export class TriSubmenuInlineChildComponent implements OnInit, OnChanges {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  @Input() templateOutlet: TemplateRef<TriSafeAny> | null = null;
  @Input() menuClass: string = '';
  @Input() mode: TriMenuModeType = 'vertical';
  @Input() open = false;
  listOfCacheClassName: string[] = [];
  expandState = 'collapsed';
  dir: Direction = 'ltr';

  calcMotionState(): void {
    this.expandState = this.open ? 'expanded' : 'collapsed';
  }

  ngOnInit(): void {
    this.calcMotionState();

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mode, nzOpen, menuClass } = changes;
    if (mode || nzOpen) {
      this.calcMotionState();
    }
    if (menuClass) {
      if (this.listOfCacheClassName.length) {
        this.listOfCacheClassName.forEach(className => {
          if (className) {
            this.renderer.removeClass(this.elementRef.nativeElement, className);
          }
        });
      }
      if (this.menuClass) {
        this.listOfCacheClassName = this.menuClass.split(' ');
        this.listOfCacheClassName.forEach(className => {
          if (className) {
            this.renderer.addClass(this.elementRef.nativeElement, className);
          }
        });
      }
    }
  }
}
