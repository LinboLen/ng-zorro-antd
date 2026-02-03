import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'tri-demo-button-ghost',
  imports: [TriButtonModule],
  template: `
    <div class="ghost-background">
      <button tri-button type="primary" ghost>Primary</button>
      <button tri-button type="default" ghost>Default</button>
      <button tri-button type="dashed" ghost>Dashed</button>
      <a tri-button type="link" ghost>Link</a>
    </div>
  `,
  styles: `
    .ghost-background {
      padding: 8px;
      background: rgb(190, 200, 200);
    }

    [nz-button] {
      margin-right: 8px;
    }
  `
})
export class TriDemoButtonGhostComponent {}
