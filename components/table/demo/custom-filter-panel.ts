import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriTableModule } from 'ng-zorro-antd/table';

interface DataItem {
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'tri-demo-table-custom-filter-panel',
  imports: [FormsModule, TriButtonModule, TriDropdownModule, TriIconModule, TriInputModule, TriTableModule],
  template: `
    <tri-table #nzTable [data]="listOfDisplayData" tableLayout="fixed">
      <thead>
        <tr>
          <th customFilter>
            Name
            <tri-filter-trigger [(visibleChange)]="visible" [active]="searchValue.length > 0" [dropdownMenu]="menu">
              <tri-icon type="search" />
            </tri-filter-trigger>
          </th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of table.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </tri-table>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <div class="tri-table-filter-dropdown">
        <div class="search-box">
          <input type="text" tri-input placeholder="Search name" [(ngModel)]="searchValue" />
          <button tri-button size="small" type="primary" (click)="search()" class="search-button">Search</button>
          <button tri-button size="small" (click)="reset()">Reset</button>
        </div>
      </div>
    </tri-dropdown-menu>
  `,
  styles: `
    .search-box {
      padding: 8px;
    }

    .search-box input {
      width: 188px;
      margin-bottom: 8px;
      display: block;
    }

    .search-box button {
      width: 90px;
    }

    .search-button {
      margin-right: 8px;
    }
  `
})
export class TriDemoTableCustomFilterPanelComponent {
  searchValue = '';
  visible = false;
  listOfData: DataItem[] = [
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
  listOfDisplayData = [...this.listOfData];

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.name.indexOf(this.searchValue) !== -1);
  }
}
