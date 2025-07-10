import { Component } from '@angular/core';

import { TriResizableModule, TriResizeEvent } from 'ng-zorro-antd/resizable';
import { TriTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: '',
  imports: [TriResizableModule, TriTableModule],
  template: `
    <tri-table #basicTable [data]="listOfData">
      <thead>
        <tr>
          @for (col of cols; track col) {
            @if (col.width) {
              <th
                tri-resizable
                bounds="window"
                preview
                [width]="col.width"
                [maxWidth]="256"
                [minWidth]="60"
                (resizeEnd)="onResize($event, col.title)"
              >
                {{ col.title }}
                <tri-resize-handle direction="right">
                  <div class="resize-trigger"></div>
                </tri-resize-handle>
              </th>
            } @else {
              <th>
                {{ col.title }}
              </th>
            }
          }
        </tr>
      </thead>
      <tbody>
        @for (data of basicTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
            <td>-</td>
          </tr>
        }
      </tbody>
    </tri-table>
  `,
  styles: [
    `
      .nz-resizable-preview {
        border-width: 0;
        border-right-width: 1px;
      }
    `
  ]
})
export class TriDemoResizableTableComponent {
  cols: Array<{ title: string; width?: string }> = [
    {
      title: 'Name',
      width: '180px'
    },
    {
      title: 'Age',
      width: '180px'
    },
    {
      title: 'Address',
      width: '200px'
    },
    {
      title: 'Actions'
    }
  ];

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

  onResize({ width }: TriResizeEvent, col: string): void {
    this.cols = this.cols.map(e => (e.title === col ? { ...e, width: `${width}px` } : e));
  }
}
