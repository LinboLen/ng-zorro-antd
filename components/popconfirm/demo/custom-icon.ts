import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'tri-demo-popconfirm-custom-icon',
  imports: [TriIconModule, TriPopconfirmModule],
  template: `
    <a tri-popconfirm popconfirmTitle="Are you sure?" [icon]="iconTpl">Delete</a>
    <ng-template #iconTpl>
      <tri-icon type="question-circle-o" style="color: red;" />
    </ng-template>
  `
})
export class TriDemoPopconfirmCustomIconComponent {}
