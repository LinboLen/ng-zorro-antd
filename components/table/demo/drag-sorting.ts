import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { TriTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'tri-demo-table-drag-sorting',
  imports: [CdkDropList, CdkDrag, TriTableModule],
  template: `
    <tri-table [data]="listOfData" [frontPagination]="false" [showPagination]="false">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody cdkDropList (cdkDropListDropped)="drop($event)">
        @for (data of listOfData; track data) {
          <tr cdkDrag>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
  `,
  styles: `
    ::ng-deep .cdk-drag-preview {
      display: table;
    }

    ::ng-deep .cdk-drag-placeholder {
      opacity: 0;
    }
  `
})
export class TriDemoTableDragSortingComponent {
  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
  }
}
