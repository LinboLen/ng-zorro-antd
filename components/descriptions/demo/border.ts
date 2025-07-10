import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriDescriptionsModule } from 'ng-zorro-antd/descriptions';

@Component({
  selector: '',
  imports: [TriBadgeModule, TriDescriptionsModule],
  template: `
    <tri-descriptions title="User Info" bordered>
      <tri-descriptions-item title="Product">Cloud Database</tri-descriptions-item>
      <tri-descriptions-item title="Billing Mode">Prepaid</tri-descriptions-item>
      <tri-descriptions-item title="Automatic Renewal">YES</tri-descriptions-item>
      <tri-descriptions-item title="Order Time">2018-04-24 18:00:00</tri-descriptions-item>
      <tri-descriptions-item title="Usage Time" [span]="2">
        2018-04-24 18:00:00 To 2019-04-24 18:00:00
      </tri-descriptions-item>
      <tri-descriptions-item title="Status" [span]="3">
        <tri-badge status="processing" text="Running"></tri-badge>
      </tri-descriptions-item>
      <tri-descriptions-item title="Negotiated Amount">$80.00</tri-descriptions-item>
      <tri-descriptions-item title="Discount">$20.00</tri-descriptions-item>
      <tri-descriptions-item title="Official Receipts">$60.00</tri-descriptions-item>
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
export class TriDemoDescriptionsBorderComponent {}
