import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: '',
  imports: [FormsModule, TriInputNumberModule, TriCheckboxModule],
  template: `
    <tri-input-number [(ngModel)]="value" [keyboard]="keyboard" min="1" max="10" />
    <label tri-checkbox [(ngModel)]="keyboard">Toggle Keyboard</label>
  `,
  styles: [
    `
      nz-input-number {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoInputNumberKeyboardComponent {
  keyboard = true;
  value = 3;
}
