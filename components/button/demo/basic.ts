import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: '',
  imports: [TriButtonModule],
  template: `
    <button tri-button type="primary">Primary Button</button>
    <button tri-button type="default">Default Button</button>
    <button tri-button type="dashed">Dashed Button</button>
    <button tri-button type="text">Text Button</button>
    <a tri-button type="link">Link Button</a>
  `,
  styles: [
    `
      [nz-button] {
        margin-right: 8px;
        margin-bottom: 12px;
      }
    `
  ]
})
export class TriDemoButtonBasicComponent {}
