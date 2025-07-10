/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  QueryList,
  TemplateRef,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriSpaceItemDirective } from './space-item.directive';
import { TriSpaceAlign, TriSpaceDirection, TriSpaceSize, TriSpaceType } from './types';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'space';
const SPACE_SIZE: Record<TriSpaceType, number> = {
  small: 8,
  middle: 16,
  large: 24
};

@Component({
  selector: '',
  exportAs: 'triSpace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
    @for (item of items; track item; let last = $last; let index = $index) {
      <div
        class="tri-space-item"
        [style.margin-block-end.px]="direction === 'vertical' ? (last ? null : spaceSize) : null"
        [style.margin-inline-end.px]="direction === 'horizontal' ? (last ? null : spaceSize) : null"
      >
        <ng-container [ngTemplateOutlet]="item"></ng-container>
      </div>
      @if (split && !last) {
        <span
          class="tri-space-split"
          [style.margin-block-end.px]="direction === 'vertical' ? (last ? null : spaceSize) : null"
          [style.margin-inline-end.px]="direction === 'horizontal' ? (last ? null : spaceSize) : null"
        >
          <ng-template [stringTemplateOutlet]="split" [stringTemplateOutletContext]="{ $implicit: index }">{{ split }}</ng-template>
        </span>
      }
    }
  `,
  host: {
    class: 'tri-space',
    '[class.tri-space-horizontal]': 'direction === "horizontal"',
    '[class.tri-space-vertical]': 'direction === "vertical"',
    '[class.tri-space-align-start]': 'mergedAlign === "start"',
    '[class.tri-space-align-end]': 'mergedAlign === "end"',
    '[class.tri-space-align-center]': 'mergedAlign === "center"',
    '[class.tri-space-align-baseline]': 'mergedAlign === "baseline"',
    '[style.flex-wrap]': 'nzWrap ? "wrap" : null'
  },
  imports: [NgTemplateOutlet, TriStringTemplateOutletDirective]
})
export class TriSpaceComponent implements OnChanges, AfterContentInit {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  configService = inject(TriConfigService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @Input() direction: TriSpaceDirection = 'horizontal';
  @Input() align?: TriSpaceAlign;
  @Input() split: TemplateRef<{ $implicit: number }> | string | null = null;
  @Input({ transform: booleanAttribute }) wrap: boolean = false;
  @Input() @WithConfig() size: TriSpaceSize = 'small';

  @ContentChildren(TriSpaceItemDirective, { read: TemplateRef }) items!: QueryList<TemplateRef<TriSafeAny>>;

  mergedAlign?: TriSpaceAlign;
  spaceSize: number = SPACE_SIZE.small;

  private updateSpaceItems(): void {
    const numberSize = typeof this.size === 'string' ? SPACE_SIZE[this.size] : this.size;
    this.spaceSize = numberSize / (this.split ? 2 : 1);
    this.cdr.markForCheck();
  }

  ngOnChanges(): void {
    this.updateSpaceItems();
    this.mergedAlign = this.align === undefined && this.direction === 'horizontal' ? 'center' : this.align;
  }

  ngAfterContentInit(): void {
    this.updateSpaceItems();
    this.items.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }
}
