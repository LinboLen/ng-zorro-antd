import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'tri-demo-rate-character',
  imports: [FormsModule, TriIconModule, TriRateModule],
  template: `
    <tri-rate [ngModel]="0" allowHalf [character]="characterIcon"></tri-rate>
    <br />
    <tri-rate [ngModel]="0" allowHalf class="large" [character]="characterEnLetter"></tri-rate>
    <br />
    <tri-rate [ngModel]="0" allowHalf [character]="characterZhLetter"></tri-rate>
    <ng-template #characterIcon><tri-icon type="heart" /></ng-template>
    <ng-template #characterZhLetter>好</ng-template>
    <ng-template #characterEnLetter>A</ng-template>
  `,
  styles: [
    `
      .large ::ng-deep .ant-rate-star {
        font-size: 36px;
      }
    `
  ]
})
export class TriDemoRateCharacterComponent {}
