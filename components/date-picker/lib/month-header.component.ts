/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';

import { DateHelperService } from 'ng-zorro-antd/i18n';

import { TriDateMode } from '../standard-types';
import { AbstractPanelHeader } from './abstract-panel-header';
import { PanelSelector } from './interface';
import { transCompatFormat } from './util';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '', // eslint-disable-line @angular-eslint/component-selector
  templateUrl: './abstract-panel-header.html'
})
export class MonthHeaderComponent extends AbstractPanelHeader {
  private readonly dateHelper = inject(DateHelperService);

  override mode: TriDateMode = 'month';

  getSelectors(): PanelSelector[] {
    return [
      {
        className: `${this.prefixCls}-month-btn`,
        title: this.locale.yearSelect,
        onClick: () => {
          this.mode = 'year';
          this.changeMode('year');
        },
        label: this.dateHelper.format(this.value.nativeDate, transCompatFormat(this.locale.yearFormat))
      }
    ];
  }
}
