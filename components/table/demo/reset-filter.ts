import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import {
  TriTableFilterFn,
  TriTableFilterList,
  TriTableModule,
  TriTableSortFn,
  TriTableSortOrder
} from 'ng-zorro-antd/table';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

interface ColumnItem {
  name: string;
  sortOrder: TriTableSortOrder | null;
  sortFn: TriTableSortFn<ItemData> | null;
  listOfFilter: TriTableFilterList;
  filterFn: TriTableFilterFn<ItemData> | null;
}

@Component({
  selector: 'tri-demo-table-reset-filter',
  imports: [TriButtonModule, TriTableModule],
  template: `
    <div class="table-operations">
      <button tri-button (click)="sortByAge()">Sort age</button>
      <button tri-button (click)="resetFilters()">Clear filters</button>
      <button tri-button (click)="resetSortAndFilters()">Clear filters and sorters</button>
    </div>
    <tri-table #filterTable [data]="listOfData" tableLayout="fixed">
      <thead>
        <tr>
          @for (column of listOfColumns; track column.name) {
            <th
              [(sortOrderChange)]="column.sortOrder"
              [sortFn]="column.sortFn"
              [filters]="column.listOfFilter"
              [filterFn]="column.filterFn"
            >
              {{ column.name }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (data of filterTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
  `,
  styles: `
    .table-operations {
      margin-bottom: 16px;
    }

    .table-operations > button {
      margin-right: 8px;
    }
  `
})
export class TriDemoTableResetFilterComponent {
  listOfColumns: ColumnItem[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: ItemData, b: ItemData) => a.name.localeCompare(b.name),
      listOfFilter: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' }
      ],
      filterFn: (list: string[], item: ItemData) => list.some(name => item.name.indexOf(name) !== -1)
    },
    {
      name: 'Age',
      sortOrder: null,
      sortFn: (a: ItemData, b: ItemData) => a.age - b.age,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Address',
      sortFn: null,
      sortOrder: null,
      listOfFilter: [
        { text: 'London', value: 'London' },
        { text: 'Sidney', value: 'Sidney' }
      ],
      filterFn: (address: string, item: ItemData) => item.address.indexOf(address) !== -1
    }
  ];
  listOfData: ItemData[] = [
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
    },
    {
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park'
    }
  ];

  sortByAge(): void {
    this.listOfColumns.forEach(item => {
      if (item.name === 'Age') {
        item.sortOrder = 'descend';
      } else {
        item.sortOrder = null;
      }
    });
  }

  resetFilters(): void {
    this.listOfColumns.forEach(item => {
      if (item.name === 'Name') {
        item.listOfFilter = [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' }
        ];
      } else if (item.name === 'Address') {
        item.listOfFilter = [
          { text: 'London', value: 'London' },
          { text: 'Sidney', value: 'Sidney' }
        ];
      }
    });
  }

  resetSortAndFilters(): void {
    this.listOfColumns.forEach(item => {
      item.sortOrder = null;
    });
    this.resetFilters();
  }
}
