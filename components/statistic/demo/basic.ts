import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'tri-demo-statistic-basic',
  imports: [DecimalPipe, TriButtonModule, TriGridModule, TriStatisticModule],
  template: `
    <tri-row [gutter]="16">
      <tri-col [span]="12">
        <tri-statistic [value]="(1949101 | number)!" title="Active Users"></tri-statistic>
      </tri-col>
      <tri-col [span]="12">
        <tri-statistic [value]="(2019.111 | number: '1.0-2')!" title="Account Balance (CNY)"></tri-statistic>
        <button tri-button type="primary" [style.margin-top.px]="16">Recharge</button>
      </tri-col>
      <tri-col [span]="12">
        <tri-statistic [value]="(112893 | number: '1.0-2')!" title="Active Users" loading></tri-statistic>
      </tri-col>
    </tri-row>
  `
})
export class TriDemoStatisticBasicComponent {}
