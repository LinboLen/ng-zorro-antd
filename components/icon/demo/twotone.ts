import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-icon-twotone',
  imports: [TriIconModule],
  template: `
    <tri-icon type="smile" theme="twotone" />
    <tri-icon type="heart" theme="twotone" twotoneColor="#eb2f96" />
    <tri-icon type="check-circle" theme="twotone" twotoneColor="#52c41a" />
  `,
  styles: [
    `
      nz-icon {
        margin-right: 6px;
        font-size: 24px;
      }
    `
  ]
})
export class TriDemoIconTwotoneComponent {}
