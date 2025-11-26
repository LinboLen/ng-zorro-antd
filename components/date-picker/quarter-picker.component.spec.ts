/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import isBefore from 'date-fns/isBefore';

import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { CandyDate } from 'ng-zorro-antd/core/time';
import { getPickerInput } from 'ng-zorro-antd/date-picker/testing/util';
import { PREFIX_CLASS } from 'ng-zorro-antd/date-picker/util';

import { TriDatePickerModule } from './date-picker.module';

describe('quater-picker', () => {
  let fixture: ComponentFixture<TriTestQuarterPickerComponent>;
  let fixtureInstance: TriTestQuarterPickerComponent;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideZoneChangeDetection()]
    });
  });

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestQuarterPickerComponent);
    fixtureInstance = fixture.componentInstance;
    // set initial mode
    fixtureInstance.useSuite = 1;
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should show quarter panel', fakeAsync(() => {
    fixtureInstance.format = undefined; // cover branch
    fixture.detectChanges();
    openPickerByClickTrigger();
    expect(queryFromOverlay('.ant-picker-quarter-panel')).toBeDefined();
  }));

  it('should change input value when click quarter', fakeAsync(() => {
    fixtureInstance.value = new Date('2024-04-04');
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    openPickerByClickTrigger();
    dispatchMouseEvent(queryFromOverlay('.ant-picker-cell'), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    expect(getPickerInput(fixture.debugElement).value).toBe('2024-Q1');
  }));

  it('should specified date provide by "value" be chosen', fakeAsync(() => {
    fixtureInstance.useSuite = 3;
    fixtureInstance.value = new Date('2024-04-30');
    fixture.detectChanges();
    flush(); // Wait writeValue() tobe done
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    expect(queryFromOverlay('.ant-picker-quarter-panel td.ant-picker-cell-selected').textContent).toContain('Q2');

    // Click the first cell to change ngModel
    const cell = queryFromOverlay('.ant-picker-quarter-panel td.ant-picker-cell:nth-child(1) .ant-picker-cell-inner');
    const cellText = cell.textContent!.trim();
    dispatchMouseEvent(cell, 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    expect(`Q${new CandyDate(fixtureInstance.value).setMonth(0).getQuarter().toString()}`).toBe(cellText);
  }));

  it('should nz-quarter-picker work', fakeAsync(() => {
    fixtureInstance.useSuite = 2;
    fixture.whenRenderingDone().then(() => {
      tick(500);
      fixture.detectChanges();
      openPickerByClickTrigger();
      dispatchMouseEvent(queryFromOverlay('.ant-picker-cell'), 'click');
      tick(500);
      expect(getPickerContainer()).not.toBeNull();
      const pickerInput = getPickerInput(fixture.debugElement);
      expect(pickerInput).not.toBeNull(); //
    });
  }));

  it('should nz-range-picker "nzValue" work', fakeAsync(() => {
    fixtureInstance.useSuite = 4;
    fixtureInstance.value = [new Date('2024-04-30'), new Date('2025-12-30')];
    fixture.whenRenderingDone().then(() => {
      tick(500);
      fixture.detectChanges();
      const panels = overlayContainerElement.querySelectorAll('.ant-picker-quarter-panel');
      expect(panels).not.toBeNull();
      expect(panels.length).toBe(2);

      tick(500);
      fixture.detectChanges();
      const firstCell = panels[0].querySelector('td.ant-picker-cell-selected')!;
      expect(firstCell).not.toBeNull();
      expect(firstCell.textContent!.trim()).toBe('Q2');

      const secondCell = panels[1].querySelector('td.ant-picker-cell-selected')!;
      expect(secondCell).not.toBeNull();
      expect(secondCell.textContent!.trim()).toBe('Q4');
    });
  }));

  it('should support year panel changes', fakeAsync(() => {
    fixtureInstance.useSuite = 3;

    fixtureInstance.value = new Date('2024-04-30');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    openPickerByClickTrigger();
    // Click year select to show year panel
    dispatchMouseEvent(queryFromOverlay('.ant-picker-header-quarter-btn'), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    expect(queryFromOverlay('.ant-picker-year-panel')).toBeDefined();
    expect(queryFromOverlay('.ant-picker-header-year-btn').textContent).toContain('2020');
    expect(queryFromOverlay('.ant-picker-header-year-btn').textContent).toContain('2029');
    // Goto previous year
    dispatchMouseEvent(getSuperPreBtn(), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    expect(queryFromOverlay('.ant-picker-header-year-btn').textContent).toContain('2010');
    expect(queryFromOverlay('.ant-picker-header-year-btn').textContent).toContain('2019');
    // Goto next year * 2
    dispatchMouseEvent(getSuperNextBtn(), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    dispatchMouseEvent(getSuperNextBtn(), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    expect(queryFromOverlay('.ant-picker-header-year-btn').textContent).toContain('2030');
    expect(queryFromOverlay('.ant-picker-header-year-btn').textContent).toContain('2039');
  }));

  it('should support nzDisabledDate', fakeAsync(() => {
    fixtureInstance.useSuite = 1;
    fixtureInstance.value = null;
    fixture.detectChanges();
    const compareDate = new Date('2024-8-01');
    fixtureInstance.value = new Date('2024-04-01');
    fixtureInstance.disabledDate = (current: Date) => isBefore(current, compareDate);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    openPickerByClickTrigger();
    const allDisabledCells = overlayContainerElement.querySelectorAll(
      '.ant-picker-quarter-panel tr td.ant-picker-cell-disabled'
    );
    const disabledCell = allDisabledCells[allDisabledCells.length - 1];
    expect(disabledCell.textContent).toContain('Q2');
  }));

  it('should support hover date cell style', fakeAsync(() => {
    fixtureInstance.useSuite = 4;
    fixture.detectChanges();
    openPickerByClickTrigger();
    tick(500);
    fixture.detectChanges();

    const left = getFirstCell('left'); // Use the first cell
    dispatchMouseEvent(left, 'click');
    const rightInNextMonth = queryFromRightPanel('table tr td.ant-picker-cell');
    dispatchMouseEvent(rightInNextMonth, 'mouseenter');
    fixture.detectChanges();
    expect(rightInNextMonth.classList.contains('ant-picker-cell-range-hover-end')).toBeTruthy();
  }));

  ////////////

  function queryFromRightPanel(selector: string): HTMLElement {
    return overlayContainerElement
      .querySelector('.ant-picker-panel:last-child')!
      .querySelector(selector) as HTMLElement;
  }

  function getFirstCell(partial: 'left' | 'right'): HTMLElement {
    const flg = partial === 'left' ? 'first' : 'last';
    return queryFromOverlay(
      `.ant-picker-quarter-panel:${flg}-child td:first-child .ant-picker-cell-inner`
    ) as HTMLElement;
  }

  function queryFromOverlay(selector: string): HTMLElement {
    return overlayContainerElement.querySelector(selector) as HTMLElement;
  }

  function openPickerByClickTrigger(): void {
    dispatchMouseEvent(getPickerInput(fixture.debugElement), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
  }

  function getPickerContainer(): HTMLElement {
    return queryFromOverlay('.ant-picker-quarter-panel') as HTMLElement;
  }

  function getSuperPreBtn(): HTMLElement {
    return queryFromOverlay(`.${PREFIX_CLASS}-header-super-prev-btn`);
  }

  function getSuperNextBtn(): HTMLElement {
    return queryFromOverlay(`.${PREFIX_CLASS}-header-super-next-btn`);
  }
});

@Component({
  imports: [TriDatePickerModule, FormsModule],
  template: `
    @switch (useSuite) {
      @case (1) {
        <tri-date-picker
          mode="quarter"
          [format]="format!"
          [ngModel]="value"
          [disabled]="disabled"
          [disabledDate]="disabledDate"
        />
      }
      @case (2) {
        <tri-quarter-picker [ngModel]="value" />
      }
      @case (3) {
        <tri-quarter-picker [ngModel]="value" open />
      }
      @case (4) {
        <tri-range-picker mode="quarter" [ngModel]="value" open />
      }
    }
  `
})
export class TriTestQuarterPickerComponent {
  useSuite!: 1 | 2 | 3 | 4;
  format?: string;
  value: Date | Date[] | null = null;
  disabled: boolean = false;
  disabledDate!: (d: Date) => boolean;
}
