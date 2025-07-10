/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriCustomColumn, TriTableComponent, TriTableModule } from 'ng-zorro-antd/table';

describe('nz-table-custom-column', () => {
  let fixture: ComponentFixture<TriCustomColumnTestTableComponent>;
  let testComponent: TriCustomColumnTestTableComponent;
  let resultEl: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TriCustomColumnTestTableComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriTableComponent));
  });

  it('custom-column basic', () => {
    fixture.detectChanges();
    // age: order = 3
    expect(resultEl.nativeElement.querySelectorAll('.ant-table-cell')[2].getAttribute('nzcellcontrol')).toBe('age');
    expect(resultEl.nativeElement.querySelectorAll('.ant-table-cell')[2].style.order).toBe('3');
    testComponent.customColumn = [
      {
        value: 'name',
        default: true,
        width: 200
      },
      {
        value: 'age',
        default: true,
        width: 200
      },
      {
        value: 'gender',
        default: false,
        width: 200
      },
      {
        value: 'address',
        default: true,
        width: 200
      },
      {
        value: 'action',
        default: true,
        width: 200
      }
    ];
    fixture.detectChanges();
    // age: order = 1
    expect(resultEl.nativeElement.querySelectorAll('.ant-table-cell')[2].getAttribute('nzcellcontrol')).toBe('age');
    expect(resultEl.nativeElement.querySelectorAll('.ant-table-cell')[2].style.order).toBe('1');

    expect(resultEl.nativeElement.querySelectorAll('.ant-table-cell')[1].getAttribute('nzcellcontrol')).toBe('gender');
    expect(resultEl.nativeElement.querySelectorAll('.ant-table-cell')[1].style.display).toBe('none');
  });
});

interface Person {
  key: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  address: string;
}

@Component({
  imports: [TriDividerModule, TriTableModule],
  template: `
    <tri-table #basicTable [data]="listOfData" [customColumn]="customColumn">
      <thead>
        <tr>
          <th cellControl="name">Name</th>
          <th cellControl="gender">Gender</th>
          <th cellControl="age">Age</th>
          <th cellControl="address">Address</th>
          <th cellControl="action">Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of basicTable.data; track data) {
          <tr>
            <td cellControl="name">{{ data.name }}</td>
            <td cellControl="gender">{{ data.gender }}</td>
            <td cellControl="age">{{ data.age }}</td>
            <td cellControl="address">{{ data.address }}</td>
            <td cellControl="action">
              <a>Action</a>
              <tri-divider type="vertical"></tri-divider>
              <a>Delete</a>
            </td>
          </tr>
        }
      </tbody>
    </tri-table>
  `
})
export class TriCustomColumnTestTableComponent {
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      gender: 'female',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      gender: 'female',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      gender: 'male',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  customColumn: TriCustomColumn[] = [
    {
      value: 'name',
      default: true,
      width: 200
    },
    {
      value: 'gender',
      default: true,
      width: 200
    },
    {
      value: 'address',
      default: true,
      width: 200
    },
    {
      value: 'age',
      default: true,
      width: 200
    },
    {
      value: 'action',
      default: true,
      width: 200
    }
  ];
}
