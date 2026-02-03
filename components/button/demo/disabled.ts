import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'tri-demo-button-disabled',
  imports: [TriButtonModule],
  template: `
    <button tri-button type="primary">Primary</button>
    <button tri-button type="primary" disabled>Primary(disabled)</button>
    <br />
    <button tri-button type="default">Default</button>
    <button tri-button type="default" disabled>Default(disabled)</button>
    <br />
    <button tri-button type="dashed">Dashed</button>
    <button tri-button type="dashed" disabled>Dashed(disabled)</button>
    <br />
    <a tri-button type="text">Text</a>
    <a tri-button type="text" disabled>Text(disabled)</a>
    <br />
    <a tri-button type="link">Link</a>
    <a tri-button type="link" disabled>Link(disabled)</a>
    <br />
    <a tri-button type="text" danger>Danger Text</a>
    <a tri-button type="text" disabled danger>Danger Text(disabled)</a>
    <br />
    <a tri-button type="link" danger>Danger Link</a>
    <a tri-button type="link" disabled danger>Danger Link(disabled)</a>
    <br />
    <button tri-button type="default" danger>Danger Default</button>
    <button tri-button type="default" disabled danger>Danger Default(disabled)</button>
    <div class="ghost-background">
      <button tri-button ghost>Ghost</button>
      <button tri-button ghost disabled>Ghost(disabled)</button>
    </div>
  `,
  styles: `
    [nz-button] {
      margin-right: 8px;
      margin-bottom: 12px;
    }

    .ghost-background {
      padding: 8px;
      background: rgb(190, 200, 200);
    }

    .ghost-background [nz-button] {
      margin-right: 8px;
      margin-bottom: 0;
    }
  `
})
export class TriDemoButtonDisabledComponent {}
