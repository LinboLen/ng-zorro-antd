import { Component } from '@angular/core';

import { TriDescriptionsModule } from 'ng-zorro-antd/descriptions';

@Component({
  selector: 'tri-demo-descriptions-basic',
  imports: [TriDescriptionsModule],
  template: `
    <tri-descriptions title="User Info">
      <tri-descriptions-item title="UserName">Zhou Maomao</tri-descriptions-item>
      <tri-descriptions-item title="Telephone">18100000000</tri-descriptions-item>
      <tri-descriptions-item title="Live">Hangzhou, Zhejiang</tri-descriptions-item>
      <tri-descriptions-item title="Remark">Empty</tri-descriptions-item>
      <tri-descriptions-item title="Address">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </tri-descriptions-item>
    </tri-descriptions>
  `
})
export class TriDemoDescriptionsBasicComponent {}
