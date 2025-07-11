import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-flip-flop',
  imports: [FormsModule, TriButtonModule, TriColorPickerModule],
  template: `
    <tri-color-picker [flipFlop]="flipFlop" [(ngModel)]="color"></tri-color-picker>
    <ng-template #flipFlop>
      <button tri-button type="primary" [style.background-color]="color">Color</button>
    </ng-template>
  `,
  styles: [
    `
      button {
        border: none;
      }
    `
  ]
})
export class TriDemoColorPickerFlipFlopComponent {
  color = '#1677ff';
}
