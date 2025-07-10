import { Component, OnInit } from '@angular/core';

import { TriTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: '',
  imports: [TriTableModule],
  template: `
    <tri-table #fixedTable [data]="listOfData" tableLayout="fixed">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Age</th>
          <th>Column 1</th>
          <th>Column 2</th>
          <th ellipsis>Column ColumnColumn 3</th>
          <th>Column 4</th>
        </tr>
      </thead>
      <tbody>
        @for (data of fixedTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td ellipsis>{{ data.address }}</td>
            <td ellipsis>{{ data.address }}</td>
            <td ellipsis>{{ data.address }}</td>
            <td ellipsis>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableEllipsisComponent implements OnInit {
  listOfData: Array<{ name: string; age: number; address: string }> = [];

  ngOnInit(): void {
    for (let i = 0; i < 3; i++) {
      this.listOfData.push({
        name: `Edward King`,
        age: 32,
        address: `LondonLondonLondonLondonLondon`
      });
    }
  }
}
