import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTransferModule, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: '',
  imports: [FormsModule, TriSwitchModule, TriTransferModule],
  template: `
    <tri-transfer
      [dataSource]="list"
      [disabled]="disabled"
      [titles]="['Source', 'Target']"
      (selectChange)="select($event)"
      [selectedKeys]="['0', '2', '3']"
      (change)="change($event)"
    ></tri-transfer>
    <br />
    <tri-switch [(ngModel)]="disabled" checkedChildren="disabled" unCheckedChildren="disabled"></tri-switch>
  `
})
export class TriDemoTransferBasicComponent implements OnInit {
  list: TransferItem[] = [];
  disabled = false;

  ngOnInit(): void {
    for (let i = 0; i < 20; i++) {
      this.list.push({
        key: i.toString(),
        title: `content${i + 1}`,
        disabled: i % 3 < 1
      });
    }

    [2, 3].forEach(idx => (this.list[idx].direction = 'right'));
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: {}): void {
    console.log('nzChange', ret);
  }
}
