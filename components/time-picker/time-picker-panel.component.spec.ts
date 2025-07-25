/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ApplicationRef, Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { dispatchFakeEvent } from 'ng-zorro-antd/core/testing';

import { TriTimePickerPanelComponent } from './time-picker-panel.component';

describe('time-picker-panel', () => {
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
      testComponent.format = 'HH:mm';
      fixture.detectChanges();
      expect(testComponent.timePickerPanelComponent.hourEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.minuteEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.secondEnabled).toBe(false);
      expect(testComponent.timePickerPanelComponent.enabledColumns).toBe(2);
      testComponent.format = null!;
      fixture.detectChanges();
      expect(testComponent.timePickerPanelComponent.hourEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.minuteEnabled).toBe(true);
      expect(testComponent.timePickerPanelComponent.secondEnabled).toBe(false);
      expect(testComponent.timePickerPanelComponent.enabledColumns).toBe(2);
    });

    // it('should default open value work', fakeAsync(() => {
    //   testComponent.opened = true;
    //   fixture.detectChanges();
    //   tick(1000);
    //   fixture.detectChanges();
    //   let listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
    //   expect(listOfSelectedLi[0].innerText).toBe('10');
    //   expect(listOfSelectedLi[1].innerText).toBe('11');
    //   expect(listOfSelectedLi[2].innerText).toBe('12');
    //   listOfSelectedLi.forEach((li: HTMLElement) => {
    //     expect(li.parentElement!.parentElement!.scrollTop).toBe(li.offsetTop);
    //   });
    //   testComponent.value = new Date(0, 0, 0, 8, 9, 10);
    //   fixture.detectChanges();
    //   flush();
    //   fixture.detectChanges();
    //   flush();
    //   listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
    //   expect(listOfSelectedLi[0].innerText).toBe('08');
    //   expect(listOfSelectedLi[1].innerText).toBe('09');
    //   expect(listOfSelectedLi[2].innerText).toBe('10');
    // }));

    it('should select default open value on list click', fakeAsync(() => {
      const listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('10');
      expect(listOfSelectedLi[1].innerText).toBe('11');
      expect(listOfSelectedLi[2].innerText).toBe('12');
      expect(testComponent.value).toBeUndefined();
      dispatchFakeEvent(listOfSelectedLi[0], 'click');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).not.toBeUndefined();
    }));

    it('should select scroll work', fakeAsync(() => {
      testComponent.value = new Date(0, 0, 0, 8, 9, 10);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      flush();
      let listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('08');
      expect(listOfSelectedLi[1].innerText).toBe('09');
      expect(listOfSelectedLi[2].innerText).toBe('10');
      testComponent.timePickerPanelComponent.selectHour({ index: 0, disabled: false });
      testComponent.timePickerPanelComponent.selectMinute({ index: 1, disabled: false });
      testComponent.timePickerPanelComponent.selectSecond({ index: 2, disabled: false });
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      flush();
      listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('00');
      expect(listOfSelectedLi[1].innerText).toBe('01');
      expect(listOfSelectedLi[2].innerText).toBe('02');
    }));

    it('should step work', () => {
      fixture.detectChanges();
      let listOfSelectContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listOfSelectContainer[0].children.length).toEqual(24);
      expect(listOfSelectContainer[1].children.length).toEqual(60);
      expect(listOfSelectContainer[2].children.length).toEqual(60);
      testComponent.hourStep = 2;
      testComponent.minuteStep = 15;
      testComponent.secondStep = 10;
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

    it('should offsetTop is right', fakeAsync(() => {
      testComponent.value = new Date(0, 0, 0, 0, 0, 0);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const listOfSelectedLi = panelElement.nativeElement.querySelector('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi.offsetTop).toBe(0);
    }));

    describe('change detection behavior', () => {
      it('should not run change detection when the timer picker panel is clicked', () => {
        const appRef = TestBed.inject(ApplicationRef);
        const event = new MouseEvent('mousedown');

        spyOn(appRef, 'tick');
        spyOn(event, 'preventDefault').and.callThrough();

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

    it('should disabled work', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      flush();
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
      testComponent.hideDisabledOptions = true;
      fixture.detectChanges();
      expect(listOfSelectContainer[0].children.length).toBe(21);
      expect(listOfSelectContainer[2].children.length).toBe(54);
    }));

    it('should now disabled work', fakeAsync(() => {
      // disable every hour
      testComponent.disabledHours = () => [...Array(24).keys()];
      fixture.detectChanges();
      flush();
      dispatchFakeEvent(panelElement.nativeElement.querySelector('.ant-picker-now > a'), 'click');
      fixture.detectChanges();
      const listOfSelectContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(
        listOfSelectContainer[0].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toBe('10');
      expect(
        listOfSelectContainer[1].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toBe('11');
      expect(
        listOfSelectContainer[2].querySelector('.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner')
          .textContent
      ).toBe('12');
    }));
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

    it('basic 12-hour time-picker-panel', fakeAsync(() => {
      fixture12Hour.detectChanges();
      expect(testComponent.timePickerPanelComponent.enabledColumns).toBe(4);
      const listColumns: HTMLElement[] = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listColumns[0].querySelectorAll('li')[0].innerText).toBe('12');
      const hour12labels = listColumns[3].querySelectorAll('li');
      expect(hour12labels[0].innerText).toBe('am');
      expect(hour12labels[1].innerText).toBe('pm');
    }));

    it('default value 12-hour time-picker-panel', fakeAsync(() => {
      fixture12Hour.detectChanges();
      tick(1000);
      fixture12Hour.detectChanges();
      const listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('12');
      expect(listOfSelectedLi[1].innerText).toBe('00');
      expect(listOfSelectedLi[2].innerText).toBe('00');
      expect(listOfSelectedLi[3].innerText).toBe('am');
    }));

    it('should scroll work in 12-hour', fakeAsync(() => {
      fixture12Hour.componentInstance.openValue = new Date(0, 0, 0, 5, 6, 7);
      fixture12Hour.componentInstance.timePickerPanelComponent.select12Hours({ index: 1, value: 'pm' });
      fixture12Hour.detectChanges();
      tick(1000);
      fixture12Hour.detectChanges();
      let listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('05');
      expect(listOfSelectedLi[1].innerText).toBe('06');
      expect(listOfSelectedLi[2].innerText).toBe('07');
      expect(listOfSelectedLi[3].innerText).toBe('pm');
      fixture12Hour.componentInstance.value = new Date(0, 0, 0, 6, 7, 8);
      fixture12Hour.detectChanges();
      tick(1000);
      fixture12Hour.detectChanges();
      listOfSelectedLi = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-cell-selected');
      expect(listOfSelectedLi[0].innerText).toBe('06');
      expect(listOfSelectedLi[1].innerText).toBe('07');
      expect(listOfSelectedLi[2].innerText).toBe('08');
    }));

    it('select hour and 12-hour in 12-hour-time-picker-panel', fakeAsync(() => {
      fixture12Hour.detectChanges();
      testComponent.timePickerPanelComponent.selectHour({ index: 3, disabled: false });
      testComponent.timePickerPanelComponent.select12Hours({ index: 1, value: 'pm' });
      fixture12Hour.detectChanges();
      flush();
      fixture12Hour.detectChanges();
      expect(testComponent.value!.getHours()).toBe(15);
      testComponent.timePickerPanelComponent.select12Hours({ index: 0, value: 'am' });
      fixture12Hour.detectChanges();
      flush();
      fixture12Hour.detectChanges();
      expect(testComponent.value!.getHours()).toBe(3);
    }));

    it('hour step in 12-hour-time-picker-panel', fakeAsync(() => {
      testComponent.hourStep = 2;
      fixture12Hour.detectChanges();
      const listOfHourContainer = panelElement.nativeElement.querySelectorAll('.ant-picker-time-panel-column');
      expect(listOfHourContainer[0].children.length).toEqual(6);
    }));
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

    it('format in 12-hour-time-pick-panel', fakeAsync(() => {
      testComponent.format = 'hh:mm:ss A';
      fixture12Hour.detectChanges();
      const list12HourLi = panelElement.nativeElement
        .querySelectorAll('.ant-picker-time-panel-column')[3]
        .querySelectorAll('li');
      expect(list12HourLi[0].innerText).toBe('AM');
      expect(list12HourLi[1].innerText).toBe('PM');
    }));

    it('disabled hour in 12-hour-time-picker-panel', fakeAsync(() => {
      fixture12Hour.detectChanges();
      flush();
      testComponent.disabledHours = (): number[] => [0, 3, 4, 5, 12, 18, 19, 20, 24];
      fixture12Hour.detectChanges();
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

      fixture12Hour.detectChanges();
      tick(500);
      flush();
      listHourLi = panelElement.nativeElement
        .querySelectorAll('.ant-picker-time-panel-column')[3]
        .querySelectorAll('li');

      expect(listHourLi.length).not.toBe(0);
    }));
  });
});

@Component({
  imports: [TriTimePickerPanelComponent, FormsModule],
  template: `
    <tri-time-picker-panel
      [(ngModel)]="value"
      [format]="format"
      [defaultOpenValue]="openValue"
      [secondStep]="secondStep"
      [minuteStep]="minuteStep"
      [hourStep]="hourStep"
    ></tri-time-picker-panel>
  `
})
export class TriTestTimePanelComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  secondStep = 1;
  minuteStep = 1;
  hourStep = 1;
  value?: Date;
  openValue = new Date(0, 0, 0, 10, 11, 12);
  format: string = 'HH:mm:ss';
}

@Component({
  imports: [TriTimePickerPanelComponent, FormsModule],
  template: `
    <tri-time-picker-panel
      [(ngModel)]="value"
      [format]="format"
      [disabledHours]="disabledHours"
      [disabledMinutes]="disabledMinutes"
      [disabledSeconds]="disabledSeconds"
      [defaultOpenValue]="openValue"
      [secondStep]="secondStep"
      [minuteStep]="minuteStep"
      [inDatePicker]="inDatePicker"
      [hideDisabledOptions]="hideDisabledOptions"
      [hourStep]="hourStep"
    ></tri-time-picker-panel>
  `
})
export class TriTestTimePanelDisabledComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  inDatePicker = false;
  secondStep = 1;
  minuteStep = 1;
  hourStep = 1;
  hideDisabledOptions = false;
  value = new Date(0, 0, 0, 0, 0, 0);
  openValue = new Date(0, 0, 0, 10, 11, 12);
  format = 'HH:mm:ss';

  disabledHours(): number[] {
    return [1, 2, 3];
  }

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
      [defaultOpenValue]="openValue"
      [hourStep]="hourStep"
      [format]="format"
    ></tri-time-picker-panel>
  `
})
export class TriTest12HourTimePanelComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  format = 'hh:mm:ss a';
  hourStep = 1;
  value?: Date;
  openValue = new Date(0, 0, 0, 0, 0, 0);
}

@Component({
  imports: [TriTimePickerPanelComponent, FormsModule],
  template: `
    <tri-time-picker-panel
      [format]="format"
      [(ngModel)]="value"
      [use12Hours]="true"
      [disabledHours]="disabledHours"
      [disabledMinutes]="disabledMinutes"
      [disabledSeconds]="disabledSeconds"
      [hideDisabledOptions]="false"
    ></tri-time-picker-panel>
  `
})
export class TriTest12HourTimePanelDisabledComponent {
  @ViewChild(TriTimePickerPanelComponent, { static: false }) timePickerPanelComponent!: TriTimePickerPanelComponent;
  format = 'hh:mm:ss a';
  value = new Date(0, 0, 0, 1, 1, 1);

  disabledHours = (): number[] => [];

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
