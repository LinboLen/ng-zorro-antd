import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTableModule } from 'ng-zorro-antd/table';
import { TriTagModule } from 'ng-zorro-antd/tag';
import { TriTransferModule, TransferChange, TransferItem, TransferSelectChange } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-table-transfer',
  imports: [FormsModule, TriSwitchModule, TriTableModule, TriTagModule, TriTransferModule],
  template: `
    <tri-transfer
      [dataSource]="list()"
      [disabled]="disabled()"
      [showSearch]="showSearch()"
      [showSelectAll]="false"
      [renderList]="[renderList, renderList]"
      (selectChange)="select($event)"
      (change)="change($event)"
    >
      <ng-template
        #renderList
        let-items
        let-direction="direction"
        let-stat="stat"
        let-disabled="disabled"
        let-onItemSelectAll="onItemSelectAll"
        let-onItemSelect="onItemSelect"
      >
        <tri-table #t [data]="$asTransferItems(items)" size="small">
          <thead>
            <tr>
              <th
                [disabled]="disabled"
                [checked]="stat.checkAll"
                [indeterminate]="stat.checkHalf"
                (checkedChange)="onItemSelectAll($event)"
              ></th>
              <th>Name</th>
              @if (direction === 'left') {
                <th>Tag</th>
              }
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            @for (data of t.data; track data) {
              <tr (click)="onItemSelect(data)">
                <td
                  [checked]="!!data.checked"
                  [disabled]="disabled || data.disabled"
                  (checkedChange)="onItemSelect(data)"
                ></td>
                <td>{{ data.title }}</td>
                @if (direction === 'left') {
                  <td>
                    <tri-tag>{{ data.tag }}</tri-tag>
                  </td>
                }
                <td>{{ data.description }}</td>
              </tr>
            }
          </tbody>
        </tri-table>
      </ng-template>
    </tri-transfer>
    <br />
    <tri-switch [(ngModel)]="disabled" checkedChildren="disabled" unCheckedChildren="disabled" />
    <tri-switch [(ngModel)]="showSearch" checkedChildren="showSearch" unCheckedChildren="showSearch" />
  `
})
export class TriDemoTransferTableTransferComponent {
  readonly list = signal<TransferItem[]>(
    Array.from({ length: 20 }).map((_, i) => ({
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
      disabled: i % 4 === 0,
      tag: ['cat', 'dog', 'bird'][i % 3],
      checked: false,
      direction: [2, 3].includes(i) ? 'right' : undefined
    }))
  );
  readonly $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
  readonly disabled = signal(false);
  readonly showSearch = signal(false);

  select(ret: TransferSelectChange): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: TransferChange): void {
    console.log('nzChange', ret);
    const listKeys = ret.list.map(l => l.key);
    const hasOwnKey = (e: TransferItem): boolean => e.hasOwnProperty('key');
    this.list.update(list =>
      list.map(e => {
        if (listKeys.includes(e.key) && hasOwnKey(e)) {
          if (ret.to === 'left') {
            const next = { ...e };
            delete next.hide;
            return next;
          } else if (ret.to === 'right') {
            return { ...e, hide: false };
          }
        }
        return e;
      })
    );
  }
}
