/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriTableModule, TriTbodyComponent } from 'ng-zorro-antd/table';

describe('nz-tbody', () => {
  describe('nz-tbody in table', () => {
    let fixture: ComponentFixture<TriTbodyTestTableComponent>;
    let tbody: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTbodyTestTableComponent);
      fixture.detectChanges();
      tbody = fixture.debugElement.query(By.directive(TriTbodyComponent));
    });

    it('should not add class', () => {
      fixture.detectChanges();
      expect(tbody.nativeElement.classList).not.toContain('ant-table-tbody');
    });
  });

  describe('nz-tbody in nz-table', () => {
    let fixture: ComponentFixture<TriTbodyTestNzTableComponent>;
    let tbody: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTbodyTestNzTableComponent);
      fixture.detectChanges();
      tbody = fixture.debugElement.query(By.directive(TriTbodyComponent));
    });
    it('should not add class', () => {
      fixture.detectChanges();
      expect(tbody.nativeElement.classList).toContain('ant-table-tbody');
    });
  });
});

@Component({
  imports: [TriTableModule],
  template: `
    <table>
      <tbody></tbody>
    </table>
  `
})
export class TriTbodyTestTableComponent {}

@Component({
  imports: [TriTableModule],
  template: `
    <tri-table>
      <tbody></tbody>
    </tri-table>
  `
})
export class TriTbodyTestNzTableComponent {
  expand = false;
}
