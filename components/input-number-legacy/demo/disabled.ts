import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
  selector: 'tri-demo-input-number-legacy-disabled',
  imports: [FormsModule, TriButtonModule, TriInputNumberLegacyModule],
  template: `
    <tri-input-number
      [(ngModel)]="value"
      [min]="1"
      [max]="10"
      [step]="1"
      [disabled]="isDisabled"
    ></tri-input-number>
    <br />
    <br />
    <button tri-button [type]="'primary'" (click)="toggleDisabled()">
      <span>Toggle Disabled</span>
    </button>
  `
})
export class TriDemoInputNumberLegacyDisabledComponent {
  value = 3;
  isDisabled = false;

  toggleDisabled(): void {
    this.isDisabled = !this.isDisabled;
  }
}
