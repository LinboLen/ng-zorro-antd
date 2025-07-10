import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: '',
  imports: [TriGridModule],
  template: `
    <div>
      <p>Percentage columns</p>
      <div tri-row>
        <div tri-col flex="2">2 / 5</div>
        <div tri-col flex="3">3 / 5</div>
      </div>
      <p>Fill rest</p>
      <div tri-row>
        <div tri-col flex="100px">100px</div>
        <div tri-col flex="auto">Fill Rest</div>
      </div>
      <p>Raw flex style</p>
      <div tri-row>
        <div tri-col flex="1 1 200px">1 1 200px</div>
        <div tri-col flex="0 1 300px">0 1 300px</div>
      </div>
    </div>
  `,
  styles: [
    `
      [nz-row] {
        background-color: rgba(128, 128, 128, 0.08);
      }
    `
  ]
})
export class TriDemoGridFlexStretchComponent {}
