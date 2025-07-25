/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriTableModule } from '../table.module';
import { TriTableSummaryFixedType } from '../table.types';

describe('tfoot', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should nzSummary work ', () => {
    fixture.detectChanges();
    const tfoot = component.elementRef.nativeElement.querySelector('tfoot.ant-table-summary') as HTMLElement;
    expect(tfoot.textContent).toContain('summary');
  });

  it('should fixed work', () => {
    component.scrollY = '100px';
    component.fixed = true;
    fixture.detectChanges();

    const tfoot = component.elementRef.nativeElement.querySelector('div.ant-table-summary tfoot.ant-table-summary');
    expect(tfoot).toBeTruthy();
  });

  it('should fixed not work when scrollY is not set', () => {
    component.scrollY = null;
    component.fixed = true;
    fixture.detectChanges();

    const tfoot = component.elementRef.nativeElement.querySelector('div.ant-table-summary tfoot.ant-table-summary');
    expect(tfoot).not.toBeTruthy();
  });

  it('should fixed at top work', () => {
    component.scrollY = '100px';
    component.fixed = 'top';
    fixture.detectChanges();

    const tfoot = component.elementRef.nativeElement.querySelector('div.ant-table-header tfoot.ant-table-summary');
    expect(tfoot).toBeTruthy();
  });
});

@Component({
  imports: [TriTableModule],
  template: `
    <tri-table [scroll]="{ x: scrollX, y: scrollY }">
      <thead>
        <th></th>
        <th></th>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
      </tbody>
      <tfoot summary [fixed]="fixed">
        <td colspan="2">summary</td>
      </tfoot>
    </tri-table>
  `
})
export class TestComponent {
  scrollX: string | null = null;
  scrollY: string | null = null;
  fixed: TriTableSummaryFixedType | boolean = false;

  constructor(public elementRef: ElementRef) {}
}
