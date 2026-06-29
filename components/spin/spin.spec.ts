/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { TriConfigService } from 'ng-zorro-antd/core/config';
import { testDirectionality } from 'ng-zorro-antd/core/testing';
import { TriSafeAny, TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriSpinComponent } from './spin.component';
import { TriSpinModule } from './spin.module';

describe('spin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriTestSpinBasicComponent>;
    let testComponent: TriTestSpinBasicComponent;
    let spin: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestSpinBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      spin = fixture.debugElement.query(By.directive(TriSpinComponent));
    });

    it('should className correct', () => {
      expect(spin.nativeElement.querySelector('.ant-spin').firstElementChild!.classList).toContain('ant-spin-dot');
    });

    it('should size work', () => {
      testComponent.size.set('small');
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').classList).toContain('ant-spin-sm');
      testComponent.size.set('large');
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').classList).toContain('ant-spin-lg');
    });

    it('should spinning work', () => {
      testComponent.spinning.set(false);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeNull();
      testComponent.spinning.set(true);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeDefined();
    });

    it('should indicator work', () => {
      testComponent.indicator.set(testComponent.indicatorTemplate);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-dot')).toBeNull();
      expect(spin.nativeElement.querySelector('.anticon-loading')).toBeDefined();
    });

    it('should global config indicator work', () => {
      testComponent.configService.set('spin', { nzIndicator: testComponent.indicatorTemplate });
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-dot')).toBeNull();
      expect(spin.nativeElement.querySelector('.anticon-loading')).toBeDefined();
    });

    it('should delay work', () => {
      vi.useFakeTimers();
      testComponent.delay.set(500);

      // true -> false
      // This should work immediately
      testComponent.spinning.set(false);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeNull();

      // false -> true
      // This should be debounced
      testComponent.spinning.set(true);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeNull();

      vi.advanceTimersByTime(500);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeDefined();
      vi.useRealTimers();
    });

    it('should wrapper work', () => {
      expect(spin.nativeElement.querySelector('.ant-spin').classList).toContain('ant-spin-spinning');
      expect(spin.nativeElement.querySelector('.ant-spin-container')).toBeDefined();
      testComponent.simple.set(true);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-container')).toBeNull();
    });

    it('should tip work', () => {
      expect(spin.nativeElement.querySelector('.ant-spin-text')).toBeNull();
      testComponent.tip.set('tip');
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-text').innerText).toBe('tip');
    });
  });

  testDirectionality(() => TriTestSpinBasicComponent, By.css('.ant-spin'), 'ant-spin');
});

@Component({
  selector: 'tri-test-basic-spin',
  imports: [TriIconModule, TriSpinModule],
  template: `
    <ng-template #indicatorTemplate><tri-icon type="loading" style="font-size: 24px;" /></ng-template>
    <tri-spin
      [tip]="tip()"
      [size]="size()"
      [delay]="delay()"
      [spinning]="spinning()"
      [simple]="simple()"
      [indicator]="indicator()"
    >
      <div>test</div>
    </tri-spin>
  `
})
export class TriTestSpinBasicComponent {
  public readonly configService = inject(TriConfigService);

  @ViewChild('indicatorTemplate', { static: false }) indicatorTemplate!: TemplateRef<void>;

  readonly size = signal<TriSizeLDSType>('default');
  readonly delay = signal(0);
  readonly spinning = signal(true);
  readonly indicator = signal<TemplateRef<TriSafeAny> | null>(undefined!);
  readonly tip = signal<string | null>(null);
  readonly simple = signal(false);
}
