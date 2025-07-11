import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-button-icon',
  imports: [TriButtonModule, TriIconModule],
  template: `
    <button tri-button type="primary" shape="circle">
      <tri-icon type="search" />
    </button>
    <button tri-button type="primary" shape="circle">A</button>
    <button tri-button type="primary">
      <tri-icon type="search" />
      Search
    </button>
    <button tri-button type="default" shape="circle">
      <tri-icon type="search" />
    </button>
    <button tri-button type="default">
      <tri-icon type="search" />
      Search
    </button>
    <br />
    <button tri-button type="default" shape="circle"><tri-icon type="search" /></button>
    <button tri-button type="default">
      <tri-icon type="search" />
      Search
    </button>
    <button tri-button type="dashed" shape="circle"><tri-icon type="search" /></button>
    <button tri-button type="dashed">
      <tri-icon type="search" />
      Search
    </button>
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
export class TriDemoButtonIconComponent {}
