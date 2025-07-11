import { Component } from '@angular/core';

import { TriTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'tri-demo-table-fixed-columns',
  imports: [TriTableModule],
  template: `
    <tri-table #columnTable [data]="listOfData" [scroll]="{ x: '1100px' }">
      <thead>
        <tr>
          <th left>Full Name</th>
          <th left>Age</th>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
          <th>Column 4</th>
          <th>Column 5</th>
          <th>Column 6</th>
          <th>Column 7</th>
          <th right>Column 8</th>
          <th right>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of columnTable.data; track data) {
          <tr>
            <td left>{{ data.name }}</td>
            <td left>{{ data.age }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td>{{ data.address }}</td>
            <td right>{{ data.address }}</td>
            <td right>
              <a>action</a>
            </td>
          </tr>
        }
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableFixedColumnsComponent {
  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 40,
      address: 'London'
    }
  ];
}
