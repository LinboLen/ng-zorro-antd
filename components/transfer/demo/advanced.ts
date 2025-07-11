import { Component, OnInit } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriTransferModule, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-advanced',
  imports: [TriButtonModule, TriTransferModule],
  template: `
    <tri-transfer
      [dataSource]="list"
      showSearch
      [operations]="['to right', 'to left']"
      [listStyle]="{ 'width.px': 250, 'height.px': 300 }"
      [render]="render"
      [footer]="footer"
      (selectChange)="select($event)"
      (change)="change($event)"
    >
      <ng-template #render let-item>{{ item.title }}-{{ item.description }}</ng-template>
      <ng-template #footer let-direction>
        <button tri-button (click)="reload(direction)" size="small" style="float: right; margin: 5px;">
          reload
        </button>
      </ng-template>
    </tri-transfer>
  `
})
export class TriDemoTransferAdvancedComponent implements OnInit {
  list: TransferItem[] = [];

  constructor(private messageService: TriMessageService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const ret: TransferItem[] = [];
    for (let i = 0; i < 20; i++) {
      ret.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        direction: Math.random() * 2 > 1 ? 'right' : undefined
      });
    }
    this.list = ret;
  }

  reload(direction: string): void {
    this.getData();
    this.messageService.success(`your clicked ${direction}!`);
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: {}): void {
    console.log('nzChange', ret);
  }
}
