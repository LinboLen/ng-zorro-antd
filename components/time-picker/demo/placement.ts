import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import type { TriPlacement } from 'ng-zorro-antd/core/types';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-placement',
  imports: [FormsModule, TriTimePickerModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="placement">
      <label tri-radio-button value="bottomLeft">bottomLeft</label>
      <label tri-radio-button value="bottomRight">bottomRight</label>
      <label tri-radio-button value="topLeft">topLeft</label>
      <label tri-radio-button value="topRight">topRight</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-time-picker [placement]="placement()" />
    <br />
  `,
  styles: [
    `
      nz-time-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoTimePickerPlacementComponent {
  readonly placement = signal<TriPlacement>('bottomLeft');
}
