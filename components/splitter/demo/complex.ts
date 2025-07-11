import { Component } from '@angular/core';

import { TriSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: 'tri-demo-splitter-complex',
  imports: [TriSplitterModule],
  template: `
    <tri-splitter>
      <tri-splitter-panel [collapsible]="true">
        <div class="box">Left</div>
      </tri-splitter-panel>
      <tri-splitter-panel>
        <tri-splitter layout="vertical">
          <tri-splitter-panel>
            <div class="box">Top</div>
          </tri-splitter-panel>
          <tri-splitter-panel>
            <div class="box">Bottom</div>
          </tri-splitter-panel>
        </tri-splitter>
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
export class TriDemoSplitterComplexComponent {}
