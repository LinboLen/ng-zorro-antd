/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { testDirectionality } from 'ng-zorro-antd/core/testing';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriStatisticComponent } from './statistic.component';
import { TriStatisticModule } from './statistic.module';

describe('statistic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
  });

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

      testComponent.prefix.set('prefix');
      testComponent.suffix.set('suffix');
      fixture.detectChanges();
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-content-prefix').innerText).toBe('prefix');
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-content-suffix').innerText).toBe('suffix');
    });

    it('should render skeleton', () => {
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-skeleton')).toBeFalsy();
      testComponent.loading.set(true);
      fixture.detectChanges();
      expect(statisticEl.nativeElement.querySelector('.ant-statistic-skeleton')).toBeTruthy();
    });
  });

  testDirectionality(() => TriTestStatisticComponent, By.directive(TriStatisticComponent), 'ant-statistic');
});

@Component({
  imports: [TriStatisticModule],
  template: `
    <tri-statistic
      [value]="123.45"
      [title]="title()"
      [suffix]="suffix()"
      [prefix]="prefix()"
      [loading]="loading()"
    />
  `
})
export class TriTestStatisticComponent {
  readonly title = signal('title');
  readonly prefix = signal('');
  readonly suffix = signal('');
  readonly loading = signal(false);
}
