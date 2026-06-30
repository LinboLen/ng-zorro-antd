/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ApplicationRef, Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import { testDirectionality } from 'ng-zorro-antd/core/testing';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';
import { TRI_SPACE_COMPACT_SIZE } from 'ng-zorro-antd/space';

import { TriButtonComponent, TriButtonModule, TriButtonShape, TriButtonSize, TriButtonType } from './index';

describe('button', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  describe('className', () => {
    let fixture: ComponentFixture<TestButtonComponent>;
    let component: TestButtonComponent;
    let buttonElement: HTMLButtonElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonComponent);
      component = fixture.componentInstance;
      buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    });

    it('should apply classname', () => {
      expect(buttonElement.className).toBe('ant-btn');
    });

    it('should apply classname based on nzDanger', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-dangerous');
      component.danger.set(true);
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-dangerous');
    });

    it('should apply classname based on nzGhost', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-background-ghost');
      component.ghost.set(true);
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-background-ghost');
    });

    it('should apply classname based on nzLoading', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-loading');
      component.loading.set(true);
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-loading');
    });

    it('should apply classname based on nzBlock', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-block');
      component.block.set(true);
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-block');
    });

    it('should apply classname based on nzType', () => {
      component.type.set('default');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-default');
      component.type.set('primary');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-primary');
      component.type.set('link');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-link');
      component.type.set('dashed');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-dashed');
      component.type.set(null);
      fixture.detectChanges();
      expect(buttonElement.className).toBe('ant-btn');
    });

    it('should apply classname based on nzShape', () => {
      component.shape.set('round');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-round');
      component.shape.set('circle');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-circle');
    });

    it('should apply classname based on nzSize', () => {
      component.size.set('large');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-lg');
      component.size.set('small');
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-sm');
      component.size.set('default');
      fixture.detectChanges();
      expect(buttonElement.className).toBe('ant-btn');
    });
  });

  describe('loading icon', () => {
    let fixture: ComponentFixture<TestButtonBindingComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonBindingComponent);
    });

    it('should hide icon when loading correct', () => {
      vi.useFakeTimers();
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      expect(buttonElement.classList.contains('ant-btn-loading')).toBe(false);
      expect(buttonElement.classList).not.toContain('ant-btn-icon-only');
      expect(buttonElement.firstElementChild.querySelector('svg')).not.toBe(null);
      expect(buttonElement.firstElementChild!.classList.contains('anticon-poweroff')).toBe(true);
      expect(buttonElement.firstElementChild!.classList.contains('anticon-loading')).toBe(false);
      buttonElement.click();
      fixture.detectChanges();
      expect(buttonElement.classList.contains('ant-btn-loading')).toBe(true);
      expect(buttonElement.firstElementChild!.classList.contains('ant-btn-loading-icon')).toBe(true);
      expect(buttonElement.querySelector('.anticon-poweroff').style.cssText).toBe('display: none;');
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(buttonElement.classList.contains('ant-btn-loading')).toBe(false);
      expect(buttonElement.firstElementChild!.classList.contains('ant-btn-loading-icon')).toBe(false);
      expect(buttonElement.querySelector('.anticon-poweroff').style.cssText).toBe('');
      vi.useRealTimers();
    });
  });

  describe('insert span', () => {
    let fixture: ComponentFixture<TestButtonWithIconComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonWithIconComponent);
    });

    it('should insert span correctly', () => {
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.detectChanges();
      expect(buttonElement.firstElementChild.tagName).toBe('SPAN');
      expect(buttonElement.firstElementChild.innerText).toContain('text');
    });
  });

  describe('icon only', () => {
    it('should icon only works correctly', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly with any tag', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithAnyTagComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly with any comments', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithCommentComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly with any text', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithTextComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).not.toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly without nz-icon', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithoutIconComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).not.toContain('ant-btn-icon-only');
    });

    it('should icon only loading works correctly', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyLoadingComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });
  });

  testDirectionality(() => TestButtonComponent, By.directive(TriButtonComponent), 'ant-btn');

  describe('change detection', () => {
    let fixture: ComponentFixture<TestButtonComponent>;
    let buttonElement: HTMLButtonElement;
    let component: TestButtonComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonComponent);
      buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      component = fixture.componentInstance;
    });

    it('should not trigger change detection when the button is clicked', () => {
      const appRef = TestBed.inject(ApplicationRef);
      const spy = vi.spyOn(appRef, 'tick');
      buttonElement.dispatchEvent(new MouseEvent('click'));
      buttonElement.dispatchEvent(new MouseEvent('click'));
      // Previously, it would've caused ApplicationRef.tick to be called twice.
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('prevent default and stop propagation when the button state is loading', () => {
      component.loading.set(true);
      fixture.detectChanges();
      const event = new MouseEvent('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      const stopImmediatePropagationSpy = vi.spyOn(event, 'stopImmediatePropagation');
      buttonElement.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopImmediatePropagationSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('anchor', () => {
  let fixture: ComponentFixture<TestAnchorComponent>;
  let anchorElement: HTMLAnchorElement;
  let component: TestAnchorComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAnchorComponent);
    anchorElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    component = fixture.componentInstance;
  });

  it('should prevent default and stop propagation when the anchor is disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    const event = new MouseEvent('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    const stopImmediatePropagationSpy = vi.spyOn(event, 'stopImmediatePropagation');
    anchorElement.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(stopImmediatePropagationSpy).toHaveBeenCalledTimes(1);
  });
});

describe('finalSize', () => {
  let fixture: ComponentFixture<TestButtonFinalSizeComponent>;
  let buttonElement: HTMLButtonElement;
  let compactSizeSignal: WritableSignal<TriSizeLDSType>;
  let formSizeSignal: WritableSignal<TriSizeLDSType>;

  beforeEach(() => {
    compactSizeSignal = signal<TriSizeLDSType>('large');
    formSizeSignal = signal<TriSizeLDSType>('default');
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should set correctly the size from the formSize signal', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TRI_FORM_SIZE, useValue: formSizeSignal },
        { provide: TRI_SPACE_COMPACT_SIZE, useValue: compactSizeSignal }
      ]
    });
    fixture = TestBed.createComponent(TestButtonFinalSizeComponent);
    buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('large');
    fixture.detectChanges();
    expect(buttonElement.classList).toContain('ant-btn-lg');
  });
  it('should set correctly the size from the compactSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_SPACE_COMPACT_SIZE, useValue: compactSizeSignal }]
    });
    fixture = TestBed.createComponent(TestButtonFinalSizeComponent);
    buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    fixture.detectChanges();
    expect(buttonElement.classList).toContain('ant-btn-lg');
  });
  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TestButtonFinalSizeComponent);
    buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    fixture.componentInstance.size.set('large');
    fixture.detectChanges();
    expect(buttonElement.classList).toContain('ant-btn-lg');
  });
});

@Component({
  imports: [TriButtonModule],
  template: `
    <button
      tri-button
      [type]="type()"
      [ghost]="ghost()"
      [loading]="loading()"
      [danger]="danger()"
      [shape]="shape()"
      [block]="block()"
      [size]="size()"
    >
      button
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonComponent {
  readonly block = signal(false);
  readonly ghost = signal(false);
  readonly loading = signal(false);
  readonly danger = signal(false);
  readonly type = signal<TriButtonType>(null);
  readonly shape = signal<TriButtonShape>(null);
  readonly size = signal<TriButtonSize>('default');
}

// https://github.com/NG-ZORRO/ng-zorro-antd/issues/2191
@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button type="primary" (click)="load()" [loading]="loading()">
      <tri-icon type="poweroff" />
      {{ 'Click me!' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonBindingComponent {
  readonly loading = signal(false);
  load(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1000);
  }
}

// https://github.com/NG-ZORRO/ng-zorro-antd/issues/3079
@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      text
      <tri-icon type="caret-down" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonWithIconComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <tri-icon type="caret-down" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonIconOnlyComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <u tri-icon type="up"></u>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonIconOnlyWithAnyTagComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <tri-icon type="down" />
      <!-- comment -->
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonIconOnlyWithCommentComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <tri-icon type="down" />
      text
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonIconOnlyWithTextComponent {}

@Component({
  imports: [TriButtonModule],
  template: `
    <button tri-button>
      <span>text</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonIconOnlyWithoutIconComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button loading>
      <tri-icon type="caret-down" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestButtonIconOnlyLoadingComponent {}

@Component({
  imports: [TriButtonModule],
  template: '<a tri-button [disabled]="disabled()">anchor</a>'
})
export class TestAnchorComponent {
  readonly disabled = signal(false);
}

@Component({
  imports: [TriButtonModule],
  template: ` <button tri-button [size]="size()">Button</button> `
})
export class TestButtonFinalSizeComponent {
  readonly size = signal<TriButtonSize>('default');
}
