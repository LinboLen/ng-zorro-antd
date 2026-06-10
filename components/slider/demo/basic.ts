import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSliderModule } from 'ng-zorro-antd/slider';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-slider-basic',
  imports: [FormsModule, TriSliderModule, TriSwitchModule],
  template: `
    <tri-slider [(ngModel)]="value1" [disabled]="disabled" />
    <tri-slider range [(ngModel)]="value2" [disabled]="disabled" />
    Disabled:
    <tri-switch size="small" [(ngModel)]="disabled" />
  `
})
export class TriDemoSliderBasicComponent {
  readonly disabled = signal(false);
  readonly value1 = signal(30);
  readonly value2 = signal([20, 50]);
}
