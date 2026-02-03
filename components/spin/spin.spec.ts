/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, provideZoneChangeDetection, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriConfigService } from 'ng-zorro-antd/core/config';
import { TriSafeAny, TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriSpinComponent } from './spin.component';
import { TriSpinModule } from './spin.module';

describe('spin', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  describe('spin basic', () => {
    let fixture: ComponentFixture<TriTestSpinBasicComponent>;
    let testComponent: TriTestSpinBasicComponent;
    let spin: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestSpinBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      spin = fixture.debugElement.query(By.directive(TriSpinComponent));
    });

    it('should className correct', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').firstElementChild!.classList).toContain('ant-spin-dot');
    }));

    it('should size work', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testComponent.size = 'small';
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').classList).toContain('ant-spin-sm');
      testComponent.size = 'large';
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').classList).toContain('ant-spin-lg');
    }));

    it('should spinning work', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testComponent.spinning = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeNull();
      testComponent.spinning = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeDefined();
    }));

    it('should indicator work', () => {
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-dot')).toBeDefined();

      testComponent.indicator = testComponent.indicatorTemplate;
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-dot')).toBeNull();
      expect(spin.nativeElement.querySelector('.anticon-loading')).toBeDefined();
    });

    it('should global config indicator work', () => {
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-dot')).toBeDefined();

      testComponent.nzConfigService.set('spin', { nzIndicator: testComponent.indicatorTemplate });
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-dot')).toBeNull();
      expect(spin.nativeElement.querySelector('.anticon-loading')).toBeDefined();
    });

    it('should delay work', fakeAsync(() => {
      testComponent.delay = 500;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // true -> false
      // This should work immediately
      testComponent.spinning = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeNull();

      // false -> true
      // This should be debounced
      testComponent.spinning = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeNull();

      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin')).toBeDefined();
    }));

    it('should wrapper work', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').classList).toContain('ant-spin-spinning');
      expect(spin.nativeElement.querySelector('.ant-spin-container')).toBeDefined();
      testComponent.simple = true;
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-container')).toBeNull();
    }));

    it('should tip work', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-text')).toBeNull();
      testComponent.tip = 'tip';
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin-text').innerText).toBe('tip');
    }));
  });

  describe('RTL', () => {
    it('should className correct on dir change', () => {
      const fixture = TestBed.createComponent(TriTestSpinRtlComponent);
      const spin = fixture.debugElement.query(By.directive(TriSpinComponent));
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').classList).toContain('ant-spin-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(spin.nativeElement.querySelector('.ant-spin').classList).not.toContain('ant-spin-rtl');
    });
  });
});

@Component({
  selector: 'tri-test-basic-spin',
  imports: [TriIconModule, TriSpinModule],
  template: `
    <ng-template #indicatorTemplate><tri-icon type="loading" style="font-size: 24px;" /></ng-template>
    <tri-spin
      [tip]="tip"
      [size]="size"
      [delay]="delay"
      [spinning]="spinning"
      [simple]="simple"
      [indicator]="indicator"
    >
      <div>test</div>
    </tri-spin>
  `
})
export class TriTestSpinBasicComponent {
  @ViewChild('indicatorTemplate', { static: false }) indicatorTemplate!: TemplateRef<void>;

  size: TriSizeLDSType = 'default';
  delay = 0;
  spinning = true;
  indicator!: TemplateRef<TriSafeAny>;
  tip!: string;
  simple = false;

  constructor(public nzConfigService: TriConfigService) {}
}

@Component({
  imports: [BidiModule, TriTestSpinBasicComponent],
  template: `
    <div [dir]="direction">
      <tri-test-basic-spin />
    </div>
  `
})
export class TriTestSpinRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
