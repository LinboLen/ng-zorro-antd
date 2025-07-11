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
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { auditTime, startWith, switchMap, tap } from 'rxjs/operators';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { warn } from 'ng-zorro-antd/core/logger';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzBreakpointEnum, TriBreakpointService, gridResponsiveMap } from 'ng-zorro-antd/core/services';

import { TriDescriptionsItemComponent } from './descriptions-item.component';
import { TriDescriptionsItemRenderProps, TriDescriptionsLayout, TriDescriptionsSize } from './typings';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'descriptions';
const defaultColumnMap: Record<NzBreakpointEnum, number> = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-descriptions',
  exportAs: 'triDescriptions',
  template: `
    @if (title || extra) {
      <div class="tri-descriptions-header">
        @if (title) {
          <div class="tri-descriptions-title">
            <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
          </div>
        }
        @if (extra) {
          <div class="tri-descriptions-extra">
            <ng-container *stringTemplateOutlet="extra">{{ extra }}</ng-container>
          </div>
        }
      </div>
    }

    <div class="tri-descriptions-view">
      <table>
        <tbody>
          @if (layout === 'horizontal') {
            @for (row of itemMatrix; track row; let i = $index) {
              <tr class="tri-descriptions-row">
                @for (item of row; track item; let isLast = $last) {
                  @if (!bordered) {
                    <td class="tri-descriptions-item" [colSpan]="item.span">
                      <div class="tri-descriptions-item-container">
                        <span class="tri-descriptions-item-label" [class.tri-descriptions-item-no-colon]="!colon">
                          <ng-container *stringTemplateOutlet="item.title">
                            {{ item.title }}
                          </ng-container>
                        </span>
                        <span class="tri-descriptions-item-content">
                          <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                        </span>
                      </div>
                    </td>
                  } @else {
                    <td class="tri-descriptions-item-label">
                      <ng-container *stringTemplateOutlet="item.title">
                        {{ item.title }}
                      </ng-container>
                    </td>
                    <td class="tri-descriptions-item-content" [colSpan]="item.span * 2 - 1">
                      <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                    </td>
                  }
                }
              </tr>
            }
          }

          @if (layout === 'vertical') {
            @if (!bordered) {
              @for (row of itemMatrix; track row; let i = $index) {
                <tr class="tri-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="tri-descriptions-item" [colSpan]="item.span">
                      <div class="tri-descriptions-item-container">
                        <span class="tri-descriptions-item-label" [class.tri-descriptions-item-no-colon]="!colon">
                          <ng-container *stringTemplateOutlet="item.title">
                            {{ item.title }}
                          </ng-container>
                        </span>
                      </div>
                    </td>
                  }
                </tr>
                <tr class="tri-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="tri-descriptions-item" [colSpan]="item.span">
                      <div class="tri-descriptions-item-container">
                        <span class="tri-descriptions-item-content">
                          <ng-template [ngTemplateOutlet]="item.content" />
                        </span>
                      </div>
                    </td>
                  }
                </tr>
              }
            } @else {
              @for (row of itemMatrix; track row; let i = $index) {
                <tr class="tri-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="tri-descriptions-item-label" [colSpan]="item.span">
                      <ng-container *stringTemplateOutlet="item.title">
                        {{ item.title }}
                      </ng-container>
                    </td>
                  }
                </tr>
                <tr class="tri-descriptions-row">
                  @for (item of row; track item; let isLast = $last) {
                    <td class="tri-descriptions-item-content" [colSpan]="item.span">
                      <ng-template [ngTemplateOutlet]="item.content" />
                    </td>
                  }
                </tr>
              }
            }
          }
        </tbody>
      </table>
    </div>
  `,
  host: {
    class: 'tri-descriptions',
    '[class.tri-descriptions-bordered]': 'bordered',
    '[class.tri-descriptions-middle]': 'size === "middle"',
    '[class.tri-descriptions-small]': 'size === "small"',
    '[class.tri-descriptions-rtl]': 'dir === "rtl"'
  },
  imports: [TriOutletModule, NgTemplateOutlet]
})
export class TriDescriptionsComponent implements OnChanges, AfterContentInit, OnInit {
  public configService = inject(TriConfigService);
  private cdr = inject(ChangeDetectorRef);
  private breakpointService = inject(TriBreakpointService);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @ContentChildren(TriDescriptionsItemComponent) items!: QueryList<TriDescriptionsItemComponent>;

  @Input({ transform: booleanAttribute }) @WithConfig() bordered: boolean = false;
  @Input() layout: TriDescriptionsLayout = 'horizontal';
  @Input() @WithConfig() column: number | Record<NzBreakpointEnum, number> = defaultColumnMap;
  @Input() @WithConfig() size: TriDescriptionsSize = 'default';
  @Input() title: string | TemplateRef<void> = '';
  @Input() extra?: string | TemplateRef<void>;
  @Input({ transform: booleanAttribute }) @WithConfig() colon: boolean = true;

  itemMatrix: TriDescriptionsItemRenderProps[][] = [];
  realColumn = 3;
  dir: Direction = 'ltr';

  private breakpoint: NzBreakpointEnum = NzBreakpointEnum.md;

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzColumn) {
      this.prepareMatrix();
    }
  }

  ngAfterContentInit(): void {
    const contentChange$ = this.items.changes.pipe(startWith(this.items));

    merge(
      contentChange$,
      contentChange$.pipe(switchMap(() => merge(...this.items.map(i => i.inputChange$)).pipe(auditTime(16)))),
      this.breakpointService.subscribe(gridResponsiveMap).pipe(tap(bp => (this.breakpoint = bp)))
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.prepareMatrix();
        this.cdr.markForCheck();
      });
  }

  /**
   * Prepare the render matrix according to description items' spans.
   */
  private prepareMatrix(): void {
    if (!this.items) {
      return;
    }

    let currentRow: TriDescriptionsItemRenderProps[] = [];
    let width = 0;

    const column = (this.realColumn = this.getColumn());
    const items = this.items.toArray();
    const length = items.length;
    const matrix: TriDescriptionsItemRenderProps[][] = [];
    const flushRow = (): void => {
      matrix.push(currentRow);
      currentRow = [];
      width = 0;
    };

    for (let i = 0; i < length; i++) {
      const item = items[i];
      const { title: title, content, span: span } = item;

      width += span;

      // If the last item make the row's length exceeds `nzColumn`, the last
      // item should take all the space left. This logic is implemented in the template.
      // Warn user about that.
      if (width >= column) {
        if (width > column) {
          warn(`"nzColumn" is ${column} but we have row length ${width}`);
        }
        currentRow.push({ title, content, span: column - (width - span) });
        flushRow();
      } else if (i === length - 1) {
        currentRow.push({ title, content, span: column - (width - span) });
        flushRow();
      } else {
        currentRow.push({ title, content, span });
      }
    }

    this.itemMatrix = matrix;
  }

  private getColumn(): number {
    if (typeof this.column !== 'number') {
      return this.column[this.breakpoint];
    }

    return this.column;
  }
}
