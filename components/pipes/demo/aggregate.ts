import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriAggregatePipe } from 'ng-zorro-antd/pipes';
import { TriStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'tri-demo-pipes-aggregate',
  imports: [TriGridModule, TriStatisticModule, TriAggregatePipe],
  template: `
    <tri-row [gutter]="16">
      <tri-col [span]="6">
        <tri-statistic [value]="[7, 8, 2, 3] | nzAggregate: 'max'" title="Max [7, 8, 2, 3]" />
      </tri-col>
      <tri-col [span]="6">
        <tri-statistic [value]="[7, 8, 2, 3] | nzAggregate: 'min'" title="Min [7, 8, 2, 3]" />
      </tri-col>
      <tri-col [span]="6">
        <tri-statistic [value]="[7, 8, 2, 3] | nzAggregate: 'sum'" title="Sum [7, 8, 2, 3]" />
      </tri-col>
      <tri-col [span]="6">
        <tri-statistic [value]="[7, 8, 2, 3] | nzAggregate: 'avg'" title="Avg [7, 8, 2, 3]" />
      </tri-col>
    </tri-row>
  `
})
export class TriDemoPipesAggregateComponent {}
