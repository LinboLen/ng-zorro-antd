/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { CandyDate } from 'ng-zorro-antd/core/time';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriCalendarHeaderComponent, TriCalendarHeaderComponent as CalendarHeader } from './calendar-header.component';
import { TriRadioGroupComponent as RadioGroup } from '../radio/index';
import { TriSelectComponent as Select } from '../select/select.component';

registerLocaleData(zh);

describe('Calendar Header', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
  }));

  describe('mode', () => {
    let fixture: ComponentFixture<TriTestCalendarHeaderModeComponent>;
    let component: TriTestCalendarHeaderModeComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(TriTestCalendarHeaderModeComponent);
      component = fixture.componentInstance;
    }));

    it('should be month by default', () => {
      fixture.detectChanges();

      const modeNgModel = fixture.debugElement
        .queryAll(By.directive(CalendarHeader))[0]
        .query(By.directive(RadioGroup))
        .injector.get(NgModel);
      expect(modeNgModel.model).toBe('month');
    });

    it('should update mode passed in', () => {
      component.mode = 'year';

      fixture.detectChanges();

      const modeNgModel = fixture.debugElement
        .queryAll(By.directive(CalendarHeader))[1]
        .query(By.directive(RadioGroup))
        .injector.get(NgModel);
      expect(modeNgModel.model).toBe('year');
    });

    it('should emit change event for mode selection', () => {
      fixture.detectChanges();

      const modeNgModel = fixture.debugElement
        .queryAll(By.directive(CalendarHeader))[1]
        .query(By.directive(RadioGroup))
        .injector.get(NgModel);
      modeNgModel.viewToModelUpdate('year');

      fixture.detectChanges();

      expect(component.mode).toBe('year');
    });
  });

  describe('fullscreen', () => {
    let fixture: ComponentFixture<TriTestCalendarHeaderFullscreenComponent>;
    let component: TriTestCalendarHeaderFullscreenComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(TriTestCalendarHeaderFullscreenComponent);
      component = fixture.componentInstance;
    }));

    it('should be true by default', () => {
      fixture.detectChanges();

      const header = fixture.debugElement.queryAll(By.directive(CalendarHeader))[0];
      const [yearSelect, monthSelect] = header.queryAll(By.directive(Select)).map(x => x.injector.get(Select));
      const modeRadioGroup = header.query(By.directive(RadioGroup)).injector.get(RadioGroup);

      expect(yearSelect.size).not.toBe('small');
      expect(monthSelect.size).not.toBe('small');
      expect(modeRadioGroup.size).not.toBe('small');
    });

    it('should use small size when not in fullscreen', () => {
      component.fullscreen = false;

      fixture.detectChanges();

      const header = fixture.debugElement.queryAll(By.directive(CalendarHeader))[1];
      const [yearSelect, monthSelect] = header.queryAll(By.directive(Select)).map(x => x.injector.get(Select));
      const modeRadioGroup = header.query(By.directive(RadioGroup)).injector.get(RadioGroup);

      expect(yearSelect.size).toBe('small');
      expect(monthSelect.size).toBe('small');
      expect(modeRadioGroup.size).toBe('small');
    });
  });

  describe('activeDate', () => {
    let fixture: ComponentFixture<TriTestCalendarHeaderActiveDateComponent>;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(TriTestCalendarHeaderActiveDateComponent);
    }));

    it('should be now by default', () => {
      const now = new Date();

      fixture.detectChanges();

      const header = fixture.debugElement.queryAll(By.directive(CalendarHeader))[0];
      const [yearModel, monthModel] = header.queryAll(By.directive(Select)).map(x => x.injector.get(NgModel));

      expect(yearModel.model).toBe(now.getFullYear());
      expect(monthModel.model).toBe(now.getMonth());
    });

    it('should update model binding to passed date', () => {
      fixture.detectChanges();

      const header = fixture.debugElement.queryAll(By.directive(CalendarHeader))[1];
      const [yearModel, monthModel] = header.queryAll(By.directive(Select)).map(x => x.injector.get(NgModel));

      expect(yearModel.model).toBe(2001);
      expect(monthModel.model).toBe(1);
      const headerComponent = header.injector.get(TriCalendarHeaderComponent);
      expect(headerComponent.years[0].value).toBe(1991);
    });
  });

  describe('changes', () => {
    let fixture: ComponentFixture<TriTestCalendarHeaderChangesComponent>;
    let component: TriTestCalendarHeaderChangesComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(TriTestCalendarHeaderChangesComponent);
      component = fixture.componentInstance;
    }));

    it('should emit yearChange when year changed', fakeAsync(() => {
      tick(1);
      fixture.detectChanges();

      const header = fixture.debugElement.queryAll(By.directive(CalendarHeader))[0];
      const [yearModel] = header.queryAll(By.directive(Select)).map(x => x.injector.get(NgModel));

      yearModel.viewToModelUpdate(2010);

      fixture.detectChanges();

      expect(component.year).toBe(2010);
    }));

    it('should emit monthChange when month changed', () => {
      fixture.detectChanges();
      const header = fixture.debugElement.queryAll(By.directive(CalendarHeader))[0];
      const monthModel = header.queryAll(By.directive(Select)).map(x => x.injector.get(NgModel))[1];

      monthModel.viewToModelUpdate(2);

      fixture.detectChanges();

      expect(component.month).toBe(2);
    });

    it('should update years when change year', () => {
      const header = fixture.debugElement.queryAll(By.directive(CalendarHeader))[0];
      const headerComponent = header.injector.get(TriCalendarHeaderComponent);
      headerComponent.updateYear(2010);
      expect(headerComponent.years[0].value).toBe(2000);
    });
  });

  describe('custom Header', () => {
    let fixture: ComponentFixture<TriTestCalendarHeaderChangesComponent>;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(TriTestCalendarHeaderChangesComponent);
    }));

    it('should have the default header if custom header is not passed', fakeAsync(() => {
      fixture.componentInstance.customHeader = undefined;
      tick(1);
      fixture.detectChanges();

      const defaultHeader = fixture.debugElement.query(By.css('.ant-picker-calendar-header'));
      expect(defaultHeader).toBeTruthy();

      fixture.componentInstance.customHeader = fixture.componentInstance.customHeaderElement;
      tick(1);
      fixture.detectChanges();

      const defaultHeader2 = fixture.debugElement.query(By.css('.ant-picker-calendar-header'));
      expect(defaultHeader2).toBeFalsy();
    }));
  });
});

@Component({
  imports: [FormsModule, TriCalendarHeaderComponent],
  template: `
    <tri-calendar-header></tri-calendar-header>
    <tri-calendar-header [(mode)]="mode"></tri-calendar-header>
  `
})
class TriTestCalendarHeaderModeComponent {
  mode: 'month' | 'year' = 'month';
}

@Component({
  imports: [TriCalendarHeaderComponent],
  template: `
    <tri-calendar-header></tri-calendar-header>
    <tri-calendar-header [fullscreen]="fullscreen"></tri-calendar-header>
  `
})
class TriTestCalendarHeaderFullscreenComponent {
  fullscreen = true;
}

@Component({
  imports: [TriCalendarHeaderComponent],
  template: `
    <tri-calendar-header></tri-calendar-header>
    <tri-calendar-header [activeDate]="activeDate"></tri-calendar-header>
  `
})
class TriTestCalendarHeaderActiveDateComponent {
  activeDate = new CandyDate(new Date(2001, 1, 3));
}

@Component({
  imports: [TriCalendarHeaderComponent],
  template: `
    <tri-calendar-header
      [customHeader]="customHeader"
      (yearChange)="year = $event"
      (monthChange)="month = $event"
    ></tri-calendar-header>

    <ng-template #customHeaderElement>
      <p>custom header</p>
    </ng-template>
  `
})
class TriTestCalendarHeaderChangesComponent {
  @ViewChild('customHeaderElement', { static: true }) customHeaderElement!: TemplateRef<TriSafeAny>;

  year: number | null = null;
  month: number | null = null;
  customHeader?: TemplateRef<void>;
}
