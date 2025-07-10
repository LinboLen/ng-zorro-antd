import { Component } from '@angular/core';

import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: '',
  imports: [TriTypographyModule],
  template: `
    <span tri-typography>Ant Design (default)</span>
    <span tri-typography type="secondary">Ant Design (secondary)</span>
    <span tri-typography type="success">Ant Design (success)</span>
    <span tri-typography type="warning">Ant Design (warning)</span>
    <span tri-typography type="danger">Ant Design (danger)</span>
    <span tri-typography disabled>Ant Design (disabled)</span>
    <span tri-typography><mark>Ant Design (mark)</mark></span>
    <span tri-typography><code>Ant Design (code)</code></span>
    <span tri-typography><kbd>Ant Design (keyboard)</kbd></span>
    <span tri-typography><u>Ant Design (underline)</u></span>
    <span tri-typography><del>Ant Design (delete)</del></span>
    <span tri-typography><strong>Ant Design (strong)</strong></span>
    <span tri-typography>
      <a href="https://ng.ant.design/" target="_blank">Ant Design</a>
    </span>
  `,
  styles: [
    `
      span[nz-typography] {
        display: block;
      }
      span[nz-typography] + span[nz-typography] {
        margin-top: 8px;
      }
    `
  ]
})
export class TriDemoTypographyTextComponent {}
