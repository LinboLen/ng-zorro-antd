/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriTableModule, TriTbodyComponent } from 'ng-zorro-antd/table';

describe('nz-tbody', () => {
  [
    {
      component: TriTbodyTestTableComponent,
      case: 'should not add class to tbody in table',
      expected: false
    },
    {
      component: TriTbodyTestNzTableComponent,
      case: 'should add class to tbody in nz-table',
      expected: true
    }
  ].forEach(({ component, case: testCase, expected }) => {
    it(testCase, () => {
      const fixture = TestBed.createComponent(component);
      fixture.detectChanges();
      const tbody = fixture.debugElement.query(By.directive(TriTbodyComponent));
      expect(tbody.nativeElement.classList.contains('ant-table-tbody')).toBe(expected);
    });
  });
});

@Component({
  selector: 'tri-test-tbody-in-table',
  imports: [TriTableModule],
  template: `
    <table>
      <tbody></tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTbodyTestTableComponent {}

@Component({
  selector: 'tri-test-tbody-in-nz-table',
  imports: [TriTableModule],
  template: `
    <tri-table>
      <tbody></tbody>
    </tri-table>
  `
})
export class TriTbodyTestNzTableComponent {}
