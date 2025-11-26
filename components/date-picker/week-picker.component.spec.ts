/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { getPickerInput } from 'ng-zorro-antd/date-picker/testing/util';

import { TriDatePickerModule } from './date-picker.module';

describe('week-picker', () => {
  let fixture: ComponentFixture<TriTestWeekPickerComponent>;
  let fixtureInstance: TriTestWeekPickerComponent;
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
    fixture = TestBed.createComponent(TriTestWeekPickerComponent);
    fixtureInstance = fixture.componentInstance;
    // set initial mode
    fixtureInstance.useSuite = 1;
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should show week num', fakeAsync(() => {
    fixtureInstance.format = undefined; // cover branch
    fixture.detectChanges();
    openPickerByClickTrigger();
    expect(queryFromOverlay('.ant-picker-week-panel-row .ant-picker-cell-week')).toBeDefined();
  }));

  it('should change input value when click week', fakeAsync(() => {
    fixtureInstance.value = new Date('2020-02-25');
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    openPickerByClickTrigger();
    dispatchMouseEvent(queryFromOverlay('.ant-picker-cell'), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    expect(getPickerInput(fixture.debugElement).value).toBe('2020-05');
  }));

  it('should change panel to week from month', fakeAsync(() => {
    fixtureInstance.value = new Date('2020-02-25');
    fixture.detectChanges();
    openPickerByClickTrigger();
    dispatchMouseEvent(queryFromOverlay('.ant-picker-header-month-btn'), 'click');
    fixture.detectChanges();
    dispatchMouseEvent(queryFromOverlay('.ant-picker-cell'), 'click');
    fixture.detectChanges();
    expect(queryFromOverlay('.ant-picker-week-panel')).toBeTruthy();
  }));

  it('should show week num', fakeAsync(() => {
    fixtureInstance.useSuite = 2;
    fixture.whenRenderingDone().then(() => {
      tick(500);
      fixture.detectChanges();
      fixtureInstance.format = undefined; // cover branch
      fixture.detectChanges();
      openPickerByClickTrigger();
      expect(queryFromOverlay('.ant-picker-week-panel-row .ant-picker-cell-week')).toBeDefined();
    });
  }));

  ////////////

  function queryFromOverlay(selector: string): HTMLElement {
    return overlayContainerElement.querySelector(selector) as HTMLElement;
  }

  function openPickerByClickTrigger(): void {
    dispatchMouseEvent(getPickerInput(fixture.debugElement), 'click');
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
  }
});

@Component({
  imports: [TriDatePickerModule, FormsModule],
  template: `
    @switch (useSuite) {
      @case (1) {
        <tri-date-picker mode="week" [format]="format!" [ngModel]="value" />
      }
      @case (2) {
        <tri-week-picker [ngModel]="value" />
      }
    }
  `
})
export class TriTestWeekPickerComponent {
  useSuite!: 1 | 2;
  format?: string;
  value: Date | null = null;
}
