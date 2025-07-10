import { Component } from '@angular/core';

import { TriSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: '',
  imports: [TriSplitterModule],
  template: `
    <tri-splitter layout="vertical">
      <tri-splitter-panel>
        <div class="box">First</div>
      </tri-splitter-panel>
      <tri-splitter-panel>
        <div class="box">Second</div>
      </tri-splitter-panel>
    </tri-splitter>
  `,
  styles: `
    nz-splitter {
      height: 300px;
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
export class TriDemoSplitterVerticalComponent {}
