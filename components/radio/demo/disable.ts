import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-radio-disable',
  imports: [FormsModule, TriButtonModule, TriRadioModule],
  template: `
    <div>
      <label tri-radio [disabled]="disabled">Disabled</label>
      <br />
      <label tri-radio [disabled]="disabled" [ngModel]="true">Disabled</label>
      <br />
      <br />
      <button tri-button type="primary" (click)="disabled = !disabled">Toggle disabled</button>
    </div>
  `
})
export class TriDemoRadioDisableComponent {
  disabled = true;
}
