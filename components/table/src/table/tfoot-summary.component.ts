/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriTableStyleService } from '../table-style.service';
import { TriTableSummaryFixedType } from '../table.types';

function fixedAttribute(value: TriTableSummaryFixedType | boolean | unknown): TriTableSummaryFixedType | null {
  return value === 'top' || value === 'bottom' ? value : booleanAttribute(value) ? 'bottom' : null;
}

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
    @if (!isInsideTable || !fixed) {
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
    }
  `,
  imports: [NgTemplateOutlet],
  host: {
    '[class.tri-table-summary]': '!isInsideTable || !fixed'
  }
})
export class TriTfootSummaryComponent implements OnInit, OnChanges {
  @Input({ transform: fixedAttribute }) fixed: TriTableSummaryFixedType | null = null;
  @ViewChild('contentTemplate', { static: true }) templateRef!: TemplateRef<TriSafeAny>;
  private tableStyleService = inject(TriTableStyleService, { optional: true });
  isInsideTable = !!this.tableStyleService;

  ngOnInit(): void {
    this.tableStyleService?.setTfootTemplate(this.templateRef);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzFixed } = changes;
    this.tableStyleService?.setTfootFixed(nzFixed.currentValue);
  }
}
