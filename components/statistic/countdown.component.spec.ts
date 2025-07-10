/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriStatisticValueType } from 'ng-zorro-antd/statistic/typings';

import { TriCountdownComponent } from './countdown.component';
import { TriStatisticModule } from './statistic.module';

describe('nz-countdown', () => {
  let fixture: ComponentFixture<TriTestCountdownComponent>;
  let testComponent: TriTestCountdownComponent;
  let countdownEl: DebugElement;

  describe('basic', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCountdownComponent);
      testComponent = fixture.componentInstance;
      countdownEl = fixture.debugElement.query(By.directive(TriCountdownComponent));
    });

    it('should render time', fakeAsync(() => {
      testComponent.resetTimerWithFormat('HH:mm:ss');
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      expect(countdownEl.nativeElement.querySelector('.ant-statistic-content-value').innerText).toBe('48:00:29');
      testComponent.countdown.stopTimer();
    }));

    it('should stop timer when nzValue is earlier than current', fakeAsync(() => {
      const beforeTime = new Date().getTime() - 1000 * 1000;
      const spyOnStop = spyOn(testComponent.countdown, 'stopTimer');
      testComponent.value = beforeTime;

      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      expect(countdownEl.nativeElement.querySelector('.ant-statistic-content-value').innerText).toBe('00:00:00');
      expect(spyOnStop).toHaveBeenCalledTimes(1);
    }));

    it('should support template', fakeAsync(() => {
      testComponent.resetWithTemplate();
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();

      expect(countdownEl.nativeElement.querySelector('.ant-statistic-content-value').innerText).toBe('172829900');
      testComponent.countdown.stopTimer();
    }));

    it('should stop timer and emit event', fakeAsync(() => {
      testComponent.value = new Date().getTime() + 1000 * 2;
      fixture.detectChanges();
      tick(3000);
      fixture.detectChanges();
      expect(testComponent.finished).toBe(1);
    }));
  });
});

@Component({
  imports: [TriStatisticModule],
  template: `
    <tri-countdown
      [title]="'Countdown'"
      [value]="value"
      [format]="format"
      [valueTemplate]="template"
      (countdownFinish)="onFinish()"
    ></tri-countdown>
    <ng-template #tpl let-diff>
      {{ diff }}
    </ng-template>
  `
})
export class TriTestCountdownComponent {
  @ViewChild(TriCountdownComponent, { static: true }) countdown!: TriCountdownComponent;
  @ViewChild('tpl', { static: true }) tpl!: TemplateRef<{ $implicit: TriStatisticValueType }>;

  format!: string;
  value?: number;
  template?: TemplateRef<{ $implicit: TriStatisticValueType }>;
  finished = 0;

  resetTimerWithFormat(format: string): void {
    this.format = format;
    this.value = new Date().getTime() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
  }

  resetWithTemplate(): void {
    this.template = this.tpl;
    this.value = new Date().getTime() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
  }

  onFinish(): void {
    this.finished += 1;
  }
}
