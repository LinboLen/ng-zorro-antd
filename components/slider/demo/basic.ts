import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSliderModule } from 'ng-zorro-antd/slider';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriSliderModule, TriSwitchModule],
  template: `
    <tri-slider [(ngModel)]="value1" [disabled]="disabled"></tri-slider>
    <tri-slider range [(ngModel)]="value2" [disabled]="disabled"></tri-slider>
    Disabled:
    <tri-switch size="small" [(ngModel)]="disabled"></tri-switch>
  `
})
export class TriDemoSliderBasicComponent {
  disabled = false;
  value1 = 30;
  value2 = [20, 50];
}
