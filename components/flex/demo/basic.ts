import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-flex-basic',
  imports: [FormsModule, TriFlexModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="isVertical">
      <label tri-radio [value]="false">horizontal</label>
      <label tri-radio [value]="true">vertical</label>
    </tri-radio-group>

    <div tri-flex [vertical]="isVertical">
      <div class="flex-item"></div>
      <div class="flex-item even"></div>
      <div class="flex-item"></div>
      <div class="flex-item even"></div>
    </div>
  `,
  styles: `
    nz-radio-group {
      margin-block-end: 1rem;
    }

    .flex-item {
      inline-size: 25%;
      block-size: 54px;
      background-color: var(--ant-primary-6);
    }

    .even {
      background-color: var(--ant-primary-5);
    }
  `
})
export class TriDemoFlexBasicComponent {
  isVertical = false;
}
