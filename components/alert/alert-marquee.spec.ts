/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriAlertMarqueeComponent } from './alert-marquee.component';
import { TriAlertModule } from './alert.module';

describe('NzAlertMarqueeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNoopAnimations()]
    });
  });

  describe('structure', () => {
    let fixture: ComponentFixture<TriTestMarqueeBasicComponent>;
    let marquee: DebugElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriTestMarqueeBasicComponent);
      marquee = fixture.debugElement.query(By.directive(TriAlertMarqueeComponent));
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });

    it('should render the marquee container', () => {
      expect(marquee.nativeElement.classList).toContain('ant-alert-marquee');
    });

    it('should render exactly two tracks inside the container', () => {
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      expect(tracks.length).toBe(2);
    });

    it('should project content into the first track', () => {
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      expect(tracks[0].textContent.trim()).toContain('Scrolling message');
    });

    it('should clone content into the second track', () => {
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      expect(tracks[1].textContent.trim()).toContain('Scrolling message');
    });

    it('should set aria-hidden="true" on the second track for accessibility', () => {
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      expect(tracks[1].getAttribute('aria-hidden')).toBe('true');
    });

    it('should not set aria-hidden on the first track', () => {
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      expect(tracks[0].hasAttribute('aria-hidden')).toBeFalse();
    });
  });

  describe('nzSpeed', () => {
    let fixture: ComponentFixture<TriTestMarqueeBasicComponent>;
    let marquee: DebugElement;

    beforeEach(async () => {
      spyOnProperty(HTMLElement.prototype, 'offsetWidth', 'get').and.returnValue(500);
      fixture = TestBed.createComponent(TriTestMarqueeBasicComponent);
      marquee = fixture.debugElement.query(By.directive(TriAlertMarqueeComponent));
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });

    it('should calculate duration as trackWidth divided by nzSpeed', () => {
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      // 500px / 50px/s = 10s
      expect(tracks[0].style.animationDuration).toBe('10s');
    });

    it('should apply a custom animation duration via nzSpeed', () => {
      fixture.componentInstance.speed.set(100);
      fixture.detectChanges();
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      // 500px / 100px/s = 5s
      expect(tracks[0].style.animationDuration).toBe('5s');
    });

    it('should coerce nzSpeed string attribute to a number', () => {
      fixture.componentInstance.speed.set(25);
      fixture.detectChanges();
      const tracks = marquee.nativeElement.querySelectorAll('.ant-alert-marquee-track');
      // 500px / 25px/s = 20s
      expect(tracks[0].style.animationDuration).toBe('20s');
    });
  });

  describe('nzPauseOnHover', () => {
    let fixture: ComponentFixture<TriTestMarqueeBasicComponent>;
    let marquee: DebugElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriTestMarqueeBasicComponent);
      marquee = fixture.debugElement.query(By.directive(TriAlertMarqueeComponent));
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });

    it('should not apply the pause-on-hover class by default', () => {
      expect(marquee.nativeElement.classList).not.toContain('ant-alert-marquee-pause-on-hover');
    });

    it('should apply the pause-on-hover class when nzPauseOnHover is true', () => {
      fixture.componentInstance.pauseOnHover.set(true);
      fixture.detectChanges();
      expect(marquee.nativeElement.classList).toContain('ant-alert-marquee-pause-on-hover');
    });

    it('should remove the pause-on-hover class when nzPauseOnHover is toggled back to false', () => {
      fixture.componentInstance.pauseOnHover.set(true);
      fixture.detectChanges();
      fixture.componentInstance.pauseOnHover.set(false);
      fixture.detectChanges();
      expect(marquee.nativeElement.classList).not.toContain('ant-alert-marquee-pause-on-hover');
    });
  });

  describe('used inside nz-alert', () => {
    let fixture: ComponentFixture<TriTestMarqueeInsideAlertComponent>;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriTestMarqueeInsideAlertComponent);
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });

    it('should render inside the alert message area', () => {
      expect(fixture.nativeElement.querySelector('.ant-alert-message .ant-alert-marquee')).not.toBeNull();
    });

    it('should render the marquee track inside the alert', () => {
      expect(fixture.nativeElement.querySelector('.ant-alert-message .ant-alert-marquee-track')).not.toBeNull();
    });

    it('should work correctly alongside nzBanner', () => {
      expect(fixture.nativeElement.querySelector('.ant-alert-banner')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.ant-alert-marquee')).not.toBeNull();
    });

    it('should project content into the track when used inside nz-alert', () => {
      const track = fixture.nativeElement.querySelector('.ant-alert-marquee-track') as HTMLElement;
      expect(track.textContent.trim()).toContain('Loop banner text');
    });
  });
});

@Component({
  imports: [TriAlertModule],
  template: `
    <tri-alert-marquee [pauseOnHover]="pauseOnHover()" [speed]="speed()"> Scrolling message </tri-alert-marquee>
  `
})
export class TriTestMarqueeBasicComponent {
  readonly pauseOnHover = signal(false);
  readonly speed = signal(50);
}

@Component({
  imports: [TriAlertModule],
  template: `
    <tri-alert banner [message]="message" />
    <ng-template #message>
      <tri-alert-marquee>Loop banner text</tri-alert-marquee>
    </ng-template>
  `
})
export class TriTestMarqueeInsideAlertComponent {}
