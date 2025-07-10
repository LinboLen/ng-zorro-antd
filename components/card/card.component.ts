/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { NgStyleInterface, TriSizeDSType } from 'ng-zorro-antd/core/types';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

import { TriCardGridDirective } from './card-grid.directive';
import { TriCardTabComponent } from './card-tab.component';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'card';

@Component({
  selector: '',
  exportAs: 'triCard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (title || extra || listOfNzCardTabComponent) {
      <div class="tri-card-head">
        <div class="tri-card-head-wrapper">
          @if (title) {
            <div class="tri-card-head-title">
              <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
            </div>
          }
          @if (extra) {
            <div class="tri-card-extra">
              <ng-container *stringTemplateOutlet="extra">{{ extra }}</ng-container>
            </div>
          }
        </div>
        @if (listOfNzCardTabComponent) {
          <ng-template [ngTemplateOutlet]="listOfNzCardTabComponent.template" />
        }
      </div>
    }

    @if (cover) {
      <div class="tri-card-cover">
        <ng-template [ngTemplateOutlet]="cover" />
      </div>
    }

    <div class="tri-card-body" [style]="bodyStyle">
      @if (loading) {
        <tri-skeleton [active]="true" [title]="false" [paragraph]="{ rows: 4 }"></tri-skeleton>
      } @else {
        <ng-content />
      }
    </div>
    @if (actions.length) {
      <ul class="tri-card-actions">
        @for (action of actions; track $index) {
          <li [style.width.%]="100 / actions.length">
            <span><ng-template [ngTemplateOutlet]="action" /></span>
          </li>
        }
      </ul>
    }
  `,
  host: {
    class: 'tri-card',
    '[class.tri-card-loading]': 'loading',
    '[class.tri-card-bordered]': 'bordered',
    '[class.tri-card-hoverable]': 'hoverable',
    '[class.tri-card-small]': 'size === "small"',
    '[class.tri-card-contain-grid]': 'listOfNzCardGridDirective && listOfNzCardGridDirective.length',
    '[class.tri-card-type-inner]': 'type === "inner"',
    '[class.tri-card-contain-tabs]': '!!listOfNzCardTabComponent',
    '[class.tri-card-rtl]': `dir === 'rtl'`
  },
  imports: [TriOutletModule, NgTemplateOutlet, TriSkeletonModule]
})
export class TriCardComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  @Input({ transform: booleanAttribute }) @WithConfig() bordered: boolean = true;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) @WithConfig() hoverable: boolean = false;
  @Input() bodyStyle: NgStyleInterface | null = null;
  @Input() cover?: TemplateRef<void>;
  @Input() actions: Array<TemplateRef<void>> = [];
  @Input() type: string | 'inner' | null = null;
  @Input() @WithConfig() size: TriSizeDSType = 'default';
  @Input() title?: string | TemplateRef<void>;
  @Input() extra?: string | TemplateRef<void>;
  @ContentChild(TriCardTabComponent, { static: false }) listOfNzCardTabComponent?: TriCardTabComponent;
  @ContentChildren(TriCardGridDirective) listOfNzCardGridDirective!: QueryList<TriCardGridDirective>;
  dir: Direction = 'ltr';

  constructor() {
    onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }
}
