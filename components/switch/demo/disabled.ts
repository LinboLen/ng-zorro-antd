import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-switch-disabled',
  imports: [FormsModule, TriButtonModule, TriSwitchModule],
  template: `
    <tri-switch [(ngModel)]="value" [disabled]="disabled()" />
    <br />
    <br />
    <button tri-button type="primary" (click)="toggleDisabled()">Toggle disabled</button>
  `
})
export class TriDemoSwitchDisabledComponent {
  readonly value = signal(false);
  readonly disabled = signal(true);

  toggleDisabled(): void {
    this.disabled.update(value => !value);
  }
}
