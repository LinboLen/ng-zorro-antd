import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'tri-demo-grid-sort',
  imports: [TriGridModule],
  template: `
    <div tri-row>
      <div tri-col [span]="18" [push]="6">col-18 col-push-6</div>
      <div tri-col [span]="6" [pull]="18">col-6 col-pull-18</div>
    </div>
  `
})
export class TriDemoGridSortComponent {}
