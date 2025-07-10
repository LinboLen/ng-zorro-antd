import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: '',
  imports: [TriButtonModule],
  template: `
    <button tri-button type="primary" block>Primary</button>
    <button tri-button type="default" block>Default</button>
    <button tri-button type="dashed" block>Dashed</button>
    <button tri-button type="text" block>Text</button>
    <a tri-button type="link" block>Link</a>
  `,
  styles: [
    `
      [nz-button] {
        margin-bottom: 12px;
      }
    `
  ]
})
export class TriDemoButtonBlockComponent {}
