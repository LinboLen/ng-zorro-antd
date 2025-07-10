import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: '',
  imports: [FormsModule, TriInputNumberModule],
  template: `<tri-input-number [(ngModel)]="value" min="1" max="10" />`
})
export class TriDemoInputNumberBasicComponent {
  value = 3;
}
