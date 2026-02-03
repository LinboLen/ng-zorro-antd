/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriOverlayModule } from 'ng-zorro-antd/core/overlay';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriEmptyModule } from 'ng-zorro-antd/empty';

import { TriOptionItemGroupComponent } from './option-item-group.component';
import { TriOptionItemComponent } from './option-item.component';
import { TriSelectItemInterface, TriSelectModeType } from './select.types';

@Component({
  selector: 'tri-option-container',
  exportAs: 'triOptionContainer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div>
      @if (listOfContainerItem.length === 0) {
        <div class="tri-select-item-empty">
          <tri-embed-empty componentName="select" [specificContent]="notFoundContent!" />
        </div>
      }
      <cdk-virtual-scroll-viewport
        [class.full-width]="!matchWidth"
        [itemSize]="itemSize"
        [maxBufferPx]="itemSize * maxItemLength"
        [minBufferPx]="itemSize * maxItemLength"
        (scrolledIndexChange)="onScrolledIndexChange($event)"
        [style.height.px]="listOfContainerItem.length * itemSize"
        [style.max-height.px]="itemSize * maxItemLength"
      >
        <ng-template
          cdkVirtualFor
          [cdkVirtualForOf]="listOfContainerItem"
          [cdkVirtualForTrackBy]="trackValue"
          [cdkVirtualForTemplateCacheSize]="0"
          let-item
        >
          @switch (item.type) {
            @case ('group') {
              <tri-option-item-group [label]="item.groupLabel ?? null" />
            }
            @case ('item') {
              <tri-option-item
                [icon]="menuItemSelectedIcon"
                [customContent]="customContent"
                [template]="item.template ?? null"
                [grouped]="!!item.groupLabel"
                [disabled]="
                  item.nzDisabled || disabledountReached && !listOfSelectedValue.includes(item['nzValue']))
                "
                [showState]="mode === 'tags' || mode === 'multiple'"
                [title]="title"
                [label]="label"
                [compareWith]="compareWith"
                [activatedValue]="activatedValue"
                [listOfSelectedValue]="listOfSelectedValue"
                [value]="value"
                (itemHover)="onItemHover($event)"
                (itemClick)="onItemClick($event)"
              />
            }
          }
        </ng-template>
      </cdk-virtual-scroll-viewport>
      <ng-template [ngTemplateOutlet]="dropdownRender" />
    </div>
  `,
  host: { class: 'tri-select-dropdown' },
  imports: [
    TriEmptyModule,
    TriOptionItemGroupComponent,
    TriOptionItemComponent,
    NgTemplateOutlet,
    OverlayModule,
    TriOverlayModule
  ]
})
export class TriOptionContainerComponent implements OnChanges, AfterViewInit {
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  @Input() notFoundContent: string | TemplateRef<TriSafeAny> | undefined = undefined;
  @Input() menuItemSelectedIcon: TemplateRef<TriSafeAny> | null = null;
  @Input() dropdownRender: TemplateRef<TriSafeAny> | null = null;
  @Input() activatedValue: TriSafeAny | null = null;
  @Input() listOfSelectedValue: TriSafeAny[] = [];
  @Input() compareWith!: (o1: TriSafeAny, o2: TriSafeAny) => boolean;
  @Input() mode: TriSelectModeType = 'default';
  @Input() matchWidth = true;
  @Input() itemSize = 32;
  @Input() maxItemLength = 8;
  @Input() isMaxMultipleCountReached = false;
  @Input() listOfContainerItem: TriSelectItemInterface[] = [];
  @Output() readonly itemClick = new EventEmitter<TriSafeAny>();
  @Output() readonly scrollToBottom = new EventEmitter<void>();
  @ViewChild(CdkVirtualScrollViewport, { static: true }) cdkVirtualScrollViewport!: CdkVirtualScrollViewport;
  private scrolledIndex = 0;

  onItemClick(value: TriSafeAny): void {
    this.itemClick.emit(value);
  }

  onItemHover(value: TriSafeAny): void {
    // TODO: keydown.enter won't activate this value
    this.activatedValue = value;
  }

  trackValue(_index: number, option: TriSelectItemInterface): TriSafeAny {
    return option.key;
  }

  onScrolledIndexChange(index: number): void {
    this.scrolledIndex = index;
    if (index === this.listOfContainerItem.length - this.maxItemLength - 1) {
      this.scrollToBottom.emit();
    }
  }

  scrollToActivatedValue(): void {
    const index = this.listOfContainerItem.findIndex(item => this.compareWith(item.key, this.activatedValue));
    if (index < this.scrolledIndex || index >= this.scrolledIndex + this.maxItemLength) {
      this.cdkVirtualScrollViewport.scrollToIndex(index || 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { listOfContainerItem, activatedValue } = changes;
    if (listOfContainerItem || activatedValue) {
      this.scrollToActivatedValue();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => setTimeout(() => this.scrollToActivatedValue()));
    }
  }
}
