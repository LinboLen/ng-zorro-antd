import { Component, OnInit } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTransferModule, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-custom-item',
  imports: [TriIconModule, TriTransferModule],
  template: `
    <tri-transfer
      [dataSource]="list"
      [listStyle]="{ 'width.px': 300, 'height.px': 300 }"
      [render]="render"
      (selectChange)="select($event)"
      (change)="change($event)"
    >
      <ng-template #render let-item>
        <tri-icon type="{{ item.icon }}" />
        {{ item.title }}
      </ng-template>
    </tri-transfer>
  `
})
export class TriDemoTransferCustomItemComponent implements OnInit {
  list: Array<TransferItem & { description: string; icon: string }> = [];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const ret: Array<TransferItem & { description: string; icon: string }> = [];
    for (let i = 0; i < 20; i++) {
      ret.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        direction: Math.random() * 2 > 1 ? 'right' : undefined,
        icon: `frown-o`
      });
    }
    this.list = ret;
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: {}): void {
    console.log('nzChange', ret);
  }
}
