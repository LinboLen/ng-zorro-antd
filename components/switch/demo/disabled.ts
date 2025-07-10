import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriSwitchModule],
  template: `
    <tri-switch [(ngModel)]="switchValue" [disabled]="isDisabled"></tri-switch>
    <br />
    <br />
    <button tri-button type="primary" (click)="isDisabled = !isDisabled">Toggle disabled</button>
  `
})
export class TriDemoSwitchDisabledComponent {
  switchValue = false;
  isDisabled = true;
}
