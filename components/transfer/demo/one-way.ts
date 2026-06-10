import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTransferModule, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-one-way',
  imports: [TriTransferModule, TriSwitchModule, FormsModule],
  template: `
    <tri-transfer
      [dataSource]="list"
      [disabled]="disabled()"
      [titles]="['Source', 'Target']"
      (selectChange)="select($event)"
      [selectedKeys]="['0', '2', '3']"
      oneWay
      (change)="change($event)"
    />
    <br />
    <tri-switch [(ngModel)]="disabled" checkedChildren="disabled" unCheckedChildren="disabled" />
  `
})
export class TriDemoTransferOneWayComponent {
  readonly list: TransferItem[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    disabled: i % 3 < 1,
    direction: [2, 3].includes(i) ? 'right' : undefined
  }));
  readonly disabled = signal(false);

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: {}): void {
    console.log('nzChange', ret);
  }
}
