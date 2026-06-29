/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectorRef, Component, DebugElement, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { TriConfigService } from 'ng-zorro-antd/core/config';
import { testDirectionality, updateNonSignalsInput } from 'ng-zorro-antd/core/testing';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriAlertComponent, TriAlertType } from './alert.component';
import { TriAlertModule } from './alert.module';

describe('alert', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNzNoAnimation()]
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
      testComponent.banner.set(true);
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.firstElementChild!.classList).toContain('ant-alert-banner');
      expect(alert.nativeElement.querySelector('.ant-alert').classList).toContain(`ant-alert-info`);
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeNull();
    });

    it('should closeable work', async () => {
      testComponent.closeable.set(true);
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
      testComponent.closeText.set('closeText');
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-close-icon').innerText).toBe('closeText');
      testComponent.closeText.set(testComponent.template);
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-close-icon').innerText).toBe('template');
    });

    it('should description work', async () => {
      expect(alert.nativeElement.querySelector('.ant-alert-description').innerText).toBe('description');
      testComponent.description.set(testComponent.template);
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-description').innerText).toBe('template');
    });

    it('should message work', async () => {
      expect(alert.nativeElement.querySelector('.ant-alert-message').innerText).toBe('message');
      testComponent.message.set(testComponent.template);
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-message').innerText).toBe('template');
    });

    it('should showIcon work', async () => {
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeNull();
      testComponent.showIcon.set(true);
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeDefined();
    });

    it('should iconType work', async () => {
      testComponent.showIcon.set(true);
      testComponent.iconType.set('lock');
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-icon').firstElementChild.classList).toContain('anticon');
      expect(alert.nativeElement.querySelector('.ant-alert-icon').firstElementChild.classList).toContain(
        'anticon-lock'
      );
    });

    it('should type work', async () => {
      const listOfType: TriAlertType[] = ['success', 'info', 'warning', 'error'];
      for (const type of listOfType) {
        testComponent.type.set(type);
        await updateNonSignalsInput(fixture);
        expect(alert.nativeElement.querySelector('.ant-alert').classList).toContain(`ant-alert-${type}`);
      }
    });

    it('should action work', async () => {
      testComponent.action.set(testComponent.template);
      await updateNonSignalsInput(fixture);
      expect(alert.nativeElement.querySelector('.ant-alert-action').classList).not.toBeNull();
    });
  });

  describe('banner alert', () => {
    let fixture: ComponentFixture<TriDemoTestBannerComponent>;
    let alert: DebugElement;

    beforeEach(() => {
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

  describe('custom icon', () => {
    it('should custom icon work', async () => {
      const fixture = TestBed.createComponent(TriTestAlertCustomIconComponent);
      const alert = fixture.debugElement.query(By.directive(TriAlertComponent));
      await fixture.whenStable();
      expect(alert.nativeElement.querySelector('.ant-alert-icon')).toBeDefined();
      expect(alert.nativeElement.querySelector('.ant-alert-icon').firstElementChild.classList).not.toContain('anticon');
    });
  });

  testDirectionality(() => TriDemoTestBasicComponent, By.css('.ant-alert'), 'ant-alert');
});

@Component({
  imports: [TriAlertModule],
  selector: 'tri-test-basic-alert',
  template: `
    <ng-template #template>template</ng-template>
    <tri-alert
      [banner]="banner()"
      [closeable]="closeable()"
      [closeText]="closeText()"
      [description]="description()"
      [message]="message()"
      [showIcon]="showIcon()"
      [iconType]="iconType()"
      [type]="type()"
      [action]="action()"
      (onClose)="onClose($event)"
    />
  `
})
export class TriDemoTestBasicComponent {
  @ViewChild('template', { static: false }) template!: TemplateRef<void>;
  readonly action = signal<string | TemplateRef<void> | null>(null);
  readonly banner = signal(false);
  readonly closeable = signal(false);
  readonly closeText = signal<string | TemplateRef<void> | null>(null);
  readonly description = signal<string | TemplateRef<void>>('description');
  readonly message = signal<string | TemplateRef<void>>('message');
  readonly showIcon = signal(false);
  readonly iconType = signal<string | null>(null);
  readonly type = signal<TriAlertType>('info');
  onClose = vi.fn();
}

@Component({
  imports: [TriAlertModule],
  template: `<tri-alert banner />`
})
export class TriDemoTestBannerComponent {}

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
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestAlertCustomIconComponent {}

describe('NzAlertComponent', () => {
  let component: TriAlertComponent;
  let fixture: ComponentFixture<TriAlertComponent>;
  let cdr: ChangeDetectorRef;
  let configChangeEvent$: Subject<string>;

  beforeEach(() => {
    configChangeEvent$ = new Subject<string>();
    const nzConfigServiceSpy = {
      getConfigChangeEventForComponent: vi.fn().mockReturnValue(configChangeEvent$.asObservable()),
      getConfigForComponent: vi.fn().mockReturnValue({})
    };

    TestBed.configureTestingModule({
      providers: [
        provideNzNoAnimation(),
        { provide: TriConfigService, useValue: nzConfigServiceSpy },
        {
          provide: ChangeDetectorRef,
          useValue: {
            markForCheck: vi.fn(),
            detectChanges: vi.fn()
          }
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
    vi.spyOn(cdr, 'markForCheck');

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
    vi.spyOn(component.onClose, 'emit');
    const element = fixture.nativeElement.querySelector('.ant-alert');
    const mockEvent = {
      target: element,
      animationComplete: vi.fn()
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
    vi.spyOn(component.onClose, 'emit');
    const element = fixture.nativeElement.querySelector('.ant-alert');
    const mockEvent = {
      target: element,
      animationComplete: vi.fn()
    } as TriSafeAny;

    component.onLeaveAnimationDone(mockEvent);

    expect(element.classList).not.toContain('ant-alert-motion-leave');
    expect(mockEvent.animationComplete).toHaveBeenCalled();
  });
});
