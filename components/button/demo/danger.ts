import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'tri-demo-button-danger',
  imports: [TriButtonModule],
  template: `
    <button tri-button type="primary" danger>Primary</button>
    <button tri-button type="default" danger>Default</button>
    <button tri-button type="dashed" danger>Dashed</button>
    <button tri-button type="text" danger>Text</button>
    <a tri-button type="link" danger>Link</a>
  `,
  styles: `
    [nz-button] {
      margin-right: 8px;
      margin-bottom: 12px;
    }
  `
})
export class TriDemoButtonDangerComponent {}
