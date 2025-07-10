import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: '',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker [dateRender]="tplRender"></tri-date-picker>
    <tri-range-picker [dateRender]="tplRender"></tri-range-picker>

    <ng-template #tplRender let-current>
      <div class="tri-picker-cell-inner" [class.border]="current.getDate() === 1"> {{ current.getDate() }} </div>
    </ng-template>

    <br />
    <tri-date-picker mode="quarter" format="yyyy年Q季度" [dateRender]="tplQuarterRender"></tri-date-picker>
    <ng-template #tplQuarterRender let-current>
      <div class="tri-picker-cell-inner">{{ getQuarter(current) }}</div>
    </ng-template>
  `,
  styles: [
    `
      nz-date-picker,
      nz-range-picker {
        margin: 0 8px 12px 0;
      }
      .border {
        border: 1px solid #1890ff;
        border-radius: 50%;
      }
    `
  ]
})
export class TriDemoDatePickerDateRenderComponent {
  getQuarter(date: Date): string {
    const quarter = Math.floor((date.getMonth() + 3) / 3);
    const quarterMapper: Record<string, string> = { 1: '一', 2: '二', 3: '三', 4: '四' };
    return `${quarterMapper[quarter]}季度`;
  }
}
