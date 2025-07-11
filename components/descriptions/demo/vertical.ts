import { Component } from '@angular/core';

import { TriDescriptionsModule } from 'ng-zorro-antd/descriptions';

@Component({
  selector: 'tri-demo-descriptions-vertical',
  imports: [TriDescriptionsModule],
  template: `
    <tri-descriptions title="User Info" layout="vertical">
      <tri-descriptions-item title="UserName">Zhou Maomao</tri-descriptions-item>
      <tri-descriptions-item title="Telephone">1810000000</tri-descriptions-item>
      <tri-descriptions-item title="Live">Hangzhou, Zhejiang</tri-descriptions-item>
      <tri-descriptions-item title="Address" [span]="2">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </tri-descriptions-item>
      <tri-descriptions-item title="Remark">empty</tri-descriptions-item>
    </tri-descriptions>
  `
})
export class TriDemoDescriptionsVerticalComponent {}
