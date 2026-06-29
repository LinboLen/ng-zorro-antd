/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ApplicationRef, Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { dispatchFakeEvent, updateNonSignalsInput } from 'ng-zorro-antd/core/testing';

import { TriTimePickerPanelComponent } from './time-picker-panel.component';

describe('time-picker-panel', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriTestTimePanelComponent>;
    let testComponent: TriTestTimePanelComponent;
    let panelElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimePanelComponent);
      testComponent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      panelElement = fixture.debugElement.query(By.directive(TriTimePickerPanelComponent));
    });

    it('should init correct', () => {
      fixture.detectChanges();
      expect(panelElement.nativeElement.classList).toContain('ant-picker-time-panel');
    });

    it('should format work', () => {
      fixture.detectChanges();
      expect(testComponent.timePickerPanelComponent.hourEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.minuteEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.secondEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.enabledColumns).toBe(3);
      testComponent.format.set('HH:mm');
      fixture.detectChanges();
      expect(testComponent.timePickerPanelComponent.hourEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.minuteEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.secondEnabled).toBe(false);
      expect(testComponent.timePickerPanelComponent.enabledColumns).toBe(2);
      testComponent.format.set(null!);
      fixture.detectChanges();
      expect(testComponent.timePickerPanelComponent.hourEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.minuteEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.secondEnabled).toBe(false);
      expect(testComponent.timePickerPanelComponent.enabledColumns).toBe(2);
    });

    it('should select default open value on list click', async () => {
      const listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('10');
      expect(listOfSelectedLi[1].innerText).toBe('11');
      expect(listOfSelectedLi[2].innerText).toBe('12');
      expect(testComponent.value()).toBeUndefined();
      dispatchFakeEvent(listOfSelectedLi[0], 'click');
      await stabilize(fixture);
      expect(testComponent.value()).not.toBeUndefined();
    });

    it('should select scroll work', async () => {
      testComponent.value.set(new Date(0, 0, 0, 8, 9, 10));
      await stabilize(fixture);
      let listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('08');
      expect(listOfSelectedLi[1].innerText).toBe('09');
      expect(listOfSelectedLi[2].innerText).toBe('10');
      testComponent.timePickerPanelComponent.selectHour({ index: 0, disabled: false });
      testComponent.timePickerPanelComponent.selectMinute({ index: 1, disabled: false });
      testComponent.timePickerPanelComponent.selectSecond({ index: 2, disabled: false });
      await stabilize(fixture);
      listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('00');
      expect(listOfSelectedLi[1].innerText).toBe('01');
      expect(listOfSelectedLi[2].innerText).toBe('02');
    });

    it('should step work', () => {
      fixture.detectChanges();
      let listOfSelectContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listOfSelectContainer[0].children.length).toEqual(24);
      expect(listOfSelectContainer[1].children.length).toEqual(60);
      expect(listOfSelectContainer[2].children.length).toEqual(60);
      testComponent.hourStep.set(2);
      testComponent.minuteStep.set(15);
      testComponent.secondStep.set(10);
      fixture.detectChanges();
      listOfSelectContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listOfSelectContainer[0].children.length).toEqual(12);
      expect(listOfSelectContainer[1].children.length).toEqual(4);
      expect(listOfSelectContainer[2].children.length).toEqual(6);
    });

    it('should click now work', () => {
      const now = new Date();
      fixture.detectChanges();
      dispatchFakeEvent(panelElement.nativeElement.querySelector('.ant-picker-now > a'), 'click');
      fixture.detectChanges();
      const listOfSelectContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(
        listOfSelectContainer[0].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toContain(now.getHours().toString());
      expect(
        listOfSelectContainer[1].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toContain(now.getMinutes().toString());
    });

    it('should offsetTop is right', async () => {
      testComponent.value.set(new Date(0, 0, 0, 0, 0, 0));
      await stabilize(fixture);
      const listOfSelectedLi = panelElement.nativeElement.querySelector('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi.offsetTop).toBe(0);
    });

    describe('change detection behavior', () => {
      it('should not run change detection when the timer picker panel is clicked', () => {
        const appRef = TestBed.inject(ApplicationRef);
        const event = new MouseEvent('mousedown');

        vi.spyOn(appRef, 'tick');
        vi.spyOn(event, 'preventDefault');

        fixture.nativeElement.querySelector('nz-time-picker-panel').dispatchEvent(event);

        expect(appRef.tick).not.toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('disabled', () => {
    let fixture: ComponentFixture<TriTestTimePanelDisabledComponent>;
    let testComponent: TriTestTimePanelDisabledComponent;
    let panelElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimePanelDisabledComponent);
      testComponent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      panelElement = fixture.debugElement.query(By.directive(TriTimePickerPanelComponent));
    });

    it('should disabled work', async () => {
      await stabilize(fixture);
      const listOfSelectContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listOfSelectContainer[0].querySelectorAll('.ant-picker-time-panel-cell-disabled').length).toBe(3);
      expect(listOfSelectContainer[1].querySelectorAll('.ant-picker-time-panel-cell-disabled').length).toBe(0);
      expect(listOfSelectContainer[2].querySelectorAll('.ant-picker-time-panel-cell-disabled').length).toBe(0);
      testComponent.timePickerPanelComponent.selectHour({ index: 4, disabled: false });
      fixture.detectChanges();
      expect(listOfSelectContainer[1].querySelectorAll('.ant-picker-time-panel-cell-disabled').length).toBe(6);
      testComponent.timePickerPanelComponent.selectHour({ index: 5, disabled: false });
      testComponent.timePickerPanelComponent.selectMinute({ index: 1, disabled: false });
      fixture.detectChanges();
      expect(listOfSelectContainer[2].querySelectorAll('.ant-picker-time-panel-cell-disabled').length).toBe(6);
      testComponent.hideDisabledOptions.set(true);
      fixture.detectChanges();
      expect(listOfSelectContainer[0].children.length).toBe(21);
      expect(listOfSelectContainer[2].children.length).toBe(54);
    });

    it('should now disabled work', async () => {
      // disable every hour
      testComponent.disabledHours.set(() => [...Array(24).keys()]);
      await stabilize(fixture);
      dispatchFakeEvent(panelElement.nativeElement.querySelector('.ant-picker-now > a'), 'click');
      fixture.detectChanges();
      const listOfSelectContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(testComponent.value()).toEqual(new Date(0, 0, 0, 0, 0, 0));
      expect(
        listOfSelectContainer[0].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toBe('00');
      expect(
        listOfSelectContainer[1].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toBe('00');
      expect(
        listOfSelectContainer[2].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toBe('00');
    });
  });

  describe('12-hour', () => {
    let panelElement: DebugElement;
    let fixture12Hour: ComponentFixture<TriTest12HourTimePanelComponent>;
    let testComponent: TriTest12HourTimePanelComponent;

    beforeEach(() => {
      fixture12Hour = TestBed.createComponent(TriTest12HourTimePanelComponent);
      testComponent = fixture12Hour.debugElement.componentInstance;
      fixture12Hour.detectChanges();
      panelElement = fixture12Hour.debugElement.query(By.directive(TriTimePickerPanelComponent));
    });

    it('basic 12-hour time-picker-panel', () => {
      fixture12Hour.detectChanges();
      expect(testComponent.timePickerPanelComponent.enabledColumns).toBe(4);
      const listColumns: HTMLElement[] = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listColumns[0].querySelectorAll('li')[0].innerText).toBe('12');
      const hour12labels = listColumns[3].querySelectorAll('li');
      expect(hour12labels[0].innerText).toBe('am');
      expect(hour12labels[1].innerText).toBe('pm');
    });

    it('default value 12-hour time-picker-panel', async () => {
      await stabilize(fixture12Hour, 1000);
      const listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('12');
      expect(listOfSelectedLi[1].innerText).toBe('00');
      expect(listOfSelectedLi[2].innerText).toBe('00');
      expect(listOfSelectedLi[3].innerText).toBe('am');
    });

    it('should scroll work in 12-hour', async () => {
      fixture12Hour.componentInstance.openValue.set(new Date(0, 0, 0, 5, 6, 7));
      await stabilize(fixture12Hour, 1000);
      fixture12Hour.componentInstance.timePickerPanelComponent.select12Hours({ index: 1, value: 'pm' });
      await stabilize(fixture12Hour);
      let listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('05');
      expect(listOfSelectedLi[1].innerText).toBe('06');
      expect(listOfSelectedLi[2].innerText).toBe('07');
      expect(listOfSelectedLi[3].innerText).toBe('pm');
      fixture12Hour.componentInstance.value.set(new Date(0, 0, 0, 6, 7, 8));
      await stabilize(fixture12Hour, 1000);
      listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('06');
      expect(listOfSelectedLi[1].innerText).toBe('07');
      expect(listOfSelectedLi[2].innerText).toBe('08');
    });

    it('select hour and 12-hour in 12-hour-time-picker-panel', async () => {
      fixture12Hour.detectChanges();
      testComponent.timePickerPanelComponent.selectHour({ index: 3, disabled: false });
      testComponent.timePickerPanelComponent.select12Hours({ index: 1, value: 'pm' });
      await stabilize(fixture12Hour);
      expect(testComponent.value()!.getHours()).toBe(15);
      testComponent.timePickerPanelComponent.select12Hours({ index: 0, value: 'am' });
      await stabilize(fixture12Hour);
      expect(testComponent.value()!.getHours()).toBe(3);
    });

    it('hour step in 12-hour-time-picker-panel', () => {
      testComponent.hourStep.set(2);
      fixture12Hour.detectChanges();
      const listOfHourContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listOfHourContainer[0].children.length).toEqual(6);
    });
  });

  describe('disabled and format 12-hour', () => {
    let panelElement: DebugElement;
    let fixture12Hour: ComponentFixture<TriTest12HourTimePanelDisabledComponent>;
    let testComponent: TriTest12HourTimePanelDisabledComponent;

    beforeEach(() => {
      fixture12Hour = TestBed.createComponent(TriTest12HourTimePanelDisabledComponent);
      testComponent = fixture12Hour.debugElement.componentInstance;
      fixture12Hour.detectChanges();
      panelElement = fixture12Hour.debugElement.query(By.directive(TriTimePickerPanelComponent));
    });

    it('format in 12-hour-time-pick-panel', () => {
      testComponent.format.set('hh:mm:ss A');
      fixture12Hour.detectChanges();
      const list12HourLi = panelElement.nativeElement
        .querySelectorAll('.ant-picker-time-panel-column')[3]
        .querySelectorAll('li');
      expect(list12HourLi[0].innerText).toBe('AM');
      expect(list12HourLi[1].innerText).toBe('PM');
    });

    it('disabled hour in 12-hour-time-picker-panel', async () => {
      await stabilize(fixture12Hour);
      testComponent.disabledHours.set((): number[] => [0, 3, 4, 5, 12, 18, 19, 20, 24]);
      await stabilize(fixture12Hour);
      let listHourLi = panelElement.nativeElement
        .querySelectorAll('.ant-picker-time-panel-column')[0]
        .querySelectorAll('li');
      expect(listHourLi[0].classList).toContain('ant-picker-time-panel-cell-disabled');
      expect(listHourLi[3].classList).toContain('ant-picker-time-panel-cell-disabled');
      expect(listHourLi[4].classList).toContain('ant-picker-time-panel-cell-disabled');
      expect(listHourLi[5].classList).toContain('ant-picker-time-panel-cell-disabled');
      testComponent.timePickerPanelComponent.select12Hours({ index: 1, value: 'pm' });
      fixture12Hour.detectChanges();
      listHourLi = panelElement.nativeElement
        .querySelectorAll('.ant-picker-time-panel-column')[0]
        .querySelectorAll('li');
      expect(listHourLi[0].classList).toContain('ant-picker-time-panel-cell-disabled');
      expect(listHourLi[6].classList).toContain('ant-picker-time-panel-cell-disabled');
      expect(listHourLi[7].classList).toContain('ant-picker-time-panel-cell-disabled');
      expect(listHourLi[8].classList).toContain('ant-picker-time-panel-cell-disabled');

      await stabilize(fixture12Hour, 500);
      listHourLi = panelElement.nativeElement
        .querySelectorAll('.ant-picker-time-panel-column')[3]
        .querySelectorAll('li');

      expect(listHourLi.length).not.toBe(0);
    });
  });
});

async function stabilize<T>(fixture: ComponentFixture<T>, ms?: number): Promise<void> {
  fixture.detectChanges();
  await updateNonSignalsInput(fixture, ms);
  fixture.detectChanges();
}

@Component({
  imports: [TriTimePickerPanelComponent, FormsModule],
  template: `
    <tri-time-picker-panel
      [(ngModel)]="value"
      [format]="format()"
      [defaultOpenValue]="openValue()"
      [secondStep]="secondStep()"
      [minuteStep]="minuteStep()"
      [hourStep]="hourStep()"
    />
  `
})
export class TriTestTimePanelComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  readonly secondStep = signal(1);
  readonly minuteStep = signal(1);
  readonly hourStep = signal(1);
  readonly openValue = signal(new Date(0, 0, 0, 10, 11, 12));
  readonly format = signal('HH:mm:ss');
  readonly value = signal<Date | undefined>(undefined);
}

@Component({
  imports: [TriTimePickerPanelComponent, FormsModule],
  template: `
    <tri-time-picker-panel
      [(ngModel)]="value"
      [format]="format()"
      [disabledHours]="disabledHours()"
      [disabledMinutes]="disabledMinutes"
      [disabledSeconds]="disabledSeconds"
      [defaultOpenValue]="openValue()"
      [secondStep]="secondStep()"
      [minuteStep]="minuteStep()"
      [inDatePicker]="inDatePicker()"
      [hideDisabledOptions]="hideDisabledOptions()"
      [hourStep]="hourStep()"
    />
  `
})
export class TriTestTimePanelDisabledComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  readonly inDatePicker = signal(false);
  readonly secondStep = signal(1);
  readonly minuteStep = signal(1);
  readonly hourStep = signal(1);
  readonly hideDisabledOptions = signal(false);
  readonly openValue = signal(new Date(0, 0, 0, 10, 11, 12));
  readonly format = signal('HH:mm:ss');
  readonly value = signal(new Date(0, 0, 0, 0, 0, 0));
  readonly disabledHours = signal<() => number[]>(() => [1, 2, 3]);

  disabledMinutes(hour: number): number[] {
    if (hour === 4) {
      return [20, 21, 22, 23, 24, 25];
    } else {
      return [];
    }
  }

  disabledSeconds(hour: number, minute: number): number[] {
    if (hour === 5 && minute === 1) {
      return [20, 21, 22, 23, 24, 25];
    } else {
      return [];
    }
  }
}

@Component({
  imports: [TriTimePickerPanelComponent, FormsModule],
  template: `
    <tri-time-picker-panel
      [(ngModel)]="value"
      [use12Hours]="true"
      [defaultOpenValue]="openValue()"
      [hourStep]="hourStep()"
      [format]="format()"
    />
  `
})
export class TriTest12HourTimePanelComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  readonly format = signal('hh:mm:ss a');
  readonly hourStep = signal(1);
  readonly openValue = signal(new Date(0, 0, 0, 0, 0, 0));
  readonly value = signal<Date | undefined>(undefined);
}

@Component({
  imports: [TriTimePickerPanelComponent, FormsModule],
  template: `
    <tri-time-picker-panel
      [format]="format()"
      [(ngModel)]="value"
      [use12Hours]="true"
      [disabledHours]="disabledHours()"
      [disabledMinutes]="disabledMinutes"
      [disabledSeconds]="disabledSeconds"
      [hideDisabledOptions]="false"
    />
  `
})
export class TriTest12HourTimePanelDisabledComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  readonly format = signal('hh:mm:ss a');
  readonly value = signal(new Date(0, 0, 0, 1, 1, 1));
  readonly disabledHours = signal<() => number[]>(() => []);

  disabledMinutes(hour: number): number[] {
    if (hour === 4) {
      return [20, 21, 22, 23, 24, 25];
    } else {
      return [];
    }
  }

  disabledSeconds(hour: number, minute: number): number[] {
    if (hour === 5 && minute === 1) {
      return [20, 21, 22, 23, 24, 25];
    } else {
      return [];
    }
  }
}
