import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'tri-demo-grid-flex-stretch',
  imports: [TriDividerModule, TriGridModule],
  template: `
    <tri-divider text="Percentage columns" orientation="left" />
    <div tri-row>
      <div tri-col flex="2">2 / 5</div>
      <div tri-col flex="3">3 / 5</div>
    </div>
    <tri-divider text="Fill rest" orientation="left" />
    <div tri-row>
      <div tri-col flex="100px">100px</div>
      <div tri-col flex="auto">Fill Rest</div>
    </div>
    <tri-divider text="Raw flex style" orientation="left" />
    <div tri-row>
      <div tri-col flex="1 1 200px">1 1 200px</div>
      <div tri-col flex="0 1 300px">0 1 300px</div>
    </div>

    <div tri-row [wrap]="false">
      <div tri-col flex="none">
        <div [style.padding-inline.px]="16">none</div>
      </div>
      <div tri-col flex="auto">auto with no-wrap</div>
    </div>
  `,
  styles: `
    [nz-row] {
      background-color: rgba(128, 128, 128, 0.08);
    }
  `
})
export class TriDemoGridFlexStretchComponent {}
