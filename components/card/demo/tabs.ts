import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-card-tabs',
  imports: [TriCardModule, TriTabsModule],
  template: `
    <tri-card style="width: 100%;" title="Card title" [extra]="extraTemplate">
      <tri-card-tab>
        <tri-tabs size="large" [(selectedIndexChange)]="index1">
          <tri-tab title="tab1"></tri-tab>
          <tri-tab title="tab2"></tri-tab>
        </tri-tabs>
      </tri-card-tab>
      content{{ index1 }}
    </tri-card>
    <ng-template #extraTemplate>
      <a>More</a>
    </ng-template>
    <br />
    <br />
    <tri-card style="width: 100%;">
      <tri-card-tab>
        <tri-tabs size="large" [(selectedIndexChange)]="index2">
          <tri-tab title="article"></tri-tab>
          <tri-tab title="app"></tri-tab>
          <tri-tab title="project"></tri-tab>
        </tri-tabs>
      </tri-card-tab>
      content{{ index2 }}
    </tri-card>
  `
})
export class TriDemoCardTabsComponent {
  index1 = 0;
  index2 = 0;
}
