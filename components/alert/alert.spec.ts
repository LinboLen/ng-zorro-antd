/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { ChangeDetectorRef, Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { TriConfigService } from 'ng-zorro-antd/core/config';
import { updateNonSignalsInput } from 'ng-zorro-antd/core/testing';
import type { TriSafeAny } from 'ng-zorro-antd/core/types';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriAlertComponent, TriAlertType } from './alert.component';
import { TriAlertModule } from './alert.module';

describe('alert', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNoopAnimations()]
    });
  });

  describe('basic alert', () => {
    let fixture: ComponentFixture<TriDemoTestBasicComponent>;
    let testComponent: TriDemoTestBasicComponent;
    let alert: DebugElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriDemoTestBasicComponent);
      testComponent = fixture.debugElement.componentInstance;
      alert = fixture.debugElement.query(By.directive(TriAlertComponent));
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });

    it('should className correct', () => {
      expect(alert.nativeElement.firstElementChild!.classList).toContain('ant-alert');
    });

    it('should banner work', async () => {
      expect(alert.nativeElement.firstElementChild!.classList).not.toContain('ant-alert-banner');
      expect(alert.nativeElement.querySelector('.ant-alert').classList).toContain(`ant-alert-info`);
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeNull();
      testComponent.banner = true;
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.firstElementChild!.classList).toContain('ant-alert-banner');
      expect(alert.nativeElement.querySelector('.ant-alert').classList).toContain(`ant-alert-info`);
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeNull();
    });

    it('should closeable work', async () => {
      testComponent.closeable = true;
      await updateNonSignalsInput(fixture);
      expect(testComponent.onClose).toHaveBeenCalledTimes(0);
      expect(alert.nativeElement.querySelector('.anticon-close')).toBeDefined();
      alert.nativeElement.querySelector('.ant-alert-close-icon').click();
      await fixture.whenStable();
      alert = fixture.debugElement.query(By.directive(TriAlertComponent));
      expect(alert.nativeElement.innerText).toBe('');
      expect(testComponent.onClose).toHaveBeenCalledTimes(1);
    });

    it('should closeText work', async () => {
      expect(alert.nativeElement.querySelector('.ant-alert-close-icon')).toBeNull();
      testComponent.closeText = 'closeText';
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-close-icon').innerText).toBe('closeText');
      testComponent.closeText = testComponent.template;
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-close-icon').innerText).toBe('template');
    });

    it('should description work', async () => {
      expect(alert.nativeElement.querySelector('.ant-alert-description').innerText).toBe('description');
      testComponent.description = testComponent.template;
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-description').innerText).toBe('template');
    });

    it('should message work', async () => {
      expect(alert.nativeElement.querySelector('.ant-alert-message').innerText).toBe('message');
      testComponent.message = testComponent.template;
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-message').innerText).toBe('template');
    });

    it('should showIcon work', async () => {
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeNull();
      testComponent.showIcon = true;
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeDefined();
    });

    it('should iconType work', async () => {
      testComponent.showIcon = true;
      testComponent.iconType = 'lock';
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-icon').firstElementChild.classList).toContain('anticon');
      expect(alert.nativeElement.querySelector('.ant-alert-icon').firstElementChild.classList).toContain(
        'anticon-lock'
      );
    });

    it('should type work', async () => {
      const listOfType: TriAlertType[] = ['success', 'info', 'warning', 'error'];
      for (const type of listOfType) {
        testComponent.type = type;
        await updateNonSignalsInput(fixture);
        expect(alert.nativeElement.querySelector('.ant-alert').classList).toContain(`ant-alert-${type}`);
      }
    });

    it('should action work', async () => {
      testComponent.action = testComponent.template;
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-action').classList).not.toBeNull();
    });
  });

  describe('banner alert', () => {
    let fixture: ComponentFixture<TriDemoTestBannerComponent>;
    let alert: DebugElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriDemoTestBannerComponent);
      alert = fixture.debugElement.query(By.directive(TriAlertComponent));
      fixture.autoDetectChanges();
    });

    it('should banner work', async () => {
      await fixture.whenStable();
      expect(alert.nativeElement.querySelector('.ant-alert').classList).toContain(`ant-alert-warning`);
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeDefined();
    });
  });

  describe('RTL', () => {
    it('should className correct on dir change', async () => {
      const fixture = TestBed.createComponent(TriTestAlertRtlComponent);
      const alert = fixture.debugElement.query(By.directive(TriAlertComponent));
      await fixture.whenStable();
      expect(alert.nativeElement.firstElementChild!.classList).toContain('ant-alert-rtl');

      fixture.componentInstance.direction = 'ltr';
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.firstElementChild!.classList).not.toContain('ant-alert-rtl');
    });
  });

  describe('custom icon', () => {
    it('should custom icon work', async () => {
      const fixture = TestBed.createComponent(TriTestAlertCustomIconComponent);
      const alert = fixture.debugElement.query(By.directive(TriAlertComponent));
      await fixture.whenStable();
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeDefined();
      expect(alert.nativeElement.querySelector('.ant-alert-icon').firstElementChild).not.toContain('anticon');
    });
  });
});

@Component({
  imports: [TriAlertModule],
  selector: 'tri-test-basic-alert',
  template: `
    <ng-template #template>template</ng-template>
    <tri-alert
      [banner]="banner"
      [closeable]="closeable"
      [closeText]="closeText"
      [description]="description"
      [message]="message"
      [showIcon]="showIcon"
      [iconType]="iconType"
      [type]="type"
      [action]="action"
      (onClose)="onClose($event)"
    />
  `
})
export class TriDemoTestBasicComponent {
  @ViewChild('template', { static: false }) template!: TemplateRef<void>;
  action: string | TemplateRef<void> | null = null;
  banner = false;
  closeable = false;
  closeText: string | TemplateRef<void> | null = null;
  description: string | TemplateRef<void> = 'description';
  message: string | TemplateRef<void> = 'message';
  showIcon = false;
  iconType: string | null = null;
  type: TriAlertType = 'info';
  onClose = jasmine.createSpy('close callback');
}

@Component({
  imports: [TriAlertModule],
  template: `<tri-alert banner />`
})
export class TriDemoTestBannerComponent {}

@Component({
  imports: [TriDemoTestBasicComponent, BidiModule],
  template: `
    <div [dir]="direction">
      <tri-test-basic-alert />
    </div>
  `
})
export class TriTestAlertRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  imports: [TriAlertModule],
  template: `
    <tri-alert
      type="success"
      message="Success Tips"
      description="Detailed description and advices about successful copywriting."
      [icon]="customIconTemplate"
      showIcon
    />

    <ng-template #customIconTemplate>
      <div> S </div>
    </ng-template>
  `
})
export class TriTestAlertCustomIconComponent {}

describe('NzAlertComponent', () => {
  let component: TriAlertComponent;
  let fixture: ComponentFixture<TriAlertComponent>;
  let cdr: ChangeDetectorRef;
  let configChangeEvent$: Subject<string>;

  beforeEach(() => {
    configChangeEvent$ = new Subject<string>();
    const nzConfigServiceSpy = jasmine.createSpyObj('NzConfigService', {
      getConfigChangeEventForComponent: configChangeEvent$.asObservable(),
      getConfigForComponent: {}
    });

    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        { provide: TriConfigService, useValue: nzConfigServiceSpy },
        {
          provide: ChangeDetectorRef,
          useValue: jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges'])
        }
      ]
    });

    fixture = TestBed.createComponent(TriAlertComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
    cdr.markForCheck();
  });

  it('should set iconTheme based on nzDescription', () => {
    component.description = 'Test Description';

    component.ngOnChanges({
      nzDescription: {
        currentValue: 'Test Description',
        firstChange: true,
        isFirstChange: () => true,
        previousValue: undefined
      }
    });

    expect(component.iconTheme).toBe('outline');

    component.description = null;
    component.ngOnChanges({
      nzDescription: {
        currentValue: null,
        firstChange: false,
        isFirstChange: () => false,
        previousValue: 'Test Description'
      }
    });

    expect(component.iconTheme).toBe('fill');
  });

  it('should call cdr.markForCheck on config change event', async () => {
    fixture.detectChanges();
    spyOn(cdr, 'markForCheck');

    configChangeEvent$.next('alert');
    await fixture.whenStable();
    expect(cdr.markForCheck).toHaveBeenCalled();
  });
});

describe('NzAlertComponent Animation', () => {
  let component: TriAlertComponent;
  let fixture: ComponentFixture<TriAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()],
      animationsEnabled: true
    });

    fixture = TestBed.createComponent(TriAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add animation classes and emit onClose when animation ends', () => {
    spyOn(component.onClose, 'emit');
    const element = fixture.nativeElement.querySelector('.ant-alert');
    const mockEvent = {
      target: element,
      animationComplete: jasmine.createSpy('animationComplete')
    } as TriSafeAny;

    component.onLeaveAnimationDone(mockEvent);

    expect(element.classList).toContain('ant-alert-motion-leave');
    expect(element.classList).toContain('ant-alert-motion-leave-active');
    expect(component.onClose.emit).not.toHaveBeenCalled();
    expect(mockEvent.animationComplete).not.toHaveBeenCalled();

    const transitionEndEvent = new Event('transitionend');
    element.dispatchEvent(transitionEndEvent);

    expect(component.onClose.emit).toHaveBeenCalledWith(true);
    expect(mockEvent.animationComplete).toHaveBeenCalled();
  });

  it('should handle no animation', () => {
    component.noAnimation = true;
    spyOn(component.onClose, 'emit');
    const element = fixture.nativeElement.querySelector('.ant-alert');
    const mockEvent = {
      target: element,
      animationComplete: jasmine.createSpy('animationComplete')
    } as TriSafeAny;

    component.onLeaveAnimationDone(mockEvent);

    expect(element.classList).not.toContain('ant-alert-motion-leave');
    expect(mockEvent.animationComplete).toHaveBeenCalled();
  });
});
