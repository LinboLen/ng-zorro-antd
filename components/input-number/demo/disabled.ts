import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-disabled',
  imports: [FormsModule, TriButtonModule, TriInputNumberModule],
  template: `
    <tri-input-number [(ngModel)]="value" min="1" max="10" [disabled]="isDisabled" />
    <br />
    <br />
    <button tri-button type="primary" (click)="isDisabled = !isDisabled">Toggle Disabled</button>
  `
})
export class TriDemoInputNumberDisabledComponent {
  value = 3;
  isDisabled = false;
}
