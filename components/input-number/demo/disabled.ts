import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-disabled',
  imports: [FormsModule, TriButtonModule, TriInputNumberModule],
  template: `
    <tri-input-number [(ngModel)]="value" min="1" max="10" [disabled]="isDisabled()" />
    <br />
    <br />
    <button tri-button type="primary" (click)="isDisabled.update(disabled => !disabled)">Toggle Disabled</button>
  `
})
export class TriDemoInputNumberDisabledComponent {
  readonly value = signal(3);
  readonly isDisabled = signal(false);
}
