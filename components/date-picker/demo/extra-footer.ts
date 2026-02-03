import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-extra-footer',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker [renderExtraFooter]="footerRender" />
    <br />
    <tri-date-picker [renderExtraFooter]="plainFooter" showTime />
    <tri-range-picker [renderExtraFooter]="footerRender" />
    <tri-range-picker [renderExtraFooter]="plainFooter" showTime />
    <tri-date-picker mode="month" [renderExtraFooter]="footerRender" />
  `,
  styles: `
    nz-date-picker,
    nz-range-picker {
      margin: 0 8px 12px 0;
    }
  `
})
export class TriDemoDatePickerExtraFooterComponent {
  plainFooter = 'plain extra footer';
  footerRender = (): string => 'extra footer';
}
