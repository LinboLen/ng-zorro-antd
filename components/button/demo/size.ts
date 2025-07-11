import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule, TriButtonSize } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-button-size',
  imports: [FormsModule, TriButtonModule, TriIconModule, TriRadioModule, TriSpaceModule],
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio-button value="large">Large</label>
      <label tri-radio-button value="default">Default</label>
      <label tri-radio-button value="small">Small</label>
    </tri-radio-group>
    <br />
    <br />
    <button tri-button [size]="size" type="primary">Primary</button>
    <button tri-button [size]="size" type="default">Default</button>
    <button tri-button [size]="size" type="dashed">Dashed</button>
    <a tri-button [size]="size" type="link">Link</a>
    <br />
    <button tri-button type="primary" [size]="size">
      <tri-icon type="download" />
    </button>
    <button tri-button type="primary" [size]="size" shape="circle">
      <tri-icon type="download" />
    </button>
    <button tri-button type="primary" [size]="size" shape="round">
      <tri-icon type="download" />
    </button>
    <button tri-button type="primary" [size]="size" shape="round">
      <tri-icon type="download" />
      Download
    </button>
    <button tri-button type="primary" [size]="size">
      <tri-icon type="download" />
      Download
    </button>
    <br />
    <tri-space-compact [size]="size">
      <button tri-button type="primary">
        <tri-icon type="left" />
        Backward
      </button>
      <button tri-button type="primary">
        Forward
        <tri-icon type="right" />
      </button>
    </tri-space-compact>
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
export class TriDemoButtonSizeComponent {
  size: TriButtonSize = 'large';
}
