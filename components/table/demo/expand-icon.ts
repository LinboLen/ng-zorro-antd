import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'tri-demo-table-expand-icon',
  imports: [TriIconModule, TriTableModule],
  template: `
    <tri-table #nzTable [data]="listOfData" tableLayout="fixed">
      <thead>
        <tr>
          <th width="60px"></th>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of table.data; track data) {
          <tr>
            <td [expand]="expandSet.has(data.id)" [expandIcon]="expandIcon"></td>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
          <tr [expand]="expandSet.has(data.id)">
            <span>{{ data.description }}</span>
          </tr>
          <ng-template #expandIcon>
            @if (!expandSet.has(data.id)) {
              <tri-icon type="plus-circle" theme="outline" (click)="onExpandChange(data.id, true)" />
            } @else {
              <tri-icon type="minus-circle" theme="outline" (click)="onExpandChange(data.id, false)" />
            }
          </ng-template>
        }
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableExpandIconComponent {
  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];
}
