import { Component } from '@angular/core';

import { TriImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: '',
  imports: [TriImageModule],
  template: `
    <img
      tri-image
      width="200px"
      height="200px"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      alt=""
    />
  `
})
export class TriDemoImageBasicComponent {}
