import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriTrimPipe } from 'ng-zorro-antd/pipes';

@Component({
  selector: 'tri-demo-pipes-trim',
  imports: [FormsModule, TriInputModule, TriTrimPipe],
  template: `
    <input type="text" tri-input [(ngModel)]="str" />
    <br />
    <div>
      <pre>{{ str }}</pre>
    </div>
    <div>
      <pre>{{ str | nzTrim }}</pre>
    </div>
  `,
  styles: `
    div {
      padding: 8px 12px;
    }
    pre {
      display: inline-block;
      background: #eee;
    }
  `
})
export class TriDemoPipesTrimComponent {
  str = ' Ant Design ';
}
