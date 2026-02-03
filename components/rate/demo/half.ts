import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'tri-demo-rate-half',
  imports: [FormsModule, TriRateModule],
  template: `<tri-rate [ngModel]="2.5" allowHalf />`
})
export class TriDemoRateHalfComponent {}
