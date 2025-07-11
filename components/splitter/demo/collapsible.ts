import { Component } from '@angular/core';

import { TriSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: 'tri-demo-splitter-collapsible',
  imports: [TriSplitterModule],
  template: `
    <tri-splitter>
      <tri-splitter-panel min="20%" [collapsible]="true">
        <div class="box">First</div>
      </tri-splitter-panel>
      <tri-splitter-panel [collapsible]="true">
        <div class="box">Second</div>
      </tri-splitter-panel>
    </tri-splitter>
    <br />
    <tri-splitter layout="vertical">
      <tri-splitter-panel min="20%" [collapsible]="true">
        <div class="box">First</div>
      </tri-splitter-panel>
      <tri-splitter-panel [collapsible]="true">
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
export class TriDemoSplitterCollapsibleComponent {}
