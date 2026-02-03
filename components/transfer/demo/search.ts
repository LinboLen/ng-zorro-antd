import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTransferModule, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-search',
  imports: [FormsModule, TriSwitchModule, TriTransferModule],
  template: `
    <tri-transfer
      [dataSource]="list"
      [disabled]="disabled"
      showSearch
      [filterOption]="filterOption"
      (searchChange)="search($event)"
      (selectChange)="select($event)"
      (change)="change($event)"
    />
    <br />
    <tri-switch [(ngModel)]="disabled" checkedChildren="disabled" unCheckedChildren="disabled" />
  `
})
export class TriDemoTransferSearchComponent implements OnInit {
  list: TransferItem[] = [];
  disabled = false;

  ngOnInit(): void {
    for (let i = 0; i < 20; i++) {
      this.list.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        direction: Math.random() * 2 > 1 ? 'right' : undefined
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOption(inputValue: string, item: any): boolean {
    return item.description.indexOf(inputValue) > -1;
  }

  search(ret: {}): void {
    console.log('nzSearchChange', ret);
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: {}): void {
    console.log('nzChange', ret);
  }
}
