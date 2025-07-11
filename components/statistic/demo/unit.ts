import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'tri-demo-statistic-unit',
  imports: [DecimalPipe, TriGridModule, TriIconModule, TriStatisticModule],
  template: `
    <tri-row [gutter]="16">
      <tri-col [span]="12">
        <tri-statistic [value]="(1128 | number)!" title="Feedback" [prefix]="prefixTpl"></tri-statistic>
        <ng-template #prefixTpl><tri-icon type="like" /></ng-template>
      </tri-col>
      <tri-col [span]="12">
        <tri-statistic [value]="93" title="Unmerged" suffix="/ 100"></tri-statistic>
      </tri-col>
    </tri-row>
  `
})
export class TriDemoStatisticUnitComponent {}
