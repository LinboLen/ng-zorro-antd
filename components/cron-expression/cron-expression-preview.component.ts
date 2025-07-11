/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';

import { TriCronExpressionCronErrorI18n } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-cron-expression-preview',
  exportAs: 'triCronExpressionPreview',
  template: `
    <div class="tri-collapse tri-collapse-borderless tri-cron-expression-preview">
      <div class="tri-cron-expression-preview-dateTime" [class.tri-cron-expression-preview-dateTime-center]="!isExpand">
        @if (visible) {
          @if (!semantic) {
            {{ TimeList[0] | date: 'yyyy-MM-dd HH:mm:ss' }}
          } @else {
            <ng-template [ngTemplateOutlet]="semantic" />
          }
        } @else {
          {{ locale.cronError }}
        }
      </div>
      @if (visible && !isExpand) {
        <div class="tri-cron-expression-preview-content">
          <ul class="tri-cron-expression-preview-list">
            @for (item of TimeList; track item) {
              <li>
                {{ item | date: 'yyyy-MM-dd HH:mm:ss' }}
              </li>
            }
            <li><a (click)="loadMorePreview.emit()">···</a></li>
          </ul>
        </div>
      }

      <ul class="tri-cron-expression-preview-icon">
        @if (isExpand) {
          <li><tri-icon type="down" theme="outline" (click)="setExpand()" /></li>
        } @else {
          <li><tri-icon type="up" theme="outline" (click)="setExpand()" /></li>
        }
      </ul>
    </div>
  `,
  imports: [NgTemplateOutlet, DatePipe, TriIconModule]
})
export class TriCronExpressionPreviewComponent {
  private cdr = inject(ChangeDetectorRef);
  @Input() TimeList: Date[] = [];
  @Input({ transform: booleanAttribute }) visible: boolean = true;
  @Input() locale!: TriCronExpressionCronErrorI18n;
  @Input() semantic: TemplateRef<void> | null = null;
  @Output() readonly loadMorePreview = new EventEmitter<void>();

  isExpand: boolean = true;

  setExpand(): void {
    this.isExpand = !this.isExpand;
    this.cdr.markForCheck();
  }
}
