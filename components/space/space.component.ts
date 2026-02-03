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
  DestroyRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
  booleanAttribute,
  inject
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
  selector: 'tri-space,[tri-space]',
  exportAs: 'triSpace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @for (item of items; track item) {
      <div class="tri-space-item">
        <ng-container [ngTemplateOutlet]="item" />
      </div>
      @if (split && !$last) {
        <span class="tri-space-split">
          <ng-template [stringTemplateOutlet]="split" [stringTemplateOutletContext]="{ $implicit: $index }">{{ split }}</ng-template>
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
    '[style.flex-wrap]': 'nzWrap ? "wrap" : null',
    '[style.column-gap.px]': 'horizontalSize',
    '[style.row-gap.px]': 'verticalSize'
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
  @Input() @WithConfig() size: TriSpaceSize | [TriSpaceSize, TriSpaceSize] = 'small';

  @ContentChildren(TriSpaceItemDirective, { read: TemplateRef }) items!: QueryList<TemplateRef<TriSafeAny>>;

  mergedAlign?: TriSpaceAlign;
  horizontalSize!: number;
  verticalSize!: number;

  constructor() {
    this.updateSpaceSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzSize } = changes;
    if (nzSize) {
      this.updateSpaceSize();
    }
    this.mergedAlign = this.align === undefined && this.direction === 'horizontal' ? 'center' : this.align;
  }

  ngAfterContentInit(): void {
    this.items.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  private updateSpaceSize(): void {
    const { horizontalSize, verticalSize } = normalizeSpaceSize(this.size);
    this.horizontalSize = horizontalSize;
    this.verticalSize = verticalSize;
  }
}

function normalizeSpaceSize(size: TriSpaceSize | [TriSpaceSize, TriSpaceSize]): {
  horizontalSize: number;
  verticalSize: number;
} {
  const [horizontalSize, verticalSize] = (Array.isArray(size) ? size : ([size, size] as const)).map(s =>
    typeof s === 'number' ? s : SPACE_SIZE[s]
  );
  return { horizontalSize, verticalSize };
}
