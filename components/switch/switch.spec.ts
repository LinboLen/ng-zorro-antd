/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import {
  ApplicationRef,
  Component,
  DebugElement,
  signal,
  TemplateRef,
  ViewChild,
  type WritableSignal
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import {
  createKeyboardEvent,
  dispatchKeyboardEvent,
  testDirectionality,
  updateNonSignalsInput
} from 'ng-zorro-antd/core/testing';
import { TriSizeDSType, type TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriSwitchComponent } from './switch.component';
import { TriSwitchModule } from './switch.module';

describe('switch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  describe('basic switch', () => {
    let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
    let testComponent: TriTestSwitchBasicComponent;
    let switchElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(switchElement.nativeElement.firstElementChild!.classList).toContain('ant-switch');
    });

    it('should ngModel work', async () => {
      fixture.detectChanges();
      expect(switchElement.nativeElement.firstElementChild!.classList).not.toContain('ant-switch-checked');
      expect(testComponent.value()).toBe(false);
      testComponent.value.set(true);
      await stabilize(fixture);
      expect(switchElement.nativeElement.firstElementChild!.classList).toContain('ant-switch-checked');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });

    it('should click work', () => {
      const switchButton = switchElement.nativeElement.firstElementChild! as HTMLButtonElement;
      expect(testComponent.value()).toBe(false);
      switchButton.click();
      expect(testComponent.value()).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      switchButton.click();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(2);
      testComponent.control.set(true);
      fixture.detectChanges();
      switchButton.click();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(2);
    });

    it('should disable work', () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      (switchElement.nativeElement.firstElementChild! as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });

    it('should loading work', () => {
      testComponent.loading.set(true);
      fixture.detectChanges();
      expect(switchElement.nativeElement.firstElementChild!.classList).toContain('ant-switch-loading');
      expect(testComponent.value()).toBe(false);
      (switchElement.nativeElement.firstElementChild! as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });

    it('should size work', () => {
      testComponent.size.set('small');
      fixture.detectChanges();
      expect(switchElement.nativeElement.firstElementChild!.classList).toContain('ant-switch-small');
    });

    it('should key down work', () => {
      expect(testComponent.value()).toBe(false);
      switchElement.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      expect(testComponent.value()).toBe(true);

      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);

      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(2);

      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(2);

      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', SPACE);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(3);

      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', ENTER);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(4);

      testComponent.control.set(true);
      fixture.detectChanges();
      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', ENTER);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(4);

      testComponent.control.set(false);
      testComponent.loading.set(true);
      fixture.detectChanges();
      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', ENTER);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(4);

      testComponent.control.set(false);
      testComponent.loading.set(false);
      testComponent.disabled.set(true);
      fixture.detectChanges();
      dispatchKeyboardEvent(switchElement.nativeElement.firstElementChild, 'keydown', ENTER);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(4);
    });

    it('should children work', () => {
      fixture.detectChanges();
      expect(switchElement.nativeElement.querySelector('.ant-switch-inner').innerText).toBe('off');
      (switchElement.nativeElement.firstElementChild! as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(switchElement.nativeElement.querySelector('.ant-switch-inner').innerText).toBe('on');
    });

    it('should focus and blur function work', () => {
      fixture.detectChanges();
      const buttonElement = switchElement.nativeElement.firstElementChild as HTMLElement;
      vi.spyOn(buttonElement, 'focus');
      vi.spyOn(buttonElement, 'blur');
      testComponent.switchComponent.focus();
      expect(buttonElement.focus).toHaveBeenCalledTimes(1);
      testComponent.switchComponent.blur();
      expect(buttonElement.blur).toHaveBeenCalledTimes(1);
    });

    describe('change detection behavior', () => {
      it('should not run change detection on `click` events if the switch is disabled', () => {
        testComponent.disabled.set(true);
        fixture.detectChanges();

        const appRef = TestBed.inject(ApplicationRef);
        const event = new MouseEvent('click');

        vi.spyOn(appRef, 'tick');
        vi.spyOn(event, 'preventDefault');

        switchElement.nativeElement.dispatchEvent(event);

        expect(appRef.tick).not.toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not run change detection on `keydown` events if the switch is disabled', () => {
        testComponent.disabled.set(true);
        fixture.detectChanges();

        const switchButton = switchElement.nativeElement.querySelector('.ant-switch');
        const appRef = TestBed.inject(ApplicationRef);
        const event = new KeyboardEvent('keydown', {
          keyCode: SPACE
        });

        vi.spyOn(appRef, 'tick');
        vi.spyOn(event, 'preventDefault');

        switchButton.dispatchEvent(event);

        expect(appRef.tick).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();

        testComponent.disabled.set(false);
        fixture.detectChanges();

        const enabledEvent = createKeyboardEvent('keydown', SPACE);
        vi.spyOn(enabledEvent, 'preventDefault');
        switchButton.dispatchEvent(enabledEvent);

        expect(enabledEvent.preventDefault).toHaveBeenCalled();
      });
    });
  });

  describe('template switch', () => {
    let fixture: ComponentFixture<TriTestSwitchTemplateComponent>;
    let switchElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestSwitchTemplateComponent);
      fixture.detectChanges();
      switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent));
    });

    it('should children template work', () => {
      fixture.detectChanges();
      expect(switchElement.nativeElement.querySelector('.ant-switch-inner').firstElementChild!.classList).toContain(
        'anticon-close'
      );
      (switchElement.nativeElement.firstElementChild! as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(switchElement.nativeElement.querySelector('.ant-switch-inner').firstElementChild!.classList).toContain(
        'anticon-check'
      );
    });
  });

  describe('switch form', () => {
    let fixture: ComponentFixture<TriTestSwitchFormComponent>;
    let testComponent: TriTestSwitchFormComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestSwitchFormComponent);
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should be in pristine, untouched, and valid states and enable initially', async () => {
      await stabilize(fixture);
      const switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent));
      const buttonElement = switchElement.nativeElement.firstElementChild! as HTMLButtonElement;
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
      expect(buttonElement.disabled).toBeFalsy();
      expect(buttonElement.classList).not.toContain('ant-switch-disabled');
    });

    it('should be disable if form is disable and nzDisable set to false initially', async () => {
      testComponent.disable();
      await stabilize(fixture);
      const switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent));
      const buttonElement = switchElement.nativeElement.firstElementChild! as HTMLButtonElement;
      expect(buttonElement.disabled).toBeTruthy();
      expect(buttonElement.classList).toContain('ant-switch-disabled');
    });

    it('should set disabled work', async () => {
      testComponent.disabled.set(true);
      await stabilize(fixture);
      const switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent));
      const buttonElement = switchElement.nativeElement.firstElementChild! as HTMLButtonElement;

      expect(buttonElement.disabled).toBeTruthy();
      expect(buttonElement.classList).toContain('ant-switch-disabled');
      expect(testComponent.formControl.value).toBe(true);

      switchElement.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(true);

      testComponent.enable();
      await stabilize(fixture);
      expect(buttonElement.disabled).toBeFalsy();
      expect(buttonElement.classList).not.toContain('ant-switch-disabled');
      switchElement.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(false);

      testComponent.disable();
      await stabilize(fixture);
      expect(buttonElement.disabled).toBeTruthy();
      expect(buttonElement.classList).toContain('ant-switch-disabled');
      switchElement.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(false);
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });
  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size = 'small';
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  testDirectionality(() => TriTestSwitchBasicComponent, By.css('.ant-switch'), 'ant-switch');
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TriTestSwitchBasicComponent>;
  let switchElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeDSType>('default');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TriTestSwitchBasicComponent);
    switchElement = fixture.debugElement.query(By.directive(TriSwitchComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();
    expect(switchElement.firstElementChild!.classList).toContain('ant-switch-small');
  });
});

async function stabilize<T>(fixture: ComponentFixture<T>): Promise<void> {
  fixture.detectChanges();
  await updateNonSignalsInput(fixture);
  fixture.detectChanges();
}

@Component({
  imports: [FormsModule, TriIconModule, TriSwitchModule],
  template: `
    <ng-template #checkedChildrenTemplate><tri-icon type="check" /></ng-template>
    <ng-template #unCheckedChildrenTemplate><tri-icon type="closs" /></ng-template>
    <tri-switch
      [(ngModel)]="value"
      (ngModelChange)="modelChange($event)"
      [disabled]="disabled()"
      [loading]="loading()"
      [size]="size()"
      [control]="control()"
      [checkedChildren]="checkedChildren"
      [unCheckedChildren]="unCheckedChildren"
    />
  `
})
export class TriTestSwitchBasicComponent {
  @ViewChild(TriSwitchComponent, { static: false }) switchComponent!: TriSwitchComponent;
  @ViewChild('checkedChildrenTemplate', { static: false }) checkedChildrenTemplate!: TemplateRef<void>;
  @ViewChild('unCheckedChildrenTemplate', { static: false }) unCheckedChildrenTemplate!: TemplateRef<void>;
  checkedChildren = 'on';
  unCheckedChildren = 'off';
  readonly value = signal(false);
  readonly control = signal(false);
  readonly disabled = signal(false);
  readonly size = signal<TriSizeDSType>('default');
  readonly loading = signal(false);
  modelChange = vi.fn();
}

@Component({
  imports: [TriIconModule, TriSwitchModule],
  template: `
    <ng-template #checkedChildrenTemplate><tri-icon type="check" /></ng-template>
    <ng-template #unCheckedChildrenTemplate><tri-icon type="close" /></ng-template>
    <tri-switch [checkedChildren]="checkedChildrenTemplate" [unCheckedChildren]="unCheckedChildrenTemplate" />
  `
})
export class TriTestSwitchTemplateComponent {}

@Component({
  imports: [ReactiveFormsModule, TriSwitchModule],
  selector: 'tri-test-switch-form',
  template: `
    <form>
      <tri-switch [formControl]="formControl" [disabled]="disabled()" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestSwitchFormComponent {
  formControl = new FormControl(true);

  readonly disabled = signal(false);

  disable(): void {
    this.formControl.disable();
  }

  enable(): void {
    this.formControl.enable();
  }
}
