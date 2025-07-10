import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: '',
  imports: [FormsModule, TriSliderModule],
  template: `
    <tri-slider
      [(ngModel)]="singleValue"
      (ngModelChange)="onChange($event)"
      (onAfterChange)="onAfterChange($event)"
    ></tri-slider>
    <tri-slider
      range
      [step]="10"
      [(ngModel)]="rangeValue"
      (ngModelChange)="onChange($event)"
      (onAfterChange)="onAfterChange($event)"
    ></tri-slider>
  `
})
export class TriDemoSliderEventComponent {
  singleValue = 30;
  rangeValue = [20, 50];

  onChange(value: number): void {
    console.log(`onChange: ${value}`);
  }

  onAfterChange(value: number[] | number): void {
    console.log(`onAfterChange: ${value}`);
  }
}
