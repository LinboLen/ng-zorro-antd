/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  testDirectionality,
  updateNonSignalsInput
} from 'ng-zorro-antd/core/testing';

import { TriRateComponent } from './rate.component';
import { TriRateModule } from './rate.module';

describe('rate', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<TriTestRateBasicComponent>;
    let testComponent: TriTestRateBasicComponent;
    let rate: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRateBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      rate = fixture.debugElement.query(By.directive(TriRateComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate');
    });

    it('should set ngModel work', async () => {
      fixture.detectChanges();
      const children = Array.prototype.slice.call(rate.nativeElement.firstElementChild.children) as HTMLElement[];
      expect(children.every(item => item.classList.contains('ant-rate-star-zero'))).toBe(true);
      testComponent.value.set(5);
      await stabilize(fixture);
      expect(children.every(item => item.classList.contains('ant-rate-star-full'))).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });

    it('should click work', () => {
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    });

    it('should allow half work', async () => {
      testComponent.allowHalf.set(false);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      testComponent.value.set(3.5);
      await stabilize(fixture);
      expect(rate.nativeElement.firstElementChild.children[3].classList).toContain('ant-rate-star-full');
      expect(rate.nativeElement.firstElementChild.children[4].classList).toContain('ant-rate-star-zero');

      testComponent.allowHalf.set(true);
      testComponent.value.set(0);
      await stabilize(fixture);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.children[1].click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(3.5);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    });

    it('should allow clear work', () => {
      testComponent.allowClear.set(false);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(4);
      testComponent.allowClear.set(true);
      fixture.detectChanges();
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
    });

    it('should disable work', () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });

    it('should count work', () => {
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild.children.length).toBe(5);
      expect(testComponent.value()).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.value()).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      testComponent.count.set(10);
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild.children.length).toBe(10);
      expect(testComponent.value()).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    });

    it('should autofocus work', () => {
      fixture.detectChanges();
      testComponent.autoFocus.set(true);
      fixture.detectChanges();
      expect(rate.nativeElement.querySelector('ul').attributes.getNamedItem('autofocus').name).toBe('autofocus');
      testComponent.autoFocus.set(false);
      fixture.detectChanges();
      expect(rate.nativeElement.querySelector('ul').attributes.getNamedItem('autofocus')).toBe(null);
    });

    it('should focus and blur function work', () => {
      fixture.detectChanges();
      const rateElement = rate.nativeElement.querySelector('ul') as HTMLElement;
      vi.spyOn(rateElement, 'focus');
      vi.spyOn(rateElement, 'blur');
      testComponent.rateComponent.focus();
      expect(rateElement.focus).toHaveBeenCalledTimes(1);
      testComponent.rateComponent.blur();
      expect(rateElement.blur).toHaveBeenCalledTimes(1);
    });

    it('should hover rate work', () => {
      fixture.detectChanges();
      dispatchFakeEvent(
        rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild,
        'mouseover'
      );
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild.children[3].classList).toContain('ant-rate-star-full');
      expect(testComponent.onHoverChange).toHaveBeenCalledWith(4);
      expect(testComponent.onHoverChange).toHaveBeenCalledTimes(1);
      dispatchFakeEvent(rate.nativeElement.firstElementChild.children[3].firstElementChild, 'mouseover');
      fixture.detectChanges();
      expect(testComponent.onHoverChange).toHaveBeenCalledTimes(1);
      dispatchFakeEvent(rate.nativeElement.firstElementChild, 'mouseleave');
      fixture.detectChanges();
      expect(testComponent.onHoverChange).toHaveBeenCalledTimes(2);
      expect(rate.nativeElement.firstElementChild.children[3].classList).toContain('ant-rate-star-zero');
      testComponent.disabled.set(true);
      fixture.detectChanges();
      dispatchFakeEvent(rate.nativeElement.firstElementChild.children[2].firstElementChild, 'mouseover');
      expect(testComponent.onHoverChange).toHaveBeenCalledTimes(2);
    });

    it('should keydown work', () => {
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(1);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(2);
      testComponent.allowHalf.set(true);
      fixture.detectChanges();
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0.5);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(3);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(4);
    });

    it('should right keydown not dispatch change reached limit', async () => {
      testComponent.value.set(5);
      await stabilize(fixture);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value()).toBe(5);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });
  });

  describe('form', () => {
    let fixture: ComponentFixture<TriTestRateFormComponent>;
    let testComponent: TriTestRateFormComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRateFormComponent);
      testComponent = fixture.componentInstance;
    });

    it('should be in pristine, untouched, and valid states and enable initially', async () => {
      await stabilize(fixture);
      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
      expect(rate.nativeElement.firstElementChild!.classList).not.toContain('ant-rate-disabled');
    });

    it('should be disable if form is enable and nzDisable set to true initially', async () => {
      testComponent.disabled.set(true);
      await stabilize(fixture);
      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
    });

    it('should be disable if form is disable and nzDisable set to false initially', async () => {
      testComponent.disable();
      await stabilize(fixture);
      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
    });

    it('should set disabled work', async () => {
      testComponent.disabled.set(true);
      await stabilize(fixture);

      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
      expect(testComponent.formControl.value).toBe(1);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(1);

      testComponent.enable();
      await stabilize(fixture);
      expect(rate.nativeElement.firstElementChild!.classList).not.toContain('ant-rate-disabled');
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(4);

      testComponent.disable();
      await stabilize(fixture);
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(4);
    });
  });

  testDirectionality(() => TriTestRateBasicComponent, By.css('.ant-rate'), 'ant-rate');

  describe('character', () => {
    let fixture: ComponentFixture<TriTestRateCharacterComponent>;
    let rate: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRateCharacterComponent);
      fixture.detectChanges();
      rate = fixture.debugElement.query(By.directive(TriRateComponent));
    });

    it('should nzCharacter work', () => {
      fixture.detectChanges();
      const children = Array.prototype.slice.call(rate.nativeElement.firstElementChild.children) as HTMLElement[];
      children.forEach((e, index) => {
        expect(e.querySelector('.ant-rate-star-first')!.textContent).toContain(`${index + 1}`);
        expect(e.querySelector('.ant-rate-star-second')!.textContent).toContain(`${index + 1}`);
      });
    });
  });
});

async function stabilize<T>(fixture: ComponentFixture<T>): Promise<void> {
  await updateNonSignalsInput(fixture);
}

@Component({
  selector: 'tri-test-rate',
  imports: [FormsModule, TriRateModule],
  template: `
    <tri-rate
      [(ngModel)]="value"
      (ngModelChange)="modelChange($event)"
      (onBlur)="onBlur($event)"
      (onFocus)="onFocus($event)"
      (onHoverChange)="onHoverChange($event)"
      (onKeyDown)="onKeyDown($event)"
      [count]="count()"
      [allowHalf]="allowHalf()"
      [allowClear]="allowClear()"
      [disabled]="disabled()"
      [autoFocus]="autoFocus()"
    />
  `
})
export class TriTestRateBasicComponent {
  @ViewChild(TriRateComponent, { static: false }) rateComponent!: TriRateComponent;
  readonly count = signal(5);
  readonly autoFocus = signal(false);
  readonly allowHalf = signal(false);
  readonly allowClear = signal(false);
  readonly disabled = signal(false);
  readonly value = signal(0);
  modelChange = vi.fn();
  onBlur = vi.fn();
  onFocus = vi.fn();
  onHoverChange = vi.fn();
  onKeyDown = vi.fn();
}

@Component({
  imports: [ReactiveFormsModule, TriRateModule],
  selector: 'tri-test-rate-form',
  template: `
    <form>
      <tri-rate [formControl]="formControl" [disabled]="disabled()" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestRateFormComponent {
  formControl = new FormControl(1);

  readonly disabled = signal(false);

  disable(): void {
    this.formControl.disable();
  }

  enable(): void {
    this.formControl.enable();
  }
}

@Component({
  selector: 'tri-test-rate-character',
  imports: [FormsModule, TriRateModule],
  template: `
    <tri-rate [(ngModel)]="value" [character]="characterTpl" />
    <ng-template #characterTpl let-index>
      {{ index + 1 }}
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestRateCharacterComponent {
  @ViewChild(TriRateComponent, { static: false }) rateComponent!: TriRateComponent;
  value = 5;
}
