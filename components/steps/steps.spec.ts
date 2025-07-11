/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DebugElement,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BooleanInput, TriDirectionVHType, TriSizeDSType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriDemoStepsClickableComponent } from './demo/clickable';
import { TriDemoStepsNavComponent } from './demo/nav';
import { TriStepComponent } from './step.component';
import { TriProgressDotTemplate, TriStatusType, TriStepsComponent } from './steps.component';
import { TriStepsModule } from './steps.module';

describe('steps', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
  }));
  describe('outer steps', () => {
    let fixture: ComponentFixture<TriTestOuterStepsComponent>;
    let testComponent: TriTestOuterStepsComponent;
    let outStep: DebugElement;
    let innerSteps: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestOuterStepsComponent);
      testComponent = fixture.componentInstance;
      outStep = fixture.debugElement.query(By.directive(TriStepsComponent));
      innerSteps = fixture.debugElement.queryAll(By.directive(TriStepComponent));
    });

    it('should init className correct', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(outStep.nativeElement.className).toBe('ant-steps ant-steps-horizontal ant-steps-label-horizontal');
      expect(innerSteps[0].nativeElement.className).toBe('ant-steps-item ant-steps-item-active ant-steps-item-process');
      expect(innerSteps[1].nativeElement.className).toBe('ant-steps-item ant-steps-item-wait');
      expect(innerSteps[2].nativeElement.className).toBe('ant-steps-item ant-steps-item-wait');
    }));

    it('should current change correct', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testComponent.current = 1;
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.className).toBe('ant-steps-item ant-steps-item-finish');
      expect(innerSteps[1].nativeElement.className).toBe('ant-steps-item ant-steps-item-process ant-steps-item-active');
      expect(innerSteps[2].nativeElement.className).toBe('ant-steps-item ant-steps-item-wait');
    }));

    it('should tail display correct', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-tail')).toBeTruthy();
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-tail')).toBeTruthy();
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-tail')).toBeFalsy();
    }));

    it('should title correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('0title');
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('1title');
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('2title');
    });

    it('should subtitle correct', () => {
      testComponent.subtitle = '0subtitle';
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-subtitle').innerText.trim()).toBe('0subtitle');
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-subtitle')).toBeFalsy();
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-subtitle')).toBeFalsy();
      testComponent.subtitle = undefined;
      fixture.detectChanges();
    });

    it('should description correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        '0description'
      );
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        '1description'
      );
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        '2description'
      );
    });

    it('should icon display correct', () => {
      fixture.detectChanges();
      expect(
        innerSteps[0].nativeElement
          .querySelector('.ant-steps-item-icon')
          .firstElementChild!.classList.contains('ant-steps-icon')
      ).toBe(true);
      expect(
        innerSteps[1].nativeElement
          .querySelector('.ant-steps-item-icon')
          .firstElementChild!.classList.contains('ant-steps-icon')
      ).toBe(true);
      expect(
        innerSteps[2].nativeElement
          .querySelector('.ant-steps-item-icon')
          .firstElementChild!.classList.contains('ant-steps-icon')
      ).toBe(true);
    });

    it('should size display correct', () => {
      fixture.detectChanges();
      testComponent.size = 'small';
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      expect(outStep.nativeElement.className).toBe(
        'ant-steps ant-steps-horizontal ant-steps-label-horizontal ant-steps-small'
      );
    });

    it('should direction display correct', () => {
      fixture.detectChanges();
      testComponent.direction = 'vertical';
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      expect(outStep.nativeElement.className).toBe('ant-steps ant-steps-vertical');
    });

    it('should label placement display correct', () => {
      fixture.detectChanges();
      testComponent.labelPlacement = 'vertical';
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      expect(outStep.nativeElement.classList).toContain('ant-steps-label-vertical');
    });

    it('should status display correct', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testComponent.status = 'wait';
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.className).toBe('ant-steps-item ant-steps-item-active ant-steps-item-wait');
      testComponent.status = 'finish';
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.className).toBe('ant-steps-item ant-steps-item-active ant-steps-item-finish');
      testComponent.status = 'error';
      testComponent.current = 1;
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(innerSteps[1].nativeElement.className).toBe('ant-steps-item ant-steps-item-error ant-steps-item-active');
      expect(innerSteps[0].nativeElement.className).toBe('ant-steps-item ant-steps-item-finish ant-steps-next-error');
    }));

    it('should processDot display correct', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testComponent.progressDot = true;
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(outStep.nativeElement.classList.contains('ant-steps-dot')).toBe(true);
      expect(
        innerSteps[0].nativeElement
          .querySelector('.ant-steps-icon')
          .firstElementChild!.classList.contains('ant-steps-icon-dot')
      ).toBe(true);
      expect(
        innerSteps[1].nativeElement
          .querySelector('.ant-steps-icon')
          .firstElementChild!.classList.contains('ant-steps-icon-dot')
      ).toBe(true);
      expect(
        innerSteps[2].nativeElement
          .querySelector('.ant-steps-icon')
          .firstElementChild!.classList.contains('ant-steps-icon-dot')
      ).toBe(true);
    }));

    it('should processDot template display correct', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testComponent.progressDot = testComponent.progressTemplate!;
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(outStep.nativeElement.classList.contains('ant-steps-dot')).toBe(true);
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-icon').firstElementChild.innerText.trim()).toBe(
        'process0'
      );
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-icon').firstElementChild.innerText.trim()).toBe(
        'wait1'
      );
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-icon').firstElementChild.innerText.trim()).toBe(
        'wait2'
      );
      expect(
        innerSteps[0].nativeElement
          .querySelector('.ant-steps-icon')
          .lastElementChild.classList.contains('ant-steps-icon-dot')
      ).toBe(true);
      expect(
        innerSteps[1].nativeElement
          .querySelector('.ant-steps-icon')
          .lastElementChild.classList.contains('ant-steps-icon-dot')
      ).toBe(true);
      expect(
        innerSteps[2].nativeElement
          .querySelector('.ant-steps-icon')
          .lastElementChild.classList.contains('ant-steps-icon-dot')
      ).toBe(true);
    }));

    it('should support custom starting index', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testComponent.startIndex = 3;
      testComponent.current = 3;
      testComponent.cdr.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.className).toBe('ant-steps-item ant-steps-item-active ant-steps-item-process');
      expect(innerSteps[1].nativeElement.className).toBe('ant-steps-item ant-steps-item-wait');
      expect(innerSteps[2].nativeElement.className).toBe('ant-steps-item ant-steps-item-wait');
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-icon').innerText.trim()).toBe('4');
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-icon').innerText.trim()).toBe('5');
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-icon').innerText.trim()).toBe('6');
    }));
  });

  describe('inner step string', () => {
    let fixture: ComponentFixture<TriTestInnerStepStringComponent>;
    let testComponent: TriTestInnerStepStringComponent;
    let innerSteps: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInnerStepStringComponent);
      testComponent = fixture.debugElement.componentInstance;
      innerSteps = fixture.debugElement.queryAll(By.directive(TriStepComponent));
    });

    it('should status display correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.classList).toContain('ant-steps-item-process');
      expect(innerSteps[1].nativeElement.classList).toContain('ant-steps-item-process');
      expect(innerSteps[2].nativeElement.classList).toContain('ant-steps-item-process');
      testComponent.status = 'wait';
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.classList).toContain('ant-steps-item-wait');
      expect(innerSteps[1].nativeElement.classList).toContain('ant-steps-item-wait');
      expect(innerSteps[2].nativeElement.classList).toContain('ant-steps-item-wait');
    });

    it('should title display correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('title');
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('title');
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('title');
    });

    it('should description display correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        'description'
      );
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        'description'
      );
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        'description'
      );
    });

    it('should icon display correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-icon').firstElementChild.className).toBe(
        'anticon anticon-user'
      );
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-icon').firstElementChild.className).toBe(
        'anticon anticon-user'
      );
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-icon').firstElementChild.className).toBe(
        'anticon anticon-user'
      );
    });
  });

  describe('inner step template', () => {
    let fixture: ComponentFixture<TriTestInnerStepTemplateComponent>;
    let innerSteps: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInnerStepTemplateComponent);
      innerSteps = fixture.debugElement.queryAll(By.directive(TriStepComponent));
    });

    it('should title display correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('titleTemplate');
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('titleTemplate');
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-title').innerText.trim()).toBe('titleTemplate');
    });

    it('should description display correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        'descriptionTemplate'
      );
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        'descriptionTemplate'
      );
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-item-description').innerText.trim()).toBe(
        'descriptionTemplate'
      );
    });

    it('should icon display correct', () => {
      fixture.detectChanges();
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-icon').firstElementChild.className).toContain(
        'anticon-smile-o'
      );
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-icon').firstElementChild.className).toContain(
        'anticon-smile-o'
      );
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-icon').firstElementChild.className).toContain(
        'anticon-smile-o'
      );
    });
  });

  describe('step ng for', () => {
    it('should title display correct', () => {
      TestBed.createComponent(TriTestStepForComponent).detectChanges();
    });

    it('should push works correct', () => {
      const comp = TestBed.createComponent(TriTestStepForComponent);
      comp.detectChanges();
      comp.debugElement.componentInstance.updateSteps();
      comp.detectChanges();
    });
  });

  describe('step async assign steps', () => {
    it('should allow steps assigned asynchronously', fakeAsync(() => {
      const fixture: ComponentFixture<TriTestStepAsyncComponent> = TestBed.createComponent(TriTestStepAsyncComponent);
      let innerSteps: DebugElement[];

      fixture.detectChanges();
      innerSteps = fixture.debugElement.queryAll(By.directive(TriStepComponent));
      expect(innerSteps.length).toBe(0);

      tick(1000);
      fixture.detectChanges();
      tick();
      innerSteps = fixture.debugElement.queryAll(By.directive(TriStepComponent));
      fixture.detectChanges();
      expect(innerSteps.length).toBe(3);
      expect(innerSteps[0].nativeElement.className).toBe('ant-steps-item ant-steps-item-finish');
      expect(innerSteps[1].nativeElement.className).toBe('ant-steps-item ant-steps-item-active ant-steps-item-process');
      expect(innerSteps[0].nativeElement.querySelector('.ant-steps-icon').innerText.trim()).toBe('');
      expect(innerSteps[1].nativeElement.querySelector('.ant-steps-icon').innerText.trim()).toBe('2');
      expect(innerSteps[2].nativeElement.querySelector('.ant-steps-icon').innerText.trim()).toBe('3');
    }));
  });

  describe('step clickable', () => {
    let fixture: ComponentFixture<TriDemoStepsClickableComponent>;
    let testComponent: TriDemoStepsClickableComponent;
    let innerSteps: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriDemoStepsClickableComponent);
      testComponent = fixture.debugElement.componentInstance;
      innerSteps = fixture.debugElement.queryAll(By.directive(TriStepComponent));
    });

    it('should clickable', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      innerSteps
        .map(step => step.nativeElement.querySelector('.ant-steps-item-container'))
        .forEach((e: HTMLElement) => {
          expect(e.getAttribute('role')).toBe('button');
        });
    }));

    it('should output work', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      spyOn(testComponent, 'onIndexChange');
      innerSteps[1].nativeElement.querySelector('.ant-steps-item-container').click();
      fixture.detectChanges();
      expect(testComponent.onIndexChange).toHaveBeenCalledWith(1);
    }));

    it('should disable work', fakeAsync(() => {
      testComponent.disable = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const step = innerSteps[0].nativeElement.querySelector('.ant-steps-item-container') as HTMLElement;
      expect(step.getAttribute('role')).not.toBe('button');
      spyOn(testComponent, 'onIndexChange');
      step.click();
      fixture.detectChanges();
      expect(testComponent.onIndexChange).not.toHaveBeenCalled();
    }));

    it("should can't click when status is process", fakeAsync(() => {
      testComponent.disable = false;
      testComponent.index = 0;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      spyOn(testComponent, 'onIndexChange');
      innerSteps[0].nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.onIndexChange).not.toHaveBeenCalled();
    }));

    it('should enable and disable work', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      innerSteps[1].componentInstance.disable();
      fixture.detectChanges();
      spyOn(testComponent, 'onIndexChange');
      innerSteps[1].nativeElement.querySelector('.ant-steps-item-container').click();
      fixture.detectChanges();
      expect(testComponent.onIndexChange).not.toHaveBeenCalled();
      innerSteps[1].componentInstance.enable();
      fixture.detectChanges();
      innerSteps[1].nativeElement.querySelector('.ant-steps-item-container').click();
      fixture.detectChanges();
      expect(testComponent.onIndexChange).toHaveBeenCalledTimes(1);
      expect(testComponent.onIndexChange).toHaveBeenCalledWith(1);
    }));
  });

  describe('navigation', () => {
    let fixture: ComponentFixture<TriDemoStepsNavComponent>;
    let steps: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriDemoStepsNavComponent);
      steps = fixture.debugElement.queryAll(By.directive(TriStepsComponent));
    });

    it('should clickable', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      steps
        .map(step => step.nativeElement)
        .forEach((e: HTMLElement) => {
          expect(e.classList).toContain('ant-steps-navigation');
        });
    }));
  });
  describe('RTL', () => {
    it('should className correct on dir change', fakeAsync(() => {
      const fixture = TestBed.createComponent(TriTestOuterStepsRtlComponent);
      const outStep = fixture.debugElement.query(By.directive(TriStepsComponent));
      fixture.componentInstance.direction = 'rtl';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(outStep.nativeElement.classList).toContain('ant-steps-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(outStep.nativeElement.classList).not.toContain('ant-steps-rtl');
    }));
  });
});

@Component({
  selector: 'tri-test-outer-steps',
  imports: [NgTemplateOutlet, TriStepsModule],
  template: `
    <tri-steps
      [current]="current"
      [direction]="direction"
      [labelPlacement]="labelPlacement"
      [size]="size"
      [status]="status"
      [progressDot]="progressDot"
      [startIndex]="startIndex"
    >
      <tri-step title="0title" [subtitle]="subtitle" description="0description"></tri-step>
      <tri-step title="1title" description="1description"></tri-step>
      <tri-step title="2title" description="2description"></tri-step>
    </tri-steps>
    <ng-template #progressTemplate let-dot let-status="status" let-index="index">
      <span class="insert-span">{{ status }}{{ index }}</span>
      <ng-template [ngTemplateOutlet]="dot"></ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriTestOuterStepsComponent {
  @ViewChild('progressTemplate', { static: false }) progressTemplate?: TriProgressDotTemplate;
  current = 0;
  direction: TriDirectionVHType = 'horizontal';
  labelPlacement: TriDirectionVHType = 'horizontal';
  size: TriSizeDSType = 'default';
  status: TriStatusType = 'process';
  subtitle?: string | TemplateRef<void>;
  progressDot: BooleanInput | TriProgressDotTemplate | undefined | null = false;
  startIndex = 0;
  constructor(public cdr: ChangeDetectorRef) {}
}

@Component({
  imports: [TriIconModule, TriStepsModule],
  template: `
    <tri-steps [current]="current">
      <tri-step [title]="title" [description]="description" [icon]="icon" [status]="status"></tri-step>
      <tri-step [title]="title" [description]="description" [icon]="icon" [status]="status"></tri-step>
      <tri-step [title]="title" [description]="description" [icon]="icon" [status]="status"></tri-step>
    </tri-steps>
    <ng-template #titleTemplate>titleTemplate</ng-template>
    <ng-template #descriptionTemplate>descriptionTemplate</ng-template>
    <ng-template #iconTemplate><tri-icon type="smile-o" /></ng-template>
  `
})
export class TriTestInnerStepStringComponent {
  @ViewChild('titleTemplate', { static: false }) titleTemplate?: TemplateRef<void>;
  @ViewChild('descriptionTemplate', { static: false }) descriptionTemplate?: TemplateRef<void>;
  @ViewChild('iconTemplate', { static: false }) iconTemplate?: TemplateRef<void>;
  status = 'process';
  current = 1;
  icon = 'user';
  title = 'title';
  description = 'description';
}

@Component({
  imports: [TriIconModule, TriStepsModule],
  template: `
    <tri-steps [current]="1">
      <tri-step [title]="titleTemplate" [description]="descriptionTemplate" [icon]="iconTemplate"></tri-step>
      <tri-step [title]="titleTemplate" [description]="descriptionTemplate" [icon]="iconTemplate"></tri-step>
      <tri-step [title]="titleTemplate" [description]="descriptionTemplate" [icon]="iconTemplate"></tri-step>
    </tri-steps>
    <ng-template #titleTemplate>titleTemplate</ng-template>
    <ng-template #descriptionTemplate>descriptionTemplate</ng-template>
    <ng-template #iconTemplate><tri-icon type="smile-o" /></ng-template>
  `
})
export class TriTestInnerStepTemplateComponent {}

@Component({
  imports: [TriStepsModule],
  template: `
    <tri-steps>
      @for (step of steps; track step) {
        <tri-step></tri-step>
      }
    </tri-steps>
  `
})
export class TriTestStepForComponent {
  steps = [1, 2, 3];
  updateSteps(): void {
    this.steps.push(4);
  }
}

@Component({
  imports: [TriStepsModule],
  template: `
    <tri-steps [current]="1">
      @for (step of steps; track step) {
        <tri-step></tri-step>
      }
    </tri-steps>
  `
})
export class TriTestStepAsyncComponent implements OnInit {
  steps: number[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.steps = [1, 2, 3];
    }, 1000);
  }
}

@Component({
  imports: [BidiModule, TriTestOuterStepsComponent],
  template: `<tri-test-outer-steps [dir]="direction"></tri-test-outer-steps>`
})
export class TriTestOuterStepsRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
