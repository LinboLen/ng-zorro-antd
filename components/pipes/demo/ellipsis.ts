import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriEllipsisPipe } from 'ng-zorro-antd/pipes';

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule, TriEllipsisPipe],
  template: `
    <input type="text" tri-input [(ngModel)]="str" />
    <br />
    <p>{{ str | nzEllipsis: 36 : '...' }}</p>
  `,
  styles: [
    `
      p {
        padding: 8px 12px;
      }
    `
  ]
})
export class TriDemoPipesEllipsisComponent {
  str = 'Ant Design, a design language for background applications';
}
