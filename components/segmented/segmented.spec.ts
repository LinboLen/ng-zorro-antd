/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';

import { TriSegmentedComponent } from './segmented.component';
import { TriSegmentedModule } from './segmented.module';
import { TriSegmentedOptions } from './types';

describe('nz-segmented', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriSegmentedTestComponent>;
    let component: TriSegmentedTestComponent;
    let segmentedComponent: DebugElement;

    function getSegmentedOptionByIndex(index: number): HTMLElement {
      return segmentedComponent.nativeElement.querySelectorAll('.ant-segmented-item')[index];
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TriSegmentedTestComponent);
      component = fixture.componentInstance;
      spyOn(component, 'handleValueChange');
      segmentedComponent = fixture.debugElement.query(By.directive(TriSegmentedComponent));
      fixture.detectChanges();
    });

    it('should support block mode', () => {
      const segmentedElement: HTMLElement = segmentedComponent.nativeElement;
      expect(segmentedElement.classList).not.toContain('ant-segmented-block');
      component.block = true;
      fixture.detectChanges();
      expect(segmentedElement.classList).toContain('ant-segmented-block');
    });

    it('should support size', () => {
      const segmentedElement: HTMLElement = segmentedComponent.nativeElement;
      component.size = 'large';
      fixture.detectChanges();
      expect(segmentedElement.classList).toContain('ant-segmented-lg');
      component.size = 'small';
      fixture.detectChanges();
      expect(segmentedElement.classList).toContain('ant-segmented-sm');
    });

    it('should support vertical mode', () => {
      const segmentedElement: HTMLElement = segmentedComponent.nativeElement;
      expect(segmentedElement.classList).not.toContain('ant-segmented-vertical');
      component.vertical = true;
      fixture.detectChanges();
      expect(segmentedElement.classList).toContain('ant-segmented-vertical');
    });

    it('should be auto selected the first option when if no value is set', async () => {
      const theFirstElement = getSegmentedOptionByIndex(0);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
    });

    it('should be change the value and emit an event by clicking', async () => {
      const theFirstElement = getSegmentedOptionByIndex(0);
      const theSecondElement = getSegmentedOptionByIndex(1);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
      expect(component.handleValueChange).toHaveBeenCalledTimes(0);

      dispatchMouseEvent(theSecondElement, 'click');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).not.toContain('ant-segmented-item-selected');
      expect(theSecondElement.classList).toContain('ant-segmented-item-selected');
      expect(component.handleValueChange).toHaveBeenCalledTimes(1);
      expect(component.handleValueChange).toHaveBeenCalledWith(2);
    });

    it('should support object options', async () => {
      component.options = [
        'Daily',
        { label: 'Weekly', value: 'Weekly', disabled: true },
        'Monthly',
        { label: 'Quarterly', value: 'Quarterly', disabled: true },
        'Yearly'
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const theFirstElement = getSegmentedOptionByIndex(0);
      const theSecondElement = getSegmentedOptionByIndex(1);
      const theThirdElement = getSegmentedOptionByIndex(2);

      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
      expect(theSecondElement.classList).not.toContain('ant-segmented-item-selected');

      dispatchMouseEvent(theSecondElement, 'click');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
      expect(theSecondElement.classList).not.toContain('ant-segmented-item-selected');

      dispatchMouseEvent(theThirdElement, 'click');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).not.toContain('ant-segmented-item-selected');
      expect(theThirdElement.classList).toContain('ant-segmented-item-selected');
    });

    it('should support disabled mode', async () => {
      const theFirstElement = getSegmentedOptionByIndex(0);
      const theSecondElement = getSegmentedOptionByIndex(1);

      component.disabled = true;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      dispatchMouseEvent(theSecondElement, 'click');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
      expect(theSecondElement.classList).not.toContain('ant-segmented-item-selected');
    });

    it('should animate thumb correctly in vertical mode', fakeAsync(() => {
      component.vertical = true;
      fixture.detectChanges();

      const segmentedComponentInstance = fixture.debugElement.query(
        By.directive(TriSegmentedComponent)
      ).componentInstance;

      expect(segmentedComponentInstance.nzVertical).toBe(true);

      const theSecondElement = getSegmentedOptionByIndex(1);

      tick(100);
      fixture.detectChanges();

      dispatchMouseEvent(theSecondElement, 'click');
      tick(100);
      fixture.detectChanges();

      expect(theSecondElement.classList).toContain('ant-segmented-item-selected');
      expect(segmentedComponentInstance.animationState).toBeDefined();

      if (segmentedComponentInstance.animationState) {
        expect(['fromVertical', 'toVertical']).toContain(segmentedComponentInstance.animationState.value);
      }
    }));
  });

  describe('icon-only', () => {
    let fixture: ComponentFixture<TriSegmentedIconOnlyTestComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriSegmentedIconOnlyTestComponent);
    });

    it('should render only one element in .ant-segmented-item-label if the item is icon-only', () => {
      const items = fixture.debugElement.queryAll(By.css('.ant-segmented-item-label'));
      expect(items.length).toBe(2);
      expect(items[0].children.length).toBe(2);
      expect(items[0].children[0].nativeElement.classList).toContain('ant-segmented-item-icon');
      expect(items[0].children[1].nativeElement.tagName).toBe('SPAN');
      expect(items[1].children.length).toBe(1);
      expect(items[1].children[0].nativeElement.classList).toContain('ant-segmented-item-icon');
    });
  });

  describe('ng model', () => {
    let fixture: ComponentFixture<TriSegmentedNgModelTestComponent>;
    let component: TriSegmentedNgModelTestComponent;
    let segmentedComponent: DebugElement;

    function getSegmentedOptionByIndex(index: number): HTMLElement {
      return segmentedComponent.nativeElement.querySelectorAll('.ant-segmented-item')[index];
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TriSegmentedNgModelTestComponent);
      component = fixture.componentInstance;
      spyOn(component, 'handleValueChange');
      segmentedComponent = fixture.debugElement.query(By.directive(TriSegmentedComponent));
      fixture.detectChanges();
    });

    it('should be support two-way binding', async () => {
      const theFirstElement = getSegmentedOptionByIndex(0);
      const theSecondElement = getSegmentedOptionByIndex(1);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
      expect(component.handleValueChange).toHaveBeenCalledTimes(0);

      component.value = 2;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).not.toContain('ant-segmented-item-selected');
      expect(theSecondElement.classList).toContain('ant-segmented-item-selected');
      expect(component.handleValueChange).toHaveBeenCalledTimes(0);

      dispatchMouseEvent(theFirstElement, 'click');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
      expect(theSecondElement.classList).not.toContain('ant-segmented-item-selected');
      expect(component.value).toBe(1);
      expect(component.handleValueChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<TriSegmentedInReactiveFormTestComponent>;
    let component: TriSegmentedInReactiveFormTestComponent;
    let segmentedComponent: DebugElement;

    function getSegmentedOptionByIndex(index: number): HTMLElement {
      return segmentedComponent.nativeElement.querySelectorAll('.ant-segmented-item')[index];
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TriSegmentedInReactiveFormTestComponent);
      component = fixture.componentInstance;
      segmentedComponent = fixture.debugElement.query(By.directive(TriSegmentedComponent));
      fixture.detectChanges();
    });

    it('first change form control value should work', async () => {
      const theSecondElement = getSegmentedOptionByIndex(1);
      const theThirdElement = getSegmentedOptionByIndex(2);

      expect(component.formControl.value).toBe('Weekly');

      dispatchMouseEvent(theThirdElement, 'click');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theSecondElement.classList).not.toContain('ant-segmented-item-selected');
      expect(theThirdElement.classList).toContain('ant-segmented-item-selected');
    });
  });

  describe('vertical segmented', () => {
    let fixture: ComponentFixture<TriSegmentedVerticalTestComponent>;
    let component: TriSegmentedVerticalTestComponent;
    let segmentedComponent: DebugElement;

    function getSegmentedOptionByIndex(index: number): HTMLElement {
      return segmentedComponent.nativeElement.querySelectorAll('.ant-segmented-item')[index];
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TriSegmentedVerticalTestComponent);
      component = fixture.componentInstance;
      spyOn(component, 'handleValueChange');
      segmentedComponent = fixture.debugElement.query(By.directive(TriSegmentedComponent));
      fixture.detectChanges();
    });

    it('should render in vertical mode', () => {
      const segmentedElement: HTMLElement = segmentedComponent.nativeElement;
      expect(segmentedElement.classList).toContain('ant-segmented-vertical');
      const groupElement = segmentedElement.querySelector('.ant-segmented-group') as HTMLElement;
      expect(groupElement).toBeTruthy();
    });

    it('should change selection in vertical mode', async () => {
      const theFirstElement = getSegmentedOptionByIndex(0);
      const theSecondElement = getSegmentedOptionByIndex(1);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).toContain('ant-segmented-item-selected');
      expect(component.handleValueChange).toHaveBeenCalledTimes(0);

      dispatchMouseEvent(theSecondElement, 'click');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(theFirstElement.classList).not.toContain('ant-segmented-item-selected');
      expect(theSecondElement.classList).toContain('ant-segmented-item-selected');
      expect(component.handleValueChange).toHaveBeenCalledTimes(1);
      expect(component.handleValueChange).toHaveBeenCalledWith('Weekly');
    });
  });
});

@Component({
  imports: [FormsModule, TriSegmentedModule],
  template: `
    <tri-segmented
      [size]="size"
      [options]="options"
      [disabled]="disabled"
      [block]="block"
      [vertical]="vertical"
      (valueChange)="handleValueChange($event)"
    />
  `
})
export class TriSegmentedTestComponent {
  size: TriSizeLDSType = 'default';
  options: TriSegmentedOptions = [1, 2, 3];
  block = false;
  disabled = false;
  vertical = false;

  handleValueChange(_e: string | number): void {
    // empty
  }
}

@Component({
  imports: [FormsModule, TriSegmentedModule],
  template: `<tri-segmented [options]="options" />`
})
export class TriSegmentedIconOnlyTestComponent {
  options: TriSegmentedOptions = [
    { value: 'List', label: 'List', icon: 'bars' },
    { value: 'Kanban', icon: 'appstore' }
  ];
}

@Component({
  imports: [FormsModule, TriSegmentedModule],
  template: `<tri-segmented [options]="options" [(ngModel)]="value" (ngModelChange)="handleValueChange($event)" />`
})
export class TriSegmentedNgModelTestComponent {
  options: TriSegmentedOptions = [1, 2, 3];
  value: number | string = 1;

  handleValueChange(_e: string | number): void {
    // empty
  }
}

@Component({
  imports: [ReactiveFormsModule, TriSegmentedModule],
  template: `<tri-segmented [options]="options" [formControl]="formControl"></tri-segmented>`
})
export class TriSegmentedInReactiveFormTestComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  formControl = new FormControl('Weekly');
}

@Component({
  imports: [FormsModule, TriSegmentedModule],
  template: `<tri-segmented [options]="options" [vertical]="true" (valueChange)="handleValueChange($event)" /> `
})
export class TriSegmentedVerticalTestComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  handleValueChange(_e: string | number): void {
    // empty
  }
}
