/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriStatisticComponent } from './statistic.component';
import { TriStatisticModule } from './statistic.module';

describe('nz-statistic', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<TriTestStatisticComponent>;
    let testComponent: TriTestStatisticComponent;
    let statisticEl: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestStatisticComponent);
      testComponent = fixture.componentInstance;
      statisticEl = fixture.debugElement.query(By.directive(TriStatisticComponent));
    });

    it('should render title, prefix and suffix', () => {
      fixture.detectChanges();
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-title').innerText).toBe('title');
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-content-prefix')).toBeFalsy();
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-content-suffix')).toBeFalsy();

      testComponent.prefix = 'prefix';
      testComponent.suffix = 'suffix';
      fixture.detectChanges();
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-content-prefix').innerText).toBe('prefix');
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-content-suffix').innerText).toBe('suffix');
    });

    it('should render skeleton', () => {
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-skeleton')).toBeFalsy();
      testComponent.loading = true;
      fixture.detectChanges();
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-skeleton')).toBeTruthy();
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestStatisticRtlComponent>;
    let statisticEl: DebugElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestStatisticRtlComponent);
      statisticEl = fixture.debugElement.query(By.directive(TriStatisticComponent));
    });

    it('should className correct on dir change', () => {
      fixture.detectChanges();
      expect(statisticEl.nativeElement.classList).toContain('ant-statistic-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(statisticEl.nativeElement.classList).not.toContain('ant-statistic-rtl');
    });
  });
});

@Component({
  imports: [TriStatisticModule],
  template: `
    <tri-statistic
      [value]="123.45"
      [title]="title"
      [suffix]="suffix"
      [prefix]="prefix"
      [loading]="loading"
    ></tri-statistic>
  `
})
export class TriTestStatisticComponent {
  title = 'title';
  prefix = '';
  suffix = '';
  loading = false;
}

@Component({
  imports: [BidiModule, TriStatisticModule],
  template: `
    <div [dir]="direction">
      <tri-statistic [value]="123.45" title="test title"></tri-statistic>
    </div>
  `
})
export class TriTestStatisticRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
