import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule],
  template: `<textarea rows="4" tri-input [(ngModel)]="inputValue"></textarea>`
})
export class TriDemoInputTextareaComponent {
  inputValue?: string;
}
