/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { dispatchFakeEvent, dispatchKeyboardEvent } from 'ng-zorro-antd/core/testing';

import { TriRateComponent } from './rate.component';
import { TriRateModule } from './rate.module';

describe('rate', () => {
  describe('basic rate', () => {
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
    it('should set ngModel work', fakeAsync(() => {
      fixture.detectChanges();
      const children = Array.prototype.slice.call(rate.nativeElement.firstElementChild.children);
      expect(children.every((item: HTMLElement) => item.classList.contains('ant-rate-star-zero'))).toBe(true);
      testComponent.value = 5;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(children.every((item: HTMLElement) => item.classList.contains('ant-rate-star-full'))).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    }));
    it('should click work', fakeAsync(() => {
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    }));
    it('should allow half work', fakeAsync(() => {
      testComponent.allowHalf = false;
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      testComponent.value = 3.5;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild.children[3].classList).toContain('ant-rate-star-full');
      expect(rate.nativeElement.firstElementChild.children[4].classList).toContain('ant-rate-star-zero');
      flush();

      testComponent.allowHalf = true;
      testComponent.value = 0;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      rate.nativeElement.firstElementChild.children[3].firstElementChild.children[1].click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe(3.5);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    }));
    it('should allow clear work', fakeAsync(() => {
      testComponent.allowClear = false;
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      testComponent.allowClear = true;
      fixture.detectChanges();
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(2);
    }));
    it('should disable work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    }));
    it('should count work', fakeAsync(() => {
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild.children.length).toBe(5);
      expect(testComponent.value).toBe(0);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      testComponent.count = 10;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild.children.length).toBe(10);
      expect(testComponent.value).toBe(4);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    }));
    it('should autofocus work', () => {
      fixture.detectChanges();
      testComponent.autoFocus = true;
      fixture.detectChanges();
      expect(rate.nativeElement.querySelector('ul').attributes.getNamedItem('autofocus').name).toBe('autofocus');
      testComponent.autoFocus = false;
      fixture.detectChanges();
      expect(rate.nativeElement.querySelector('ul').attributes.getNamedItem('autofocus')).toBe(null);
    });
    it('should focus and blur function work', () => {
      fixture.detectChanges();
      expect(rate.nativeElement.querySelector('ul') === document.activeElement).toBe(false);
      testComponent.rateComponent.focus();
      fixture.detectChanges();
      expect(rate.nativeElement.querySelector('ul') === document.activeElement).toBe(true);
      testComponent.rateComponent.blur();
      fixture.detectChanges();
      expect(rate.nativeElement.querySelector('ul') === document.activeElement).toBe(false);
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
      testComponent.disabled = true;
      fixture.detectChanges();
      dispatchFakeEvent(rate.nativeElement.firstElementChild.children[2].firstElementChild, 'mouseover');
      expect(testComponent.onHoverChange).toHaveBeenCalledTimes(2);
    });
    it('should keydown work', () => {
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value).toBe(1);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(2);
      testComponent.allowHalf = true;
      fixture.detectChanges();
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value).toBe(0.5);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(3);
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value).toBe(0);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(4);
    });
    it('should right keydown not dispatch change reached limit', fakeAsync(() => {
      testComponent.value = 5;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      dispatchKeyboardEvent(rate.nativeElement.firstElementChild, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(testComponent.value).toBe(5);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    }));
  });
  describe('rate form', () => {
    let fixture: ComponentFixture<TriTestRateFormComponent>;
    let testComponent: TriTestRateFormComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRateFormComponent);
      testComponent = fixture.componentInstance;
    });
    it('should be in pristine, untouched, and valid states and enable initially', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
      expect(rate.nativeElement.firstElementChild!.classList).not.toContain('ant-rate-disabled');
    }));
    it('should be disable if form is enable and nzDisable set to true initially', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      flush();
      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
    }));
    it('should be disable if form is disable and nzDisable set to false initially', fakeAsync(() => {
      testComponent.disable();
      fixture.detectChanges();
      flush();
      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
    }));
    it('should set disabled work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      flush();

      const rate = fixture.debugElement.query(By.directive(TriRateComponent));
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
      expect(testComponent.formControl.value).toBe(1);
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(1);

      testComponent.enable();
      fixture.detectChanges();
      flush();
      expect(rate.nativeElement.firstElementChild!.classList).not.toContain('ant-rate-disabled');
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(4);

      testComponent.disable();
      fixture.detectChanges();
      flush();
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-disabled');
      rate.nativeElement.firstElementChild.children[3].firstElementChild.firstElementChild.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(4);
    }));
  });
  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestRateRtlComponent>;
    let rate: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRateRtlComponent);
      fixture.detectChanges();
      rate = fixture.debugElement.query(By.directive(TriRateComponent));
    });

    it('should className correct on dir change', fakeAsync(() => {
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild!.classList).toContain('ant-rate-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(rate.nativeElement.firstElementChild!.classList).not.toContain('ant-rate-rtl');
    }));
  });
  describe('rate character', () => {
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
      [count]="count"
      [allowHalf]="allowHalf"
      [allowClear]="allowClear"
      [disabled]="disabled"
      [autoFocus]="autoFocus"
    ></tri-rate>
  `
})
export class TriTestRateBasicComponent {
  @ViewChild(TriRateComponent, { static: false }) rateComponent!: TriRateComponent;
  count = 5;
  autoFocus = false;
  allowHalf = false;
  allowClear = false;
  disabled = false;
  value = 0;
  modelChange = jasmine.createSpy('model change callback');
  onBlur = jasmine.createSpy('blur callback');
  onFocus = jasmine.createSpy('focus callback');
  onHoverChange = jasmine.createSpy('hover change callback');
  onKeyDown = jasmine.createSpy('keydown callback');
}

@Component({
  imports: [ReactiveFormsModule, TriRateModule],
  template: `
    <form>
      <tri-rate [formControl]="formControl" [disabled]="disabled"></tri-rate>
    </form>
  `
})
export class TriTestRateFormComponent {
  formControl = new FormControl(1);

  disabled = false;

  disable(): void {
    this.formControl.disable();
  }

  enable(): void {
    this.formControl.enable();
  }
}

@Component({
  imports: [BidiModule, TriTestRateBasicComponent],
  template: `
    <div [dir]="direction">
      <tri-test-rate></tri-test-rate>
    </div>
  `
})
export class TriTestRateRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  selector: 'tri-test-rate-character',
  imports: [FormsModule, TriRateModule],
  template: `
    <tri-rate [(ngModel)]="value" [character]="characterTpl"></tri-rate>
    <ng-template #characterTpl let-index>
      {{ index + 1 }}
    </ng-template>
  `
})
export class TriTestRateCharacterComponent {
  @ViewChild(TriRateComponent, { static: false }) rateComponent!: TriRateComponent;
  value = 5;
}
