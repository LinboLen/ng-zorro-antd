import { Component, OnInit } from '@angular/core';

import { TriTableModule } from 'ng-zorro-antd/table';

interface ItemData {
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}

@Component({
  selector: 'tri-demo-table-grouping-columns',
  imports: [TriTableModule],
  template: `
    <tri-table #groupingTable [data]="listOfData" bordered size="middle" [scroll]="{ x: '1200px', y: '240px' }">
      <thead>
        <tr>
          <th rowspan="4" left [filters]="filterName" [filterFn]="nameFilterFn">Name</th>
          <th colspan="4">Other</th>
          <th colspan="2">Company</th>
          <th rowspan="4" right>Gender</th>
        </tr>
        <tr>
          <th rowspan="3" [sortFn]="sortAgeFn">Age</th>
          <th colspan="3">Address</th>
          <th rowspan="3">Company Address</th>
          <th rowspan="3">Company Name</th>
        </tr>
        <tr>
          <th rowspan="2">Street</th>
          <th colspan="2">Block</th>
        </tr>
        <tr>
          <th>Building</th>
          <th>Door No.</th>
        </tr>
      </thead>
      <tbody>
        @for (data of groupingTable.data; track data) {
          <tr>
            <td left>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.street }}</td>
            <td>{{ data.building }}</td>
            <td>{{ data.number }}</td>
            <td>{{ data.companyAddress }}</td>
            <td>{{ data.companyName }}</td>
            <td right>{{ data.gender }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableGroupingColumnsComponent implements OnInit {
  listOfData: ItemData[] = [];
  sortAgeFn = (a: ItemData, b: ItemData): number => a.age - b.age;
  nameFilterFn = (list: string[], item: ItemData): boolean => list.some(name => item.name.indexOf(name) !== -1);
  filterName = [
    { text: 'Joe', value: 'Joe' },
    { text: 'John', value: 'John' }
  ];

  ngOnInit(): void {
    const data: ItemData[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M'
      });
    }
    this.listOfData = data;
  }
}
