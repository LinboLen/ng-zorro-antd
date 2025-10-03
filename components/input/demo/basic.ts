import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-basic',
  imports: [FormsModule, TriInputModule],
  template: ` <input tri-input placeholder="Basic usage" [(ngModel)]="value" /> `
})
export class TriDemoInputBasicComponent {
  value?: string;
}
