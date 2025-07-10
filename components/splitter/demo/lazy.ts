import { Component } from '@angular/core';

import { TriSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: '',
  imports: [TriSplitterModule],
  template: `
    <tri-splitter lazy>
      <tri-splitter-panel defaultSize="40%" min="20%" max="70%">
        <div class="box">First</div>
      </tri-splitter-panel>
      <tri-splitter-panel>
        <div class="box">Second</div>
      </tri-splitter-panel>
    </tri-splitter>
    <br />
    <tri-splitter lazy layout="vertical">
      <tri-splitter-panel defaultSize="40%" min="30%" max="70%">
        <div class="box">First</div>
      </tri-splitter-panel>
      <tri-splitter-panel>
        <div class="box">Second</div>
      </tri-splitter-panel>
    </tri-splitter>
  `,
  styles: `
    nz-splitter {
      height: 200px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .box {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `
})
export class TriDemoSplitterLazyComponent {}
