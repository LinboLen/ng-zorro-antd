import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDescriptionsModule, TriDescriptionsSize } from 'ng-zorro-antd/descriptions';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-descriptions-custom-size',
  imports: [FormsModule, TriButtonModule, TriDescriptionsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio value="default">default</label>
      <label tri-radio value="middle">middle</label>
      <label tri-radio value="small">small</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-descriptions title="Custom Size" [extra]="extraTpl" bordered [size]="size">
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
    <br />
    <br />
    <tri-descriptions title="Custom Size" [size]="size" [extra]="extraTpl">
      <tri-descriptions-item title="Product">Cloud Database</tri-descriptions-item>
      <tri-descriptions-item title="Billing">Prepaid</tri-descriptions-item>
      <tri-descriptions-item title="Time">18:00:00</tri-descriptions-item>
      <tri-descriptions-item title="Amount">$80.00</tri-descriptions-item>
      <tri-descriptions-item title="Discount">$20.00</tri-descriptions-item>
      <tri-descriptions-item title="Official">$60.00</tri-descriptions-item>
    </tri-descriptions>
    <ng-template #extraTpl>
      <button tri-button type="primary">Edit</button>
    </ng-template>
  `
})
export class TriDemoDescriptionsCustomSizeComponent {
  size: TriDescriptionsSize = 'default';
}
