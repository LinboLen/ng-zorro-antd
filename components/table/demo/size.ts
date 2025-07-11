import { Component } from '@angular/core';

import { TriTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'tri-demo-table-size',
  imports: [TriTableModule],
  template: `
    <h4>Middle size table</h4>
    <tri-table #middleTable size="middle" [data]="data">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of middleTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
    <h4>Small size table</h4>
    <tri-table #smallTable size="small" [data]="data">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of smallTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
  `,
  styles: [
    `
      h4 {
        margin-bottom: 16px;
      }
    `
  ]
})
export class TriDemoTableSizeComponent {
  data = [
    {
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
}
