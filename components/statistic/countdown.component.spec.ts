/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { TriStatisticValueType } from 'ng-zorro-antd/statistic/typings';

import { TriCountdownComponent } from './countdown.component';
import { TriStatisticModule } from './statistic.module';

describe('nz-countdown', () => {
  let fixture: ComponentFixture<TriTestCountdownComponent>;
  let testComponent: TriTestCountdownComponent;
  let countdownEl: DebugElement;
  const now = new Date('2026-01-01T00:00:00.000Z');

  describe('basic', () => {
    beforeEach(() => vi.useFakeTimers());

    beforeEach(() => {
      vi.setSystemTime(now);
      fixture = TestBed.createComponent(TriTestCountdownComponent);
      testComponent = fixture.componentInstance;
      countdownEl = fixture.debugElement.query(By.directive(TriCountdownComponent));
    });

    afterEach(() => vi.useRealTimers());

    it('should render time', () => {
      testComponent.resetTimerWithFormat('HH:mm:ss');
      fixture.detectChanges();
      vi.advanceTimersByTime(100);
      fixture.detectChanges();
      expect(countdownEl.nativeElement.querySelector('.ant-statistic-content-value').innerText).toBe('48:00:29');
      testComponent.countdown.stopTimer();
    });

    it('should stop timer when nzValue is earlier than current', () => {
      const beforeTime = now.getTime() - 1000 * 1000;
      const spyOnStop = vi.spyOn(testComponent.countdown, 'stopTimer');
      testComponent.value.set(beforeTime);

      fixture.detectChanges();
      vi.advanceTimersByTime(100);
      fixture.detectChanges();
      expect(countdownEl.nativeElement.querySelector('.ant-statistic-content-value').innerText).toBe('00:00:00');
      expect(spyOnStop).toHaveBeenCalledTimes(1);
    });

    it('should support template', () => {
      testComponent.resetWithTemplate();
      fixture.detectChanges();
      vi.advanceTimersByTime(100);
      fixture.detectChanges();

      const value = Number(countdownEl.nativeElement.querySelector('.ant-statistic-content-value').innerText);
      expect(value).toBeGreaterThanOrEqual(172829900);
      expect(value).toBeLessThanOrEqual(172829901);
      testComponent.countdown.stopTimer();
    });

    it('should stop timer and emit event', () => {
      testComponent.value.set(now.getTime() + 1000 * 2);
      fixture.detectChanges();
      vi.advanceTimersByTime(3000);
      fixture.detectChanges();
      expect(testComponent.finished).toBe(1);
    });
  });
});

@Component({
  imports: [TriStatisticModule],
  template: `
    <tri-countdown
      title="Countdown"
      [value]="value()"
      [format]="format()"
      [valueTemplate]="template()"
      (countdownFinish)="onFinish()"
    />
    <ng-template #tpl let-diff>
      {{ diff }}
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestCountdownComponent {
  @ViewChild(TriCountdownComponent, { static: true }) countdown!: TriCountdownComponent;
  @ViewChild('tpl', { static: true }) tpl!: TemplateRef<{ $implicit: TriStatisticValueType }>;

  readonly format = signal('HH:mm:ss');
  readonly value = signal<number | undefined>(undefined);
  readonly template = signal<TemplateRef<{ $implicit: TriStatisticValueType }> | undefined>(undefined);
  finished = 0;

  resetTimerWithFormat(format: string): void {
    this.format.set(format);
    this.value.set(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30);
  }

  resetWithTemplate(): void {
    this.template.set(this.tpl);
    this.value.set(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30);
  }

  onFinish(): void {
    this.finished += 1;
  }
}
