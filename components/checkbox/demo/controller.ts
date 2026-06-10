import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'tri-demo-checkbox-controller',
  imports: [FormsModule, TriButtonModule, TriCheckboxModule],
  template: `
    <label tri-checkbox [(ngModel)]="checked" [disabled]="disabled()">
      {{ checked() ? 'Checked' : 'Unchecked' }} - {{ disabled() ? 'Disabled' : 'Enabled' }}
    </label>
    <br />
    <br />
    <button tri-button type="primary" (click)="toggleChecked()" size="small">
      {{ checked() ? 'Uncheck' : 'Check' }}
    </button>
    <button tri-button type="primary" (click)="toggleDisabled()" size="small">
      {{ disabled() ? 'Enable' : 'Disable' }}
    </button>
  `,
  styles: `
    button {
      margin-right: 8px;
    }
  `
})
export class TriDemoCheckboxControllerComponent {
  readonly checked = signal(true);
  readonly disabled = signal(false);

  toggleChecked(): void {
    this.checked.update(checked => !checked);
  }

  toggleDisabled(): void {
    this.disabled.update(disabled => !disabled);
  }
}
