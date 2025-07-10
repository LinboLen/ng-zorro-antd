import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: '',
  imports: [FormsModule, TriRateModule],
  template: `<tri-rate [ngModel]="0"></tri-rate>`
})
export class TriDemoRateBasicComponent {}
