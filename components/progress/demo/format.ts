import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'tri-demo-progress-format',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="75" type="circle" [format]="formatOne" />
    <tri-progress [percent]="100" type="circle" [format]="formatTwo" />
  `,
  styles: `
    nz-progress {
      display: inline-block;
      margin-inline-end: 8px;
      margin-bottom: 8px;
    }
  `
})
export class TriDemoProgressFormatComponent {
  formatOne = (percent: number): string => `${percent} Days`;
  formatTwo = (): string => `Done`;
}
