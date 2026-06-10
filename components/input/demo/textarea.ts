import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-textarea',
  imports: [FormsModule, TriInputModule],
  template: `<textarea rows="4" tri-input [(ngModel)]="value"></textarea>`
})
export class TriDemoInputTextareaComponent {
  readonly value = signal('');
}
