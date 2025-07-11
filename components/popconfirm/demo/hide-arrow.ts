import { Component } from '@angular/core';

import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'tri-demo-popconfirm-hide-arrow',
  imports: [TriPopconfirmModule],
  template: `<a tri-popconfirm popconfirmTitle="Are you sure?" [popconfirmShowArrow]="false">Delete</a>`
})
export class TriDemoPopconfirmHideArrowComponent {}
