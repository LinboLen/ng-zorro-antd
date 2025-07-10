import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule],
  template: `
    <textarea tri-input placeholder="Autosize height based on content lines" autosize></textarea>
    <textarea
      tri-input
      placeholder="Autosize height with minimum and maximum number of lines"
      [autosize]="{ minRows: 2, maxRows: 6 }"
    ></textarea>
    <textarea tri-input placeholder="Controlled autosize" [autosize]="{ minRows: 3, maxRows: 5 }"></textarea>
  `,
  styles: [
    `
      textarea + textarea {
        margin-top: 24px;
      }
    `
  ]
})
export class TriDemoInputAutosizeTextareaComponent {}
