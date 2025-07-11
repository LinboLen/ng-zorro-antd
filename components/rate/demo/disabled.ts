import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'tri-demo-rate-disabled',
  imports: [FormsModule, TriRateModule],
  template: `<tri-rate [ngModel]="2" disabled></tri-rate>`
})
export class TriDemoRateDisabledComponent {}
