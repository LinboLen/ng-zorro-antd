import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-extra-footer',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker [renderExtraFooter]="footerRender"></tri-date-picker>
    <br />
    <tri-date-picker [renderExtraFooter]="plainFooter" showTime></tri-date-picker>
    <tri-range-picker [renderExtraFooter]="footerRender"></tri-range-picker>
    <tri-range-picker [renderExtraFooter]="plainFooter" showTime></tri-range-picker>
    <tri-date-picker mode="month" [renderExtraFooter]="footerRender"></tri-date-picker>
  `,
  styles: [
    `
      nz-date-picker,
      nz-range-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoDatePickerExtraFooterComponent {
  plainFooter = 'plain extra footer';
  footerRender = (): string => 'extra footer';
}
