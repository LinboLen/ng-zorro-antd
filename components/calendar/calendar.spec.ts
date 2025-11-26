/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { CandyDate } from 'ng-zorro-antd/core/time';
import { TRI_DATE_CONFIG } from 'ng-zorro-antd/i18n/date-config';

import { TriCalendarHeaderComponent as CalendarHeader } from './calendar-header.component';
import { TriCalendarComponent as Calendar, TriCalendarMode } from './calendar.component';
import { TriCalendarModule } from './calendar.module';

registerLocaleData(zh);

describe('calendar', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [
        provideZoneChangeDetection(),
        provideNoopAnimations(),
        { provide: TRI_DATE_CONFIG, useValue: { firstDayOfWeek: 0 } }
      ]
    });
  });

  describe('mode', () => {
    let fixture: ComponentFixture<TriTestCalendarModeComponent>;
    let component: TriTestCalendarModeComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarModeComponent);
      component = fixture.componentInstance;
    });

    it('should be month by default', () => {
      fixture.detectChanges();

      const header = fixture.debugElement
        .queryAll(By.directive(Calendar))[0]
        .query(By.directive(CalendarHeader))
        .injector.get(CalendarHeader);
      expect(header.mode).toBe('month');
    });

    it('should update mode passed in', () => {
      component.mode = 'year';

      fixture.detectChanges();

      const header = fixture.debugElement
        .queryAll(By.directive(Calendar))[1]
        .query(By.directive(CalendarHeader))
        .injector.get(CalendarHeader);
      expect(header.mode).toBe('year');
    });

    it('should emit change event for mode selection', () => {
      const header = fixture.debugElement
        .queryAll(By.directive(Calendar))[1]
        .query(By.directive(CalendarHeader))
        .injector.get(CalendarHeader);
      header.modeChange.emit('year');

      fixture.detectChanges();

      expect(component.mode).toBe('year');
    });

    it('should display date grid in month mode', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const table = host.query(By.css('.ant-picker-date-panel'));

      expect(table.nativeElement).toBeTruthy();
    });

    it('should display date grid in year mode', () => {
      component.mode = 'year';
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const table = host.query(By.css('.ant-picker-month-panel'));

      expect(table.nativeElement).toBeTruthy();
    });
  });

  describe('value', () => {
    let fixture: ComponentFixture<TriTestCalendarValueComponent>;
    let component: TriTestCalendarValueComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarValueComponent);
      component = fixture.componentInstance;
    });

    it('should be now by default', () => {
      fixture.detectChanges();
      const now = new Date();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[0];
      const header = host.query(By.directive(CalendarHeader)).injector.get(CalendarHeader);

      expect(header.activeDate.getYear()).toBe(now.getFullYear());
      expect(header.activeDate.getMonth()).toBe(now.getMonth());
      expect(header.activeDate.getDate()).toBe(now.getDate());
    });

    it('should support two-way binding without model', () => {
      fixture.detectChanges();
      const now = new Date();

      const calendar = fixture.debugElement.queryAll(By.directive(Calendar))[1].injector.get(Calendar);

      expect(calendar.activeDate.nativeDate).toBe(component.date0);

      calendar.onDateSelect(new CandyDate(now));
      fixture.detectChanges();

      expect(component.date0).toBe(now);
    });

    it('should support model binding', fakeAsync(() => {
      fixture.detectChanges();
      const now = new Date();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[2];
      const calendar = host.injector.get(Calendar);
      const model = host.injector.get(NgModel);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(calendar.activeDate.nativeDate).toBe(component.date1);

      model.viewToModelUpdate(now);
      fixture.detectChanges();

      expect(component.date1).toBe(now);
    }));

    it('should update value when year changed', () => {
      fixture.detectChanges();
      const calendar = fixture.debugElement.queryAll(By.directive(Calendar))[1].injector.get(Calendar);
      calendar.onYearSelect(2010);
      fixture.detectChanges();

      expect(component.date0.getFullYear()).toBe(2010);
    });

    it('should update value when month changed', () => {
      fixture.detectChanges();
      const calendar = fixture.debugElement.queryAll(By.directive(Calendar))[1].injector.get(Calendar);
      calendar.onMonthSelect(10);
      fixture.detectChanges();

      expect(component.date0.getMonth()).toBe(10);
    });

    it('should mark current date in month mode', () => {
      const now = new Date();

      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[0];
      const today = host.query(By.css('td.ant-picker-cell-today .ant-picker-calendar-date-value'));

      expect(today).toBeDefined();
      expect(parseInt(today.nativeElement.textContent!, 10)).toBe(now.getDate());
    });

    it('should mark active date in month mode', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const active = host.query(By.css('td.ant-picker-cell-selected .ant-picker-calendar-date-value'));

      expect(active).toBeDefined();
      expect(parseInt(active.nativeElement.textContent!, 10)).toBe(3);
    });

    it('should mark previous/next month date in month mode', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const cells = host.queryAll(By.css('td'));
      const lastPrevious = cells[3];
      const firstNext = cells[32];

      expect(lastPrevious.nativeElement.className).not.toContain('ant-picker-cell-in-view');
      expect(firstNext.nativeElement.className).not.toContain('ant-picker-cell-in-view');
    });

    it('should mark current month in year mode', () => {
      const now = new Date();
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[3];
      const cells = host.queryAll(By.css('td'));
      const current = cells[now.getMonth()];

      expect(current.nativeElement.className).toContain('ant-picker-cell-selected');
    });

    it('should mark active month in year mode', () => {
      component.date2.setDate(1);
      component.date2.setMonth(10);
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[3];
      const cells = host.queryAll(By.css('td'));
      const current = cells[10];

      expect(current.nativeElement.className).toContain('ant-picker-cell-selected');
    });
  });

  describe('fullscreen', () => {
    let fixture: ComponentFixture<TriTestCalendarFullscreenComponent>;
    let component: TriTestCalendarFullscreenComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarFullscreenComponent);
      component = fixture.componentInstance;
    });

    it('should be true by default', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[0];
      const header = host.query(By.directive(CalendarHeader)).injector.get(CalendarHeader);

      expect(header.fullscreen).toBe(true);
    });

    it('should update fullscreen by nzFullscreen', () => {
      component.fullscreen = false;

      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const header = host.query(By.directive(CalendarHeader)).injector.get(CalendarHeader);

      expect(header.fullscreen).toBe(false);
    });

    it('should support imperative access', () => {
      component.fullscreen = false;

      fixture.detectChanges();

      const calendar = fixture.debugElement.queryAll(By.directive(Calendar))[1].injector.get(Calendar);

      expect(calendar.fullscreen).toBe(false);
    });
  });

  describe('dateCell', () => {
    let fixture: ComponentFixture<TriTestCalendarDateCellComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarDateCellComponent);
    });

    it('should work when passed via property', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[0];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-calendar-date-content'));

      expect(content.nativeElement.textContent).toContain('Foo');
    });

    it('should work when passed via content child', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-calendar-date-content'));

      expect(content.nativeElement.textContent).toContain('Bar');
    });
  });

  describe('dateFullCell', () => {
    let fixture: ComponentFixture<TriTestCalendarDateFullCellComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarDateFullCellComponent);
    });

    it('should work when passed via property', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[0];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-cell-inner'));
      expect(content.nativeElement.textContent!.trim()).toBe('Foo');
    });

    it('should work when passed via content child', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-cell-inner'));

      expect(content.nativeElement.textContent!.trim()).toBe('Bar');
    });
  });

  describe('monthCell', () => {
    let fixture: ComponentFixture<TriTestCalendarMonthCellComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarMonthCellComponent);
    });

    it('should work when passed via property', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[0];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-calendar-date-content'));
      expect(content.nativeElement.textContent).toContain('Foo');
    });

    it('should work when passed via content child', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-calendar-date-content'));
      expect(content.nativeElement.textContent).toContain('Bar');
    });
  });

  describe('monthFullCell', () => {
    let fixture: ComponentFixture<TriTestCalendarMonthFullCellComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarMonthFullCellComponent);
    });

    it('should work when passed via property', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[0];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-cell-inner'));
      expect(content.nativeElement.textContent!.trim()).toBe('Foo');
    });

    it('should work when passed via content child', () => {
      fixture.detectChanges();

      const host = fixture.debugElement.queryAll(By.directive(Calendar))[1];
      const content = host.query(By.css('td')).query(By.css('.ant-picker-cell-inner'));
      expect(content.nativeElement.textContent!.trim()).toBe('Bar');
    });
  });

  describe('changes', () => {
    let fixture: ComponentFixture<TriTestCalendarChangesComponent>;
    let component: TriTestCalendarChangesComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarChangesComponent);
      component = fixture.componentInstance;
    });

    it('should panelChange work', () => {
      fixture.detectChanges();

      expect(component.panelChange).toHaveBeenCalledTimes(0);

      const calendar = fixture.debugElement.queryAll(By.directive(Calendar))[0].injector.get(Calendar);
      calendar.onModeChange('year');
      fixture.detectChanges();

      expect(component.panelChange).toHaveBeenCalledTimes(1);
    });

    it('should selectChange work', () => {
      fixture.detectChanges();

      expect(component.panelChange).toHaveBeenCalledTimes(0);

      const calendar = fixture.debugElement.queryAll(By.directive(Calendar))[0].injector.get(Calendar);
      calendar.onYearSelect(2019);
      fixture.detectChanges();

      expect(component.selectChange).toHaveBeenCalledTimes(1);

      calendar.onMonthSelect(2);
      fixture.detectChanges();

      expect(component.selectChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestCalendarRtlComponent>;
    let componentElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCalendarRtlComponent);
      componentElement = fixture.debugElement.query(By.directive(Calendar)).nativeElement;
      fixture.detectChanges();
    });

    it('should className correct on dir change', () => {
      expect(componentElement.classList).toContain('ant-picker-calendar-rtl');
      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(componentElement.classList).not.toContain('ant-picker-calendar-rtl');
    });
  });
});

@Component({
  imports: [TriCalendarModule],
  template: `
    <tri-calendar></tri-calendar>
    <tri-calendar [(modeChange)]="mode"></tri-calendar>
  `
})
class TriTestCalendarModeComponent {
  mode: 'month' | 'year' = 'month';
}

@Component({
  imports: [FormsModule, TriCalendarModule],
  template: `
    <tri-calendar></tri-calendar>
    <tri-calendar [(valueChange)]="date0"></tri-calendar>
    <tri-calendar [(ngModel)]="date1"></tri-calendar>
    <tri-calendar [(valueChange)]="date2" [(modeChange)]="mode"></tri-calendar>
  `
})
class TriTestCalendarValueComponent {
  date0 = new Date(2001, 1, 3);
  date1 = new Date(2001, 1, 3);
  date2 = new Date();
  mode: TriCalendarMode = 'year';
}

@Component({
  imports: [TriCalendarModule],
  template: `
    <tri-calendar></tri-calendar>
    <tri-calendar [fullscreen]="fullscreen"></tri-calendar>
  `
})
class TriTestCalendarFullscreenComponent {
  fullscreen = true;
  card = false;
}

@Component({
  imports: [TriCalendarModule],
  template: `
    <tri-calendar [dateCell]="tpl"></tri-calendar>
    <ng-template #tpl>Foo</ng-template>
    <tri-calendar>
      <ng-container *dateCell>Bar</ng-container>
    </tri-calendar>
  `
})
class TriTestCalendarDateCellComponent {}

@Component({
  imports: [TriCalendarModule],
  template: `
    <tri-calendar [dateFullCell]="tpl"></tri-calendar>
    <ng-template #tpl>Foo</ng-template>
    <tri-calendar>
      <ng-container *dateFullCell>Bar</ng-container>
    </tri-calendar>
  `
})
class TriTestCalendarDateFullCellComponent {}

@Component({
  imports: [TriCalendarModule],
  template: `
    <tri-calendar mode="year" [monthCell]="tpl"></tri-calendar>
    <ng-template #tpl>Foo</ng-template>
    <tri-calendar mode="year">
      <ng-container *monthCell>Bar</ng-container>
    </tri-calendar>
  `
})
class TriTestCalendarMonthCellComponent {}

@Component({
  imports: [TriCalendarModule],
  template: `
    <tri-calendar mode="year" [monthFullCell]="tpl"></tri-calendar>
    <ng-template #tpl>Foo</ng-template>
    <tri-calendar mode="year">
      <ng-container *monthFullCell>Bar</ng-container>
    </tri-calendar>
  `
})
class TriTestCalendarMonthFullCellComponent {}

@Component({
  imports: [FormsModule, TriCalendarModule],
  template: `
    <tri-calendar
      [(modeChange)]="mode"
      [(ngModel)]="date0"
      (panelChange)="panelChange($event)"
      (selectChange)="selectChange($event)"
    ></tri-calendar>
  `
})
class TriTestCalendarChangesComponent {
  mode: 'month' | 'year' = 'month';
  date0 = new Date(2014, 3, 14);
  panelChange = jasmine.createSpy('panelChange callback');
  selectChange = jasmine.createSpy('selectChange callback');
}

@Component({
  imports: [BidiModule, TriCalendarModule],
  template: `
    <div [dir]="direction">
      <tri-calendar></tri-calendar>
    </div>
  `
})
export class TriTestCalendarRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
