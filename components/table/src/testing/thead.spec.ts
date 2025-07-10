/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriTableComponent, TriTableModule } from 'ng-zorro-antd/table';

describe('nz-thead', () => {
  let fixture: ComponentFixture<TriTheadTestNzTableComponent>;
  let testComponent: TriTheadTestNzTableComponent;
  let table: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTheadTestNzTableComponent);
    fixture.detectChanges();
    testComponent = fixture.debugElement.componentInstance;
    table = fixture.debugElement.query(By.directive(TriTableComponent));
  });

  it('should sort change', () => {
    fixture.detectChanges();
    expect(testComponent.sortChange).toHaveBeenCalledTimes(0);
    const upButtons = table.nativeElement.querySelectorAll('.ant-table-column-sorters');
    upButtons[0].click();
    fixture.detectChanges();
    expect(testComponent.sortChange).toHaveBeenCalledTimes(1);
    expect(upButtons[0].querySelector('.ant-table-column-sorter-down').classList).toContain('anticon-caret-down');
    upButtons[1].click();
    fixture.detectChanges();
    expect(upButtons[0].querySelector('.ant-table-column-sorter-down').classList).toContain('anticon-caret-down');
    expect(upButtons[1].querySelector('.ant-table-column-sorter-down').classList).toContain('anticon-caret-down');
    expect(testComponent.sortChange).toHaveBeenCalledTimes(2);
  });

  // Test for #3603
  it('should support dynamic headers', () => {
    fixture.detectChanges();
    expect(testComponent.sortChange).toHaveBeenCalledTimes(0);
    let upButtons = table.nativeElement.querySelectorAll('.ant-table-column-sorters');
    upButtons[2].click();
    fixture.detectChanges();
    expect(testComponent.sortChange).toHaveBeenCalledTimes(1);
    upButtons[3].click();
    fixture.detectChanges();
    expect(testComponent.sortChange).toHaveBeenCalledTimes(2);

    testComponent.columns = testComponent.columns.slice(0, 1);
    fixture.detectChanges();
    upButtons = table.nativeElement.querySelectorAll('.ant-table-column-sorters');
    expect(upButtons.length).toBe(3);
    upButtons[2].click();
    expect(testComponent.sortChange).toHaveBeenCalledTimes(3);
  });
});

@Component({
  imports: [TriTableModule],
  template: `
    <tri-table>
      <thead (sortOrderChange)="sortChange($event)">
        <th columnKey="first" [sortFn]="filterFn"></th>
        <th columnKey="second" [sortFn]="filterFn">></th>
        @for (col of columns; track col) {
          <th [columnKey]="col" [sortFn]="filterFn">></th>
        }
      </thead>
    </tri-table>
  `
})
export class TriTheadTestNzTableComponent {
  sortChange = jasmine.createSpy('sort change');
  columns = ['third', 'fourth'];
  filterFn = (): number => -1;
}
