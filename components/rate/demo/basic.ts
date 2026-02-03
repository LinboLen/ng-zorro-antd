import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'tri-demo-rate-basic',
  imports: [FormsModule, TriRateModule],
  template: `<tri-rate [ngModel]="0" />`
})
export class TriDemoRateBasicComponent {}
