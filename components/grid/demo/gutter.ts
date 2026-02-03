import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'tri-demo-grid-gutter',
  imports: [TriDividerModule, TriGridModule],
  template: `
    <tri-divider orientation="left" text="Horizontal" />
    <div tri-row [gutter]="16">
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
    </div>
    <tri-divider orientation="left" text="Responsive" />
    <div tri-row [gutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
    </div>
    <tri-divider orientation="left" text="Vertical" />
    <div tri-row [gutter]="[16, 24]">
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
      <div tri-col class="gutter-row" [span]="6"><div class="inner-box">col-6</div></div>
    </div>
  `,
  styles: `
    nz-divider {
      color: #333;
      font-weight: normal;
    }
    .inner-box {
      background: #0092ff;
      padding: 8px 0;
    }
  `
})
export class TriDemoGridGutterComponent {}
