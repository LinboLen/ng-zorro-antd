import { Component } from '@angular/core';

import { TriDescriptionsModule } from 'ng-zorro-antd/descriptions';

@Component({
  selector: '',
  imports: [TriDescriptionsModule],
  template: `
    <tri-descriptions
      title="Responsive Descriptions"
      bordered
      [column]="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
    >
      <tri-descriptions-item title="Product">Cloud Database</tri-descriptions-item>
      <tri-descriptions-item title="Billing">Prepaid</tri-descriptions-item>
      <tri-descriptions-item title="time">18:00:00</tri-descriptions-item>
      <tri-descriptions-item title="Amount">$80.00</tri-descriptions-item>
      <tri-descriptions-item title="Discount">$20.00</tri-descriptions-item>
      <tri-descriptions-item title="Official">$60.00</tri-descriptions-item>
      <tri-descriptions-item title="Config Info">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication_factor:3
        <br />
        Region: East China 1
        <br />
      </tri-descriptions-item>
    </tri-descriptions>
  `
})
export class TriDemoDescriptionsResponsiveComponent {}
