import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule],
  template: `
    <input tri-input placeholder="Basic usage" [(ngModel)]="value" type="number" />
    <br />
    <br />
    <input tri-input placeholder="Basic usage" [(ngModel)]="value" [disabled]="true" />
  `
})
export class TriDemoInputBasicComponent {
  value?: string;
}
