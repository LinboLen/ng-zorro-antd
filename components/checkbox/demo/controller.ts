import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriCheckboxModule],
  template: `
    <label tri-checkbox [(ngModel)]="isCheckedButton" [disabled]="isDisabledButton">
      {{ isCheckedButton ? 'Checked' : 'Unchecked' }} - {{ isDisabledButton ? 'Disabled' : 'Enabled' }}
    </label>
    <br />
    <br />
    <button tri-button [type]="'primary'" (click)="checkButton()" [size]="'small'">
      {{ !isCheckedButton ? 'Checked' : 'Unchecked' }}
    </button>
    <button tri-button [type]="'primary'" (click)="disableButton()" [size]="'small'">
      {{ isDisabledButton ? 'Enabled' : 'Disabled' }}
    </button>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoCheckboxControllerComponent {
  isCheckedButton = true;
  isDisabledButton = false;

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  disableButton(): void {
    this.isDisabledButton = !this.isDisabledButton;
  }
}
