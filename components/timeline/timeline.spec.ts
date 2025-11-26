/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriDemoTimelineLabelComponent } from './demo/label';
import { TriTimelineComponent } from './timeline.component';
import { TriTimelineModule } from './timeline.module';
import { TriTimelineMode } from './typings';

describe('nz-timeline', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriTestTimelineBasicComponent>;
    let testComponent: TriTestTimelineBasicComponent;
    let timeline: DebugElement;
    let items: HTMLDivElement[] = [];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimelineBasicComponent);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();

      timeline = fixture.debugElement.query(By.directive(TriTimelineComponent));
      items = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('.ant-timeline-item'));
    });

    it('should init className correct', () => {
      expect(timeline.nativeElement.firstElementChild!.classList).toContain('ant-timeline');
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].classList).not.toContain('ant-timeline-item-last');
      expect(items[3].classList).toContain('ant-timeline-item-last');
    });

    it('should color work', () => {
      fixture.detectChanges();
      expect(items[0].querySelector('.ant-timeline-item-head')!.classList).toContain('ant-timeline-item-head-blue');
      testComponent.color = 'red';
      fixture.detectChanges();
      expect(items[0].querySelector('.ant-timeline-item-head')!.classList).toContain('ant-timeline-item-head-red');
      testComponent.color = 'green';
      fixture.detectChanges();
      expect(items[0].querySelector('.ant-timeline-item-head')!.classList).toContain('ant-timeline-item-head-green');
    });

    it('should dot work', () => {
      fixture.detectChanges();
      expect((items[0].querySelector('.ant-timeline-item-head') as HTMLDivElement).innerText).toBe('dot');
      expect((items[1].querySelector('.ant-timeline-item-head') as HTMLDivElement).innerText).toBe('template');
    });

    it('should last work', () => {
      fixture.detectChanges();
      expect(items.length).toBe(4);
      testComponent.last = true;
      fixture.detectChanges();
      items = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('.ant-timeline-item'));
      expect(items.length).toBe(5);
      expect(items[4]!.classList).toContain('ant-timeline-item-last');
    });

    it('should pending work', () => {
      fixture.detectChanges();
      expect(timeline.nativeElement.querySelector('.ant-timeline-item-pending')).toBeNull();
      testComponent.pending = true;
      fixture.detectChanges();
      expect(timeline.nativeElement.querySelector('.ant-timeline-item-pending').innerText).toBe('');
      testComponent.pending = 'pending';
      fixture.detectChanges();
      expect(timeline.nativeElement.querySelector('.ant-timeline-item-pending').innerText).toBe('pending');
    });

    it('should reverse work', () => {
      fixture.detectChanges();
      testComponent.pending = true;
      testComponent.reverse = true;
      fixture.detectChanges();
      expect(timeline.nativeElement.firstElementChild.firstElementChild!.classList).toContain(
        'ant-timeline-item-pending'
      );
      expect(items[0].classList).toContain('ant-timeline-item-last');
      expect(items[3].classList).not.toContain('ant-timeline-item-last');
    });

    it('should alternate position work', () => {
      fixture.detectChanges();
      testComponent.mode = 'alternate';
      fixture.detectChanges();
      expect(timeline.nativeElement.firstElementChild!.classList).toContain('ant-timeline-alternate');
      expect(items[0].classList).toContain('ant-timeline-item-left');
      expect(items[1].classList).toContain('ant-timeline-item-right');
      expect(items[2].classList).toContain('ant-timeline-item-left');
    });

    it('should alternate right position work', () => {
      fixture.detectChanges();
      testComponent.mode = 'right';
      fixture.detectChanges();
      expect(timeline.nativeElement.firstElementChild!.classList).toContain('ant-timeline-right');
      expect(items[0].classList).toContain('ant-timeline-item-right');
      expect(items[1].classList).toContain('ant-timeline-item-right');
      expect(items[2].classList).toContain('ant-timeline-item-right');
    });
  });

  // add another test component for simplicity
  describe('custom position', () => {
    let fixture: ComponentFixture<TriTestTimelineCustomPositionComponent>;
    let timeline: DebugElement;
    let items: HTMLDivElement[] = [];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimelineCustomPositionComponent);
      fixture.detectChanges();

      timeline = fixture.debugElement.query(By.directive(TriTimelineComponent));
      items = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('.ant-timeline-item'));
    });

    it('should custom position work', () => {
      expect(timeline.nativeElement.firstElementChild!.classList).toContain('ant-timeline-alternate');
      expect(items[0].classList).toContain('ant-timeline-item-right');
    });
  });

  describe('custom color', () => {
    let fixture: ComponentFixture<TriTestTimelineCustomColorComponent>;
    let items: HTMLLIElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimelineCustomColorComponent);
      fixture.detectChanges();

      items = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('.ant-timeline-item'));
    });

    it('should support custom color', () => {
      fixture.detectChanges();
      expect((items[0].querySelector('.ant-timeline-item-head') as HTMLDivElement)!.style.borderColor).toBe('cyan');
      expect((items[1].querySelector('.ant-timeline-item-head') as HTMLDivElement)!.style.borderColor).toBe(
        'rgb(200, 0, 0)'
      );
      expect((items[2].querySelector('.ant-timeline-item-head') as HTMLDivElement)!.style.borderColor).toBe(
        'rgb(120, 18, 65)'
      ); // hex would be converted to rgb()
      expect((items[3].querySelector('.ant-timeline-item-head') as HTMLDivElement)!.style.borderColor).toBe('');
    });
  });

  describe('pending', () => {
    let fixture: ComponentFixture<TriTestTimelinePendingComponent>;
    let timeline: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimelinePendingComponent);
      fixture.detectChanges();
      timeline = fixture.debugElement.query(By.directive(TriTimelineComponent));
    });

    it('should pending work', () => {
      fixture.detectChanges();
      expect(timeline.nativeElement.querySelector('.ant-timeline-item-pending').innerText).toBe('template');
    });
  });

  describe('label', () => {
    let fixture: ComponentFixture<TriDemoTimelineLabelComponent>;
    let timeline: DebugElement;
    let items: HTMLLIElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriDemoTimelineLabelComponent);
      fixture.detectChanges();

      timeline = fixture.debugElement.query(By.directive(TriTimelineComponent));
      items = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('.ant-timeline-item'));
    });

    it('should label work', () => {
      expect(timeline.nativeElement.firstElementChild!.classList).toContain('ant-timeline-label');
      expect(items[0].firstElementChild!.classList).toContain('ant-timeline-item-label');
      expect(items[2].firstElementChild!.classList).not.toContain('ant-timeline-item-label');
    });

    it('should mode right not affecting classnames', () => {
      fixture.componentInstance.mode = 'right';
      fixture.detectChanges();

      expect(timeline.nativeElement.firstElementChild!.classList).not.toContain('ant-timeline-right');
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestTimelineRtlComponent>;
    let timeline: DebugElement;
    let items: HTMLDivElement[] = [];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimelineRtlComponent);
      fixture.detectChanges();

      timeline = fixture.debugElement.query(By.directive(TriTimelineComponent));
      items = Array.from((fixture.debugElement.nativeElement as HTMLElement).querySelectorAll('.ant-timeline-item'));
    });

    it('should init className correct', () => {
      expect(timeline.nativeElement.firstElementChild!.classList).toContain('ant-timeline-rtl');
      expect(items.length).toBeGreaterThan(0);

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(timeline.nativeElement.firstElementChild!.classList).not.toContain('ant-timeline-rtl');
    });
  });

  describe('clear', () => {
    let fixture: ComponentFixture<TriTestTimelineClearItemsComponent>;
    let timeline: TriTimelineComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTimelineClearItemsComponent);
      fixture.detectChanges();
      timeline = fixture.componentInstance.timeLine;
    });

    it('test clear items', () => {
      fixture.componentInstance.reset();
      fixture.detectChanges();
      expect(timeline.timelineItems.length).toBe(0);
    });
  });
});

@Component({
  imports: [TriTimelineModule],
  selector: 'tri-test-basic-timeline',
  template: `
    <ng-template #dotTemplate>template</ng-template>
    <tri-timeline [pending]="pending" [reverse]="reverse" [mode]="mode">
      <tri-timeline-item [color]="color" [dot]="dot">Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item [dot]="dotTemplate">Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Technical testing 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
      @if (last) {
        <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
      }
    </tri-timeline>
  `
})
export class TriTestTimelineBasicComponent {
  color = 'blue';
  dot = 'dot';
  pending: boolean | string = false;
  last = false;
  reverse = false;
  mode: TriTimelineMode = 'left';
}

@Component({
  imports: [TriTimelineModule],
  template: `
    <tri-timeline>
      <tri-timeline-item [color]="'cyan'">Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item [color]="'rgb(200, 0, 0)'">Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item [color]="'#781241'">Technical testing 2015-09-01</tri-timeline-item>
      <tri-timeline-item [color]="'red'">Network problems being solved 2015-09-01</tri-timeline-item>
    </tri-timeline>
  `
})
export class TriTestTimelineCustomColorComponent {}

@Component({
  imports: [TriTimelineModule],
  template: `
    <ng-template #pendingTemplate>template</ng-template>
    <tri-timeline [pending]="pendingTemplate">
      <tri-timeline-item>Technical testing 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
    </tri-timeline>
  `
})
export class TriTestTimelinePendingComponent {}

@Component({
  imports: [TriTimelineModule],
  template: `
    <tri-timeline mode="custom">
      <tri-timeline-item position="right">Right</tri-timeline-item>
      <tri-timeline-item position="left">Left</tri-timeline-item>
    </tri-timeline>
  `
})
export class TriTestTimelineCustomPositionComponent {}

@Component({
  imports: [BidiModule, TriTestTimelineBasicComponent],
  template: `
    <div [dir]="direction">
      <tri-test-basic-timeline></tri-test-basic-timeline>
    </div>
  `
})
export class TriTestTimelineRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  imports: [TriTimelineModule],
  template: `
    <tri-timeline mode="custom">
      @for (item of data; track item) {
        <tri-timeline-item>{{ item }}</tri-timeline-item>
      }
    </tri-timeline>
    <span (click)="reset()">reset</span>
  `
})
export class TriTestTimelineClearItemsComponent {
  @ViewChild(TriTimelineComponent)
  timeLine!: TriTimelineComponent;
  data = [1, 2, 3];
  reset(): void {
    this.data = [];
  }
}
