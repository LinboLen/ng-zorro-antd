import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-space-align',
  imports: [TriButtonModule, TriSpaceModule],
  template: `
    <div class="space-align-container">
      <div tri-space align="center" class="space-align-block">
        <ng-container *spaceItem>center</ng-container>
        <button *spaceItem tri-button type="primary">Button</button>
        <span *spaceItem class="mock-block">Block</span>
      </div>

      <div tri-space align="start" class="space-align-block">
        <ng-container *spaceItem>start</ng-container>
        <button *spaceItem tri-button type="primary">Button</button>
        <span *spaceItem class="mock-block">Block</span>
      </div>

      <div tri-space align="end" class="space-align-block">
        <ng-container *spaceItem>end</ng-container>
        <button *spaceItem tri-button type="primary">Button</button>
        <span *spaceItem class="mock-block">Block</span>
      </div>

      <div tri-space align="baseline" class="space-align-block">
        <ng-container *spaceItem>baseline</ng-container>
        <button *spaceItem tri-button type="primary">Button</button>
        <span *spaceItem class="mock-block">Block</span>
      </div>
    </div>
  `,
  styles: [
    `
      .space-align-container {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .space-align-block {
        margin: 8px 4px;
        border: 1px solid #40a9ff;
        padding: 4px;
        flex: none;
      }
      .space-align-block .mock-block {
        display: inline-block;
        padding: 32px 8px 16px;
        background: rgba(150, 150, 150, 0.2);
      }
    `
  ]
})
export class TriDemoSpaceAlignComponent {}
