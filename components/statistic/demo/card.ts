import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'tri-demo-statistic-card',
  imports: [DecimalPipe, TriCardModule, TriGridModule, TriIconModule, TriStatisticModule],
  template: `
    <div style="background: #ECECEC; padding: 30px;">
      <tri-row [gutter]="16">
        <tri-col [span]="12">
          <tri-card>
            <tri-statistic
              [value]="(11.28 | number: '1.0-2')!"
              title="Active"
              [prefix]="prefixTplOne"
              suffix="%"
              [valueStyle]="{ color: '#3F8600' }"
            ></tri-statistic>
            <ng-template #prefixTplOne><tri-icon type="arrow-up" /></ng-template>
          </tri-card>
        </tri-col>
        <tri-col [span]="12">
          <tri-card>
            <tri-statistic
              [value]="(9.3 | number: '1.0-2')!"
              title="Idle"
              [prefix]="prefixTplTwo"
              suffix="%"
              [valueStyle]="{ color: '#CF1322' }"
            ></tri-statistic>
            <ng-template #prefixTplTwo><tri-icon type="arrow-down" /></ng-template>
          </tri-card>
        </tri-col>
      </tri-row>
    </div>
  `
})
export class TriDemoStatisticCardComponent {}
