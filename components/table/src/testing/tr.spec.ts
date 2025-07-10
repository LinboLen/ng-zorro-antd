/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriTableModule, TriTrDirective } from 'ng-zorro-antd/table';

describe('nz-tr', () => {
  let fixture: ComponentFixture<TriTrTestTableComponent>;
  let tr: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTrTestTableComponent);
    fixture.detectChanges();
    tr = fixture.debugElement.query(By.directive(TriTrDirective));
  });

  it('should not add class', () => {
    fixture.detectChanges();
    expect(tr.nativeElement.classList).not.toContain('ant-table-row');
  });
});

@Component({
  imports: [TriTableModule],
  template: `
    <table>
      <tr></tr>
    </table>
  `
})
export class TriTrTestTableComponent {}
