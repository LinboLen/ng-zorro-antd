import { Component } from '@angular/core';

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
  filterMultiple: boolean;
  sortDirections: TriTableSortOrder[];
}

@Component({
  selector: 'tri-demo-table-sort-filter',
  imports: [TriTableModule],
  template: `
    <tri-table #filterTable [data]="listOfData" tableLayout="fixed">
      <thead>
        <tr>
          @for (column of listOfColumns; track column) {
            <th
              [sortOrder]="column.sortOrder"
              [sortFn]="column.sortFn"
              [sortDirections]="column.sortDirections"
              [filterMultiple]="column.filterMultiple"
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
  `
})
export class TriDemoTableSortFilterComponent {
  listOfColumns: ColumnItem[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: ItemData, b: ItemData) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim', byDefault: true }
      ],
      filterFn: (list: string[], item: ItemData) => list.some(name => item.name.indexOf(name) !== -1)
    },
    {
      name: 'Age',
      sortOrder: 'descend',
      sortFn: (a: ItemData, b: ItemData) => a.age - b.age,
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Address',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: ItemData, b: ItemData) => a.address.length - b.address.length,
      filterMultiple: false,
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
}
