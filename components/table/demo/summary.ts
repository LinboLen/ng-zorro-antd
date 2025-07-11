import { Component, OnInit } from '@angular/core';

import { TriTableModule } from 'ng-zorro-antd/table';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-table-summary',
  imports: [TriTableModule, TriTypographyModule],
  template: `
    <tri-table #middleTable bordered [data]="data" [showPagination]="false">
      <thead>
        <tr>
          <th>Name</th>
          <th>Borrow</th>
          <th>Repayment</th>
        </tr>
      </thead>
      <tbody>
        @for (data of middleTable.data; track $index) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.borrow }}</td>
            <td>{{ data.repayment }}</td>
          </tr>
        }
      </tbody>
      <tfoot summary>
        <tr>
          <td>Total</td>
          <td>
            <span tri-typography type="danger">{{ totalBorrow }}</span>
          </td>
          <td>
            <span tri-typography>{{ totalRepayment }}</span>
          </td>
        </tr>
        <tr>
          <td>Balance</td>
          <td colspan="2">
            <span tri-typography>{{ totalBorrow - totalRepayment }}</span>
          </td>
        </tr>
      </tfoot>
    </tri-table>

    <br />

    <tri-table
      #fixedTable
      bordered
      [data]="fixedData"
      [showPagination]="false"
      [scroll]="{ x: '1280px', y: '500px' }"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        @for (data of fixedTable.data; track data.key) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.description }}</td>
          </tr>
        }
      </tbody>
      <tfoot summary fixed>
        <tr>
          <td>Summary</td>
          <td>This is a summary content</td>
        </tr>
      </tfoot>
    </tri-table>
  `,
  styles: [
    `
      :host ::ng-deep tfoot.ant-table-summary {
        background-color: #fafafa !important;
      }
    `
  ]
})
export class TriDemoTableSummaryComponent implements OnInit {
  data = [
    {
      name: 'John Brown',
      borrow: 10,
      repayment: 33
    },
    {
      name: 'Jim Green',
      borrow: 100,
      repayment: 0
    },
    {
      name: 'Joe Black',
      borrow: 10,
      repayment: 10
    },
    {
      name: 'Jim Red',
      borrow: 75,
      repayment: 45
    }
  ];

  fixedData: Array<{ key: number; name: string; description: string }> = [];
  totalBorrow = 0;
  totalRepayment = 0;

  ngOnInit(): void {
    this.data.forEach(({ borrow, repayment }) => {
      this.totalBorrow += borrow;
      this.totalRepayment += repayment;
    });

    for (let i = 0; i < 20; i += 1) {
      this.fixedData.push({
        key: i,
        name: ['Light', 'Bamboo', 'Little'][i % 3],
        description: 'Everything that has a beginning, has an end.'
      });
    }
  }
}
