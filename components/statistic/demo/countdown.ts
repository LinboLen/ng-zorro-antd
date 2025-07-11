import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'tri-demo-statistic-countdown',
  imports: [TriGridModule, TriStatisticModule],
  template: `
    <tri-row [gutter]="16">
      <tri-col [span]="12">
        <tri-countdown [value]="deadline" title="Countdown"></tri-countdown>
      </tri-col>
      <tri-col [span]="12">
        <tri-countdown [value]="deadline" title="Million Seconds" format="HH:mm:ss:SSS"></tri-countdown>
      </tri-col>
      <tri-col [span]="24" style="margin-top: 32px;">
        <tri-countdown [value]="deadline" title="Day Level" format="D 天 H 时 m 分 s 秒"></tri-countdown>
      </tri-col>
    </tri-row>
  `
})
export class TriDemoStatisticCountdownComponent {
  deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
}
