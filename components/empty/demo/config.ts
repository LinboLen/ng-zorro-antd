import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule } from 'ng-zorro-antd/cascader';
import { TriConfigService } from 'ng-zorro-antd/core/config';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriEmptyModule } from 'ng-zorro-antd/empty';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriListModule } from 'ng-zorro-antd/list';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTableModule } from 'ng-zorro-antd/table';
import { TriTransferModule } from 'ng-zorro-antd/transfer';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-empty-config',
  imports: [
    FormsModule,
    TriCascaderModule,
    TriDividerModule,
    TriEmptyModule,
    TriIconModule,
    TriListModule,
    TriSelectModule,
    TriSwitchModule,
    TriTableModule,
    TriTransferModule,
    TriTreeSelectModule
  ],
  template: `
    <tri-switch
      [unCheckedChildren]="'default'"
      [checkedChildren]="'customize'"
      [(ngModel)]="customize"
      (ngModelChange)="onConfigChange()"
    ></tri-switch>

    <tri-divider></tri-divider>

    <h3>Select</h3>
    <tri-select style="width: 200px"></tri-select>

    <h3>TreeSelect</h3>
    <tri-tree-select style="width: 200px;"></tri-tree-select>

    <h3>Cascader</h3>
    <tri-cascader style="width: 200px;" [showSearch]="true" [options]="[]"></tri-cascader>

    <h3>Transfer</h3>
    <tri-transfer></tri-transfer>

    <h3>Table</h3>
    <tri-table [data]="[]">
      <thead>
        <tr>
          <th>Title</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody></tbody>
    </tri-table>

    <h3>List</h3>
    <tri-list [dataSource]="[]"></tri-list>

    <ng-template #customTpl let-name>
      <div style="text-align: center;">
        <tri-icon type="smile" style="font-size: 20px;" />
        <p>Data Not Found in {{ name }}</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      h3 {
        font-size: inherit;
        margin: 16px 0 8px 0;
      }
    `
  ]
})
export class TriDemoEmptyConfigComponent {
  @ViewChild('customTpl', { static: false }) customTpl?: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  customize = false;

  constructor(private nzConfigService: TriConfigService) {}

  onConfigChange(): void {
    if (this.customize) {
      this.nzConfigService.set('empty', { nzDefaultEmptyContent: this.customTpl });
    } else {
      this.nzConfigService.set('empty', { nzDefaultEmptyContent: undefined });
    }
  }
}
