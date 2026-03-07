import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputNumberModule, TriInputNumberStepEvent } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-change-on-wheel',
  imports: [FormsModule, TriInputNumberModule, TriButtonModule],
  template: `
    <tri-input-number
      changeOnWheel
      [(ngModel)]="value"
      (ngModelChange)="onChange($event)"
      (onStep)="onStep($event)"
    />
  `
})
export class TriDemoInputNumberChangeOnWheelComponent {
  value = 3;

  onChange(value: number): void {
    console.log(value);
  }

  onStep(event: TriInputNumberStepEvent): void {
    console.log(event);
  }
}
