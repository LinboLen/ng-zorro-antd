import { Component } from '@angular/core';

import { TriSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: 'tri-demo-splitter-multiple',
  imports: [TriSplitterModule],
  template: `
    <tri-splitter>
      <tri-splitter-panel [collapsible]="true">
        <div class="box">Panel 1</div>
      </tri-splitter-panel>
      <tri-splitter-panel [collapsible]="{ start: true }">
        <div class="box">Panel 2</div>
      </tri-splitter-panel>
      <tri-splitter-panel>
        <div class="box">Panel 3</div>
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
export class TriDemoSplitterMultipleComponent {}
