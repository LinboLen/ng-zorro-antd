import { Component, OnInit } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTableModule } from 'ng-zorro-antd/table';

interface ParentItemData {
  key: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number | string;
  creator: string;
  createdAt: string;
  expand: boolean;
}

interface ChildrenItemData {
  key: number;
  name: string;
  date: string;
  upgradeNum: string;
}

@Component({
  selector: 'tri-demo-table-nested-table',
  imports: [TriBadgeModule, TriDividerModule, TriDropdownModule, TriIconModule, TriTableModule],
  template: `
    <tri-table #nestedTable [data]="listOfParentData" [pageSize]="10">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Platform</th>
          <th>Version</th>
          <th>Upgraded</th>
          <th>Creator</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of nestedTable.data; track data) {
          <tr>
            <td [(expandChange)]="data.expand"></td>
            <td>{{ data.name }}</td>
            <td>{{ data.platform }}</td>
            <td>{{ data.version }}</td>
            <td>{{ data.upgradeNum }}</td>
            <td>{{ data.creator }}</td>
            <td>{{ data.createdAt }}</td>
            <td>
              <a>Publish</a>
            </td>
          </tr>
          <tr [expand]="data.expand">
            <tri-table #innerTable [data]="listOfChildrenData" size="middle" [showPagination]="false">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Upgrade Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (data of innerTable.data; track data) {
                  <tr>
                    <td>{{ data.date }}</td>
                    <td>{{ data.name }}</td>
                    <td>
                      <tri-badge [status]="'success'" [text]="'Finished'"></tri-badge>
                    </td>
                    <td>{{ data.upgradeNum }}</td>
                    <td>
                      <span class="table-operation">
                        <a tri-dropdown class="operation" [dropdownMenu]="menu">
                          Pause
                          <tri-icon type="down" />
                        </a>
                        <tri-dropdown-menu #menu="nzDropdownMenu">
                          <ul tri-menu>
                            <li tri-menu-item>
                              <a>Action 1</a>
                            </li>
                            <li tri-menu-item>
                              <a>Action 2</a>
                            </li>
                          </ul>
                        </tri-dropdown-menu>
                        <tri-divider type="vertical"></tri-divider>
                        <a class="operation">Stop</a>
                        <tri-divider type="vertical"></tri-divider>
                        <a>More</a>
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </tri-table>
          </tr>
        }
      </tbody>
    </tri-table>
  `
})
export class TriDemoTableNestedTableComponent implements OnInit {
  listOfParentData: ParentItemData[] = [];
  listOfChildrenData: ChildrenItemData[] = [];

  ngOnInit(): void {
    for (let i = 0; i < 3; ++i) {
      this.listOfParentData.push({
        key: i,
        name: 'Screen',
        platform: 'iOS',
        version: '10.3.4.5654',
        upgradeNum: 500,
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
        expand: false
      });
    }
    for (let i = 0; i < 3; ++i) {
      this.listOfChildrenData.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56'
      });
    }
  }
}
