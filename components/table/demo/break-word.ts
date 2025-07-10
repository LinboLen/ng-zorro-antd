import { Component, OnInit } from '@angular/core';

import { TriTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: '',
  imports: [TriTableModule],
  template: `
    <tri-table #fixedTable [data]="listOfData" [scroll]="{ x: '1000px', y: '240px' }">
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
          <th>Column 8</th>
          <th right>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of fixedTable.data; track data) {
          <tr>
            <td left>{{ data.name }}</td>
            <td left>{{ data.age }}</td>
            <td breakWord>{{ data.address }}</td>
            <td breakWord>{{ data.address }}</td>
            <td breakWord>{{ data.address }}</td>
            <td breakWord>{{ data.address }}</td>
            <td breakWord>{{ data.address }}</td>
            <td breakWord>{{ data.address }}</td>
            <td breakWord>{{ data.address }}</td>
            <td breakWord>{{ data.address }}</td>
            <td right>
              <a>action</a>
            </td>
          </tr>
        }
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableBreakWordComponent implements OnInit {
  listOfData: Array<{ name: string; age: number; address: string }> = [];

  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        name: `Edward King`,
        age: 32,
        address: `LondonLondonLondonLondonLondon`
      });
    }
  }
}
