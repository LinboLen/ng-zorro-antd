/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriTimelineItemComponent } from './timeline-item.component';
import { TimelineService } from './timeline.service';
import { TriTimelineMode, TriTimelinePosition } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  providers: [TimelineService],
  exportAs: 'triTimeline',
  template: `
    <ul
      class="tri-timeline"
      [class.tri-timeline-label]="hasLabelItem"
      [class.tri-timeline-right]="!hasLabelItem && mode === 'right'"
      [class.tri-timeline-alternate]="mode === 'alternate' || mode === 'custom'"
      [class.tri-timeline-pending]="!!pending"
      [class.tri-timeline-reverse]="reverse"
      [class.tri-timeline-rtl]="dir === 'rtl'"
    >
      <!-- pending dot (reversed) -->
      @if (reverse) {
        <ng-container [ngTemplateOutlet]="pendingTemplate"></ng-container>
      }
      <!-- timeline items -->
      @for (item of timelineItems; track item) {
        <ng-template [ngTemplateOutlet]="item.template"></ng-template>
      }
      @if (!reverse) {
        <ng-container [ngTemplateOutlet]="pendingTemplate"></ng-container>
      }
      <!-- pending dot -->
    </ul>
    <ng-template #pendingTemplate>
      @if (pending) {
        <li class="tri-timeline-item tri-timeline-item-pending">
          <div class="tri-timeline-item-tail"></div>
          <div class="tri-timeline-item-head tri-timeline-item-head-custom tri-timeline-item-head-blue">
            <ng-container *stringTemplateOutlet="pendingDot">
              {{ pendingDot }}
              @if (!pendingDot) {
                <tri-icon type="loading" />
              }
            </ng-container>
          </div>
          <div class="tri-timeline-item-content">
            <ng-container *stringTemplateOutlet="pending">
              {{ isPendingBoolean ? '' : nzPending }}
            </ng-container>
          </div>
        </li>
      }
    </ng-template>
    <!-- Grasp items -->
    <ng-content></ng-content>
  `,
  imports: [NgTemplateOutlet, TriOutletModule, TriIconModule]
})
export class TriTimelineComponent implements AfterContentInit, OnChanges, OnInit {
  private cdr = inject(ChangeDetectorRef);
  private timelineService = inject(TimelineService);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @ContentChildren(TriTimelineItemComponent) listOfItems!: QueryList<TriTimelineItemComponent>;

  @Input() mode: TriTimelineMode = 'left';
  @Input() pending?: string | boolean | TemplateRef<void>;
  @Input() pendingDot?: string | TemplateRef<void>;
  @Input({ transform: booleanAttribute }) reverse: boolean = false;

  isPendingBoolean: boolean = false;
  timelineItems: TriTimelineItemComponent[] = [];
  dir: Direction = 'ltr';
  hasLabelItem = false;

  ngOnChanges(changes: SimpleChanges): void {
    const { nzMode, nzReverse, nzPending } = changes;

    if (simpleChangeActivated(nzMode) || simpleChangeActivated(nzReverse)) {
      this.updateChildren();
    }

    if (nzPending) {
      this.isPendingBoolean = nzPending.currentValue === true;
    }
  }

  ngOnInit(): void {
    this.timelineService.check$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.markForCheck();
    });

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngAfterContentInit(): void {
    this.updateChildren();

    this.listOfItems.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateChildren();
    });
  }

  private updateChildren(): void {
    if (this.listOfItems && this.listOfItems.length) {
      const length = this.listOfItems.length;
      let hasLabelItem = false;

      this.listOfItems.forEach((item: TriTimelineItemComponent, index: number) => {
        item.isLast = !this.reverse ? index === length - 1 : index === 0;
        item._position = getInferredTimelineItemPosition(index, this.mode);

        if (!hasLabelItem && item.label) {
          hasLabelItem = true;
        }

        item.detectChanges();
      });

      this.timelineItems = this.reverse ? this.listOfItems.toArray().reverse() : this.listOfItems.toArray();
      this.hasLabelItem = hasLabelItem;
    } else {
      this.timelineItems = [];
      this.hasLabelItem = false;
    }

    this.cdr.markForCheck();
  }
}

function simpleChangeActivated(simpleChange?: SimpleChange): boolean {
  return !!(simpleChange && (simpleChange.previousValue !== simpleChange.currentValue || simpleChange.isFirstChange()));
}

function getInferredTimelineItemPosition(index: number, mode: TriTimelineMode): TriTimelinePosition | undefined {
  if (mode === 'custom') {
    return undefined;
  } else if (mode === 'left' || mode === 'right') {
    return mode;
  } else {
    return mode === 'alternate' && index % 2 === 0 ? 'left' : 'right';
  }
}
