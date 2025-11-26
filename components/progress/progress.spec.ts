/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, provideZoneChangeDetection, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriProgressComponent } from './progress.component';
import { TriProgressModule } from './progress.module';
import {
  TriProgressFormatter,
  TriProgressGapPositionType,
  TriProgressStatusType,
  TriProgressStrokeColorType,
  TriProgressStrokeLinecapType
} from './typings';

describe('progress', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  describe('progress line', () => {
    let fixture: ComponentFixture<TriTestProgressLineComponent>;
    let testComponent: TriTestProgressLineComponent;
    let progress: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestProgressLineComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      progress = fixture.debugElement.query(By.directive(TriProgressComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();

      const classNames = progress.nativeElement.firstElementChild.className;
      expect(classNames).toContain('ant-progress');
      expect(classNames).toContain('ant-progress-status-normal');
      expect(classNames).toContain('ant-progress-line');
      expect(classNames).toContain('ant-progress-show-info');
    });

    it('should percent work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.width).toBe('0%');
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.height).toBe('8px');
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('0%');
      testComponent.percent = 50;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.width).toBe('50%');
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.height).toBe('8px');
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('50%');
      testComponent.percent = 100;
      testComponent.successPercent = 100;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.width).toBe('100%');
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.height).toBe('8px');
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('');
      expect(progress.nativeElement.querySelector('.anticon-check-circle')).toBeDefined();
    });

    it('should successPercent', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.width).toBe('0%');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.height).toBe('8px');
      testComponent.successPercent = 50;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.width).toBe('50%');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.height).toBe('8px');
    });

    it('should successPercent forbidden inferred success', () => {
      fixture.detectChanges();
      testComponent.successPercent = 50;
      testComponent.percent = 100;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress')!.classList).not.toContain(
        'ant-progress-status-success'
      );
    });

    it('should formatter work', () => {
      testComponent.formatter = (percent: number) => `${percent} percent`;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('0 percent');
      testComponent.percent = 100;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('100 percent');

      testComponent.formatter = testComponent.formatterTemplate;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('100 / 100');
    });

    it('should status work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.firstElementChild!.classList).toContain('ant-progress-status-normal');
      const listOfStatus: TriProgressStatusType[] = ['success', 'exception', 'active', 'normal'];
      testComponent.percent = 100;
      listOfStatus.forEach(status => {
        testComponent.status = status;
        fixture.detectChanges();
        expect(progress.nativeElement.firstElementChild!.classList).toContain(`ant-progress-status-${status}`);
      });
    });

    it('should showInfo work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.firstElementChild!.classList).toContain('ant-progress-show-info');
      expect(progress.nativeElement.querySelector('.ant-progress-text')).toBeDefined();
      testComponent.showInfo = false;
      fixture.detectChanges();
      expect(progress.nativeElement.firstElementChild!.classList).not.toContain('ant-progress-show-info');
      expect(progress.nativeElement.querySelector('.ant-progress-text')).toBeNull();
    });

    it('should strokeWidth work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.height).toBe('8px');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.height).toBe('8px');
      testComponent.strokeWidth = 6;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.height).toBe('6px');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.height).toBe('6px');
    });

    it('should size work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.height).toBe('8px');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.height).toBe('8px');
      testComponent.size = 'small';
      fixture.detectChanges();
      expect(progress.nativeElement.firstElementChild!.classList).toContain('ant-progress-small');
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.height).toBe('6px');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.height).toBe('6px');
    });

    it('should strokeLinecap work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.borderRadius).toBe('100px');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.borderRadius).toBe('100px');
      testComponent.strokeLinecap = 'square';
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.borderRadius).toBe('0px');
      expect(progress.nativeElement.querySelector('.ant-progress-success-bg').style.borderRadius).toBe('0px');
    });

    it('should strokeColor work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.background).toBe('');
      testComponent.strokeColor = 'blue';
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-bg').style.background).toBe('blue');
    });

    it('should strokeColor work with gradient', () => {
      fixture.detectChanges();
      const progressBar: HTMLDivElement = progress.nativeElement.querySelector('.ant-progress-bg')!;
      expect(progressBar.style.background).toBe('');
      testComponent.strokeColor = { '0%': '#108ee9', '100%': '#87d068' };
      fixture.detectChanges();
      expect(progressBar.style.background).toBe('');
      expect(progressBar.style.backgroundImage).toBe(
        'linear-gradient(to right, rgb(16, 142, 233) 0%, rgb(135, 208, 104) 100%)'
      );

      testComponent.strokeColor = { '0%': '#108ee9', '100%': '#87d068' };
      fixture.detectChanges();
      expect(progressBar.style.background).toBe('');
      expect(progressBar.style.backgroundImage).toBe(
        'linear-gradient(to right, rgb(16, 142, 233) 0%, rgb(135, 208, 104) 100%)'
      );
    });

    it('should support steps mode', () => {
      testComponent.steps = 5;
      testComponent.percent = 50;
      testComponent.strokeColor = '#108ee9';
      fixture.detectChanges();

      const steps = progress.nativeElement.querySelectorAll('.ant-progress-steps-item');

      expect(steps.length).toBe(5);
      expect((steps[0] as HTMLDivElement).style.backgroundColor).toBe('rgb(16, 142, 233)');
      expect((steps[4] as HTMLDivElement).style.backgroundColor).toBeFalsy();

      testComponent.percent = 80;
      fixture.detectChanges();

      expect((steps[4] as HTMLDivElement).style.backgroundColor).toBeFalsy();
    });
  });

  describe('progress dashboard', () => {
    let fixture: ComponentFixture<TriTestProgressDashBoardComponent>;
    let testComponent: TriTestProgressDashBoardComponent;
    let progress: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestProgressDashBoardComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      progress = fixture.debugElement.query(By.directive(TriProgressComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();

      const classNames = progress.nativeElement.firstElementChild.className;
      expect(classNames).toContain('ant-progress');
      expect(classNames).toContain('ant-progress-status-normal');
      expect(classNames).toContain('ant-progress-circle');
      expect(classNames).toContain('ant-progress-show-info');
    });

    it('should format work', () => {
      testComponent.format = (percent: number) => `${percent} percent`;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('0 percent');
      testComponent.percent = 100;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('100 percent');
    });

    it('should showInfo work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.firstElementChild!.classList).toContain('ant-progress-show-info');
      expect(progress.nativeElement.querySelector('.ant-progress-text')).toBeDefined();
      testComponent.showInfo = false;
      fixture.detectChanges();
      expect(progress.nativeElement.firstElementChild!.classList).not.toContain('ant-progress-show-info');
      expect(progress.nativeElement.querySelector('.ant-progress-text')).toBeNull();
    });

    it('should percent work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('0%');
      testComponent.percent = 50;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('50%');
      testComponent.percent = 100;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-text').innerText.trim()).toBe('');
      expect(progress.nativeElement.querySelector('.anticon-check-circle')).toBeDefined();
    });

    it('should width work', () => {
      let styleText = '';

      function getStyleText(): void {
        styleText = progress.nativeElement.querySelector('.ant-progress-inner').style.cssText;
      }

      fixture.detectChanges();
      getStyleText();
      expect(styleText).toContain('width: 132px;');
      expect(styleText).toContain('height: 132px;');
      expect(styleText).toContain('font-size: 25.8px;');

      testComponent.width = 100;
      fixture.detectChanges();
      getStyleText();
      expect(styleText).toContain('width: 100px;');
      expect(styleText).toContain('height: 100px;');
      expect(styleText).toContain('font-size: 21px;');
    });

    it('should strokeWidth work', () => {
      fixture.detectChanges();
      expect(
        progress.nativeElement.querySelector('.ant-progress-circle-trail').attributes.getNamedItem('stroke-width').value
      ).toBe('6');
      testComponent.strokeWidth = 10;
      fixture.detectChanges();
      expect(
        progress.nativeElement.querySelector('.ant-progress-circle-trail').attributes.getNamedItem('stroke-width').value
      ).toBe('10');
    });

    it('should strokeLinecap work', () => {
      fixture.detectChanges();
      expect(
        progress.nativeElement.querySelector('.ant-progress-circle-path').attributes.getNamedItem('stroke-linecap')
          .value
      ).toBe('round');
      testComponent.strokeLinecap = 'square';
      fixture.detectChanges();
      expect(
        progress.nativeElement.querySelector('.ant-progress-circle-path').attributes.getNamedItem('stroke-linecap')
          .value
      ).toBe('square');
    });
  });

  describe('progress circle', () => {
    let fixture: ComponentFixture<TriTestProgressCircleComponent>;
    let testComponent: TriTestProgressCircleComponent;
    let progress: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestProgressCircleComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      progress = fixture.debugElement.query(By.directive(TriProgressComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();

      const classNames = progress.nativeElement.firstElementChild.className;
      expect(classNames).toContain('ant-progress');
      expect(classNames).toContain('ant-progress-status-normal');
      expect(classNames).toContain('ant-progress-circle');
      expect(classNames).toContain('ant-progress-show-info');
    });

    it('should gapDegree work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-circle-path').style.strokeDashoffset).toBe('0px');
      testComponent.gapDegree = 120;
      fixture.detectChanges();
      expect(progress.nativeElement.querySelector('.ant-progress-circle-path').style.strokeDashoffset).toBe('-60px');
    });

    it('should gapPosition work', () => {
      fixture.detectChanges();

      function getPathD(): string {
        return progress.nativeElement
          .querySelector('.ant-progress-circle-path')
          .attributes.getNamedItem('d')
          .value.replace(/\n\s{2,}/g, ' ');
      }

      expect(getPathD()).toBe(`M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94`);

      testComponent.gapPosition = 'left';
      fixture.detectChanges();
      expect(getPathD()).toBe(`M 50,50 m -47,0 a 47,47 0 1 1 94,0 a 47,47 0 1 1 -94,0`);

      testComponent.gapPosition = 'right';
      fixture.detectChanges();
      expect(getPathD()).toBe(`M 50,50 m 47,0 a 47,47 0 1 1 -94,0 a 47,47 0 1 1 94,0`);

      testComponent.gapPosition = 'bottom';
      fixture.detectChanges();
      expect(getPathD()).toBe(`M 50,50 m 0,47 a 47,47 0 1 1 0,-94 a 47,47 0 1 1 0,94`);

      testComponent.gapPosition = 'top';
      fixture.detectChanges();
      expect(getPathD()).toBe(`M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94`);
    });

    it('should strokeLinecap work', () => {
      fixture.detectChanges();
      expect(
        progress.nativeElement.querySelector('.ant-progress-circle-path').attributes.getNamedItem('stroke-linecap')
          .value
      ).toBe('round');
      testComponent.strokeLinecap = 'square';
      fixture.detectChanges();
      expect(
        progress.nativeElement.querySelector('.ant-progress-circle-path').attributes.getNamedItem('stroke-linecap')
          .value
      ).toBe('square');
    });

    it('should strokeColor work', () => {
      fixture.detectChanges();
      const path = progress.nativeElement.querySelector('.ant-progress-circle-path');
      // No stroke property for built-in colors.
      expect(path.attributes.getNamedItem('stroke')).toBeFalsy();
      testComponent.strokeColor = 'blue';
      fixture.detectChanges();
      // TODO: don't why this is invalid in tests
      // expect(path.attributes.getNamedItem('style').value).toContain('blue');
    });

    it('should strokeColor work with gradient', () => {
      fixture.detectChanges();
      // const path = progress.nativeElement.querySelector('.ant-progress-circle-path');
      testComponent.strokeColor = { '0%': '#108ee9', '100%': '#87d068' };
      fixture.detectChanges();
      // expect(path.attributes.getNamedItem('stroke').value).toMatch(/url(#gradient-\d)/);
    });
  });

  describe('progress circle with successPercent', () => {
    let fixture: ComponentFixture<TriTestProgressCircleSuccessComponent>;
    let progress: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestProgressCircleSuccessComponent);
      fixture.detectChanges();
      progress = fixture.debugElement.query(By.directive(TriProgressComponent));
    });

    it('should success percent work', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.querySelectorAll('.ant-progress-circle-path')[1].style.stroke).toBe(
        'rgb(135, 208, 104)'
      );
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestProgressRtlComponent>;
    let progress: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestProgressRtlComponent);
      fixture.detectChanges();
      progress = fixture.debugElement.query(By.directive(TriProgressComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(progress.nativeElement.firstElementChild.classList).toContain('ant-progress-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();

      expect(progress.nativeElement.firstElementChild.classList).not.toContain('ant-progress-rtl');
    });
  });
});

@Component({
  imports: [TriProgressModule],
  template: `
    <tri-progress
      [size]="size"
      [successPercent]="successPercent"
      [format]="formatter"
      [status]="status"
      [showInfo]="showInfo"
      [strokeWidth]="strokeWidth"
      [percent]="percent"
      [strokeColor]="strokeColor"
      [strokeLinecap]="strokeLinecap"
      [steps]="steps"
    ></tri-progress>
    <ng-template #formatterTemplate let-percent>{{ percent }} / 100</ng-template>
  `
})
export class TriTestProgressLineComponent {
  @ViewChild('formatterTemplate') formatterTemplate!: TemplateRef<{ $implicit: number }>;
  size!: 'default' | 'small';
  status?: TriProgressStatusType;
  formatter?: TriProgressFormatter;
  strokeWidth?: number;
  percent = 0;
  successPercent = 0;
  showInfo = true;
  strokeLinecap: TriProgressStrokeLinecapType = 'round';
  steps?: number;
  strokeColor?: TriProgressStrokeColorType;
}

@Component({
  imports: [TriProgressModule],
  template: `
    <tri-progress
      type="dashboard"
      [width]="width"
      [format]="format"
      [status]="status"
      [showInfo]="showInfo"
      [strokeWidth]="strokeWidth"
      [percent]="percent"
      [strokeLinecap]="strokeLinecap"
    ></tri-progress>
  `
})
export class TriTestProgressDashBoardComponent {
  status?: TriProgressStatusType;
  format?: TriProgressFormatter;
  strokeWidth?: number;
  percent = 0;
  showInfo = true;
  width = 132;
  strokeLinecap: TriProgressStrokeLinecapType = 'round';
}

@Component({
  imports: [TriProgressModule],
  template: `
    <tri-progress
      type="circle"
      [percent]="75"
      [gapDegree]="gapDegree"
      [gapPosition]="gapPosition"
      [strokeColor]="strokeColor"
      [strokeLinecap]="strokeLinecap"
    ></tri-progress>
  `
})
export class TriTestProgressCircleComponent {
  gapDegree?: number;
  gapPosition!: TriProgressGapPositionType;
  strokeLinecap: TriProgressStrokeLinecapType = 'round';
  strokeColor?: TriProgressStrokeColorType;
}

@Component({
  imports: [TriProgressModule],
  template: `<tri-progress type="circle" [percent]="75" [successPercent]="60"></tri-progress>`
})
export class TriTestProgressCircleSuccessComponent {}

@Component({
  imports: [BidiModule, TriProgressModule],
  template: `
    <div [dir]="direction">
      <tri-progress type="circle" [percent]="75" [successPercent]="60"></tri-progress>
    </div>
  `
})
export class TriTestProgressRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
