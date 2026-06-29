/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ApplicationRef, Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import { createMouseEvent, testDirectionality, updateNonSignalsInput } from 'ng-zorro-antd/core/testing';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';

import { TriRadioGroupComponent } from './radio-group.component';
import { TriRadioComponent } from './radio.component';
import { TriRadioModule } from './radio.module';

describe('radio', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  describe('single radio basic', () => {
    let fixture: ComponentFixture<TriTestRadioSingleComponent>;
    let testComponent: TriTestRadioSingleComponent;
    let radio: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRadioSingleComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      radio = fixture.debugElement.query(By.directive(TriRadioComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(radio.nativeElement.classList).toContain('ant-radio-wrapper');
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio');
      expect(radio.nativeElement.firstElementChild.lastElementChild.classList).toContain('ant-radio-inner');
    });

    it('should click work', async () => {
      fixture.detectChanges();
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-checked');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radio.nativeElement.click();
      await stabilize(fixture, 100);
      expect(testComponent.value()).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      radio.nativeElement.click();
      await stabilize(fixture, 100);
      expect(testComponent.value()).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledWith(true);
    });

    it('should disabled work', async () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-checked');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radio.nativeElement.click();
      await stabilize(fixture);
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-checked');
      expect(testComponent.value()).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });

    it('should not run change detection if the radio is disabled', () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      const appRef = TestBed.inject(ApplicationRef);
      vi.spyOn(appRef, 'tick');
      const event = createMouseEvent('click');
      vi.spyOn(event, 'preventDefault');
      vi.spyOn(event, 'stopPropagation');
      radio.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(appRef.tick).not.toHaveBeenCalled();
    });

    it('should autofocus work', () => {
      fixture.detectChanges();
      testComponent.autoFocus.set(true);
      fixture.detectChanges();
      expect(radio.nativeElement.querySelector('input').attributes.getNamedItem('autofocus').name).toBe('autofocus');
      testComponent.autoFocus.set(false);
      fixture.detectChanges();
      expect(radio.nativeElement.querySelector('input').attributes.getNamedItem('autofocus')).toBe(null);
    });

    it('should focus and blur function work', () => {
      fixture.detectChanges();
      const inputElement = radio.nativeElement.querySelector('input') as HTMLInputElement;
      vi.spyOn(inputElement, 'focus');
      vi.spyOn(inputElement, 'blur');
      testComponent.radioComponent.focus();
      fixture.detectChanges();
      expect(inputElement.focus).toHaveBeenCalledTimes(1);
      testComponent.radioComponent.blur();
      fixture.detectChanges();
      expect(inputElement.blur).toHaveBeenCalledTimes(1);
    });
  });

  describe('single radio button', () => {
    let fixture: ComponentFixture<TriTestRadioButtonComponent>;
    let radio: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRadioButtonComponent);
      fixture.detectChanges();
      radio = fixture.debugElement.query(By.directive(TriRadioComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(radio.nativeElement.classList).toContain('ant-radio-button-wrapper');
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-button');
      expect(radio.nativeElement.firstElementChild.lastElementChild.classList).toContain('ant-radio-button-inner');
    });
  });

  describe('radio group', () => {
    let fixture: ComponentFixture<TriTestRadioGroupComponent>;
    let testComponent: TriTestRadioGroupComponent;
    let radios: DebugElement[];
    let radioGroup: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRadioGroupComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));
      radioGroup = fixture.debugElement.query(By.directive(TriRadioGroupComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(radioGroup.nativeElement.classList).toContain('ant-radio-group');
    });

    it('should click work', async () => {
      fixture.detectChanges();
      expect(testComponent.value()).toBe('A');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radios[1].nativeElement.click();
      await stabilize(fixture, 100);
      expect(testComponent.value()).toBe('B');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      radios[1].nativeElement.click();
      await stabilize(fixture, 100);
      expect(testComponent.value()).toBe('B');
      expect(testComponent.modelChange).toHaveBeenCalledWith('B');
    });

    it('should disable work', async () => {
      testComponent.disabled.set(true);
      await stabilize(fixture);
      expect(testComponent.value()).toBe('A');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radios[1].nativeElement.click();
      await stabilize(fixture);
      expect(radios[1].nativeElement.firstElementChild!.classList).not.toContain('ant-radio-button-checked');
      expect(testComponent.value()).toBe('A');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });

    it('should name work', async () => {
      testComponent.name.set('test');
      await stabilize(fixture);
      expect(radios.every(radio => radio.nativeElement.querySelector('input').name === 'test')).toBe(true);
    });
  });

  describe('radio group disabled', () => {
    let fixture: ComponentFixture<TriTestRadioGroupDisabledComponent>;
    let testComponent: TriTestRadioGroupDisabledComponent;
    let radios: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRadioGroupDisabledComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));
    });

    it('should group disable work', async () => {
      testComponent.disabled.set(true);
      await stabilize(fixture);
      expect(testComponent.value()).toBe('A');
      radios[1].nativeElement.click();
      await stabilize(fixture);
      expect(radios[1].nativeElement.firstElementChild!.classList).not.toContain('ant-radio-button-checked');
      expect(testComponent.value()).toBe('A');
    });

    it('should single disable work', async () => {
      testComponent.disabled.set(false);
      fixture.detectChanges();
      testComponent.singleDisabled.set(true);
      fixture.detectChanges();
      expect(testComponent.value()).toBe('A');
      radios[2].nativeElement.click();
      await stabilize(fixture);
      expect(radios[2].nativeElement.firstElementChild!.classList).not.toContain('ant-radio-button-checked');
      expect(testComponent.value()).toBe('A');
    });
  });

  describe('radio group solid', () => {
    let fixture: ComponentFixture<TriTestRadioGroupSolidComponent>;
    let radioGroup: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRadioGroupSolidComponent);
      fixture.detectChanges();
      radioGroup = fixture.debugElement.query(By.directive(TriRadioGroupComponent));
    });

    it('should support solid css', () => {
      fixture.detectChanges();
      expect(radioGroup.nativeElement.classList).toContain('ant-radio-group-solid');
    });
  });

  describe('radio form', () => {
    let fixture: ComponentFixture<TriTestRadioFormComponent>;
    let testComponent: TriTestRadioFormComponent;
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRadioFormComponent);
      testComponent = fixture.componentInstance;
    });

    it('should be in pristine, untouched, and valid states and enable initially', async () => {
      await stabilize(fixture);
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      const inputElement = radio.nativeElement.querySelector('input') as HTMLInputElement;
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeFalsy();
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
    });

    it('should be disable if form is disable and nzDisable set to false initially', async () => {
      testComponent.formControl.disable();
      await stabilize(fixture);
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      const inputElement = radio.nativeElement.querySelector('input') as HTMLInputElement;
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeTruthy();
    });

    it('should set disabled work', async () => {
      testComponent.disabled.set(true);
      await stabilize(fixture);
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      const inputElement = radio.nativeElement.querySelector('input') as HTMLInputElement;
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeTruthy();
      expect(testComponent.formControl.value).toBe(false);
      inputElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(false);

      testComponent.enable();
      await stabilize(fixture);
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeFalsy();
      inputElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(true);

      testComponent.disable();
      await stabilize(fixture);
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeTruthy();
      inputElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(true);
    });
  });

  describe('radio group form', () => {
    let fixture: ComponentFixture<TriTestRadioGroupFormComponent>;
    let testComponent: TriTestRadioGroupFormComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestRadioGroupFormComponent);
      testComponent = fixture.componentInstance;
    });

    it('should be in pristine, untouched, and valid states initially', async () => {
      await stabilize(fixture);
      const radioGroup: TriRadioGroupComponent = fixture.debugElement.query(
        By.directive(TriRadioGroupComponent)
      ).componentInstance;
      const radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));
      const [firstRadios] = radios;
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
      expect(radioGroup.disabled).toBeFalsy();
      expect(firstRadios.componentInstance.nzDisabled).toBeTruthy();
    });

    it('should be disable if form is disable and nzDisable set to false initially', async () => {
      testComponent.formControl.disable();
      await stabilize(fixture);
      const radioGroup: TriRadioGroupComponent = fixture.debugElement.query(
        By.directive(TriRadioGroupComponent)
      ).componentInstance;
      expect(radioGroup.disabled).toBeTruthy();
    });

    it('should set disabled work', async () => {
      testComponent.disabled.set(true);
      await stabilize(fixture);
      let radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));
      const radioGroup: TriRadioGroupComponent = fixture.debugElement.query(
        By.directive(TriRadioGroupComponent)
      ).componentInstance;
      expect(radioGroup.disabled).toBeTruthy();
      radios[0].nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe('B');

      testComponent.enable();
      await stabilize(fixture);

      expect(radioGroup.disabled).toBeFalsy();
      radios[0].nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe('A');

      testComponent.disable();
      await stabilize(fixture);

      expect(radioGroup.disabled).toBeTruthy();
      radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));
      radios[1].nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe('A');
    });
  });

  describe('radio group disable form', () => {
    it('expect not to thrown error', () => {
      expect(() => {
        const fixture = TestBed.createComponent(TriTestRadioGroupDisabledFormComponent);
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('ngModel on the `nz-radio` button', () => {
    it('`onChange` of each `nz-radio` should emit correct values', async () => {
      const fixture = TestBed.createComponent(TriTestRadioGroupLabelNgModelComponent);
      fixture.detectChanges();

      let radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));

      radios[0].nativeElement.click();
      await stabilize(fixture);
      expect(fixture.componentInstance.items).toEqual([
        { label: 'A', checked: true },
        { label: 'B', checked: false },
        { label: 'C', checked: false },
        { label: 'D', checked: false }
      ]);

      radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));
      radios[1].nativeElement.click();
      await stabilize(fixture);
      expect(fixture.componentInstance.items).toEqual([
        { label: 'A', checked: true },
        { label: 'B', checked: true },
        { label: 'C', checked: false },
        { label: 'D', checked: false }
      ]);
    });
  });

  testDirectionality(() => TriTestRadioSingleComponent, By.directive(TriRadioComponent), 'ant-radio-wrapper');
  testDirectionality(() => TriTestRadioButtonComponent, By.directive(TriRadioComponent), 'ant-radio-button-wrapper');
  testDirectionality(() => TriTestRadioGroupComponent, By.directive(TriRadioGroupComponent), 'ant-radio-group');

  describe('finalSize', () => {
    let fixture: ComponentFixture<TestRadioGroupFinalSizeComponent>;
    let radioGroupElement: HTMLElement;
    let component: TestRadioGroupFinalSizeComponent;
    const formSize = signal<TriSizeLDSType | undefined>(undefined);

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: TRI_FORM_SIZE, useValue: formSize }]
      });

      fixture = TestBed.createComponent(TestRadioGroupFinalSizeComponent);
      component = fixture.componentInstance;
      radioGroupElement = fixture.debugElement.query(By.directive(TriRadioGroupComponent)).nativeElement;
      fixture.detectChanges();
    });

    it('should prioritize formSize > nzSize', () => {
      component.size.set('default');
      formSize.set('large');
      fixture.detectChanges();
      expect(radioGroupElement.classList).toContain('ant-radio-group-large');

      formSize.set('small');
      fixture.detectChanges();
      expect(radioGroupElement.classList).toContain('ant-radio-group-small');

      formSize.set('default');
      fixture.detectChanges();
      expect(radioGroupElement.classList).not.toContain('ant-radio-group-large');
      expect(radioGroupElement.classList).not.toContain('ant-radio-group-small');
    });
  });
});

async function stabilize<T>(fixture: ComponentFixture<T>, ms?: number): Promise<void> {
  fixture.detectChanges();
  await updateNonSignalsInput(fixture, ms);
  fixture.detectChanges();
}

@Component({
  selector: 'tri-test-radio-single',
  imports: [FormsModule, TriRadioModule],
  template: `
    <label
      tri-radio
      [(ngModel)]="value"
      (ngModelChange)="modelChange($event)"
      [disabled]="disabled()"
      [autoFocus]="autoFocus()"
    >
      Radio
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestRadioSingleComponent {
  @ViewChild(TriRadioComponent, { static: false }) radioComponent!: TriRadioComponent;
  readonly value = signal(false);
  readonly autoFocus = signal(false);
  readonly disabled = signal(false);
  modelChange = vi.fn();
}

@Component({
  imports: [FormsModule, TriRadioModule],
  template: `<label tri-radio-button>Radio</label>`
})
export class TriTestRadioButtonComponent {}

@Component({
  selector: 'tri-test-radio-group',
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group
      [(ngModel)]="value"
      (ngModelChange)="modelChange($event)"
      [name]="name()!"
      [disabled]="disabled()"
      [size]="size()"
    >
      <label tri-radio-button value="A">A</label>
      <label tri-radio-button value="B">B</label>
      <label tri-radio-button value="C">C</label>
      <label tri-radio-button value="D">D</label>
    </tri-radio-group>
  `
})
export class TriTestRadioGroupComponent {
  readonly size = signal<TriSizeLDSType>('default');
  readonly value = signal('A');
  readonly disabled = signal(false);
  readonly name = signal<string | undefined>(undefined);
  modelChange = vi.fn();
}

@Component({
  imports: [ReactiveFormsModule, TriRadioModule],
  template: `
    <form>
      <label tri-radio [formControl]="formControl" [disabled]="disabled()"></label>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestRadioFormComponent {
  formControl = new FormControl(false);

  readonly disabled = signal(false);

  disable(): void {
    this.formControl.disable();
  }

  enable(): void {
    this.formControl.enable();
  }
}

@Component({
  imports: [ReactiveFormsModule, TriRadioModule],
  template: `
    <form>
      <tri-radio-group [formControl]="formControl" [disabled]="disabled()">
        <label tri-radio-button value="A" [disabled]="true">A</label>
        <label tri-radio-button value="B">B</label>
        <label tri-radio-button value="C">C</label>
        <label tri-radio-button value="D">D</label>
      </tri-radio-group>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestRadioGroupFormComponent {
  formControl = new FormControl('B');
  readonly disabled = signal(false);

  disable(): void {
    this.formControl.disable();
  }

  enable(): void {
    this.formControl.enable();
  }
}

/** https://github.com/NG-ZORRO/ng-zorro-antd/issues/1543 **/

@Component({
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="value" [name]="name()!" [disabled]="disabled()" [size]="size()">
      <label tri-radio-button value="A">A</label>
      <label tri-radio-button value="B">B</label>
      <label tri-radio-button value="C" [disabled]="singleDisabled()">C</label>
      <label tri-radio-button value="D">D</label>
    </tri-radio-group>
  `
})
export class TriTestRadioGroupDisabledComponent {
  readonly size = signal<TriSizeLDSType>('default');
  readonly value = signal('A');
  readonly disabled = signal(false);
  readonly name = signal<string | undefined>(undefined);
  readonly singleDisabled = signal(false);
}

/** https://github.com/NG-ZORRO/ng-zorro-antd/issues/1735 **/
@Component({
  imports: [ReactiveFormsModule, TriRadioModule],
  template: `
    <form>
      <tri-radio-group [formControl]="formControl">
        @for (val of radioValues; track val) {
          <label tri-radio [value]="val">{{ val }}</label>
        }
      </tri-radio-group>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestRadioGroupDisabledFormComponent {
  formControl = new FormControl({ value: 'B', disabled: true });
  radioValues = ['A', 'B', 'C', 'D'];
}

@Component({
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="value" buttonStyle="solid">
      <label tri-radio-button value="A">A</label>
      <label tri-radio-button value="B">B</label>
      <label tri-radio-button value="C" [disabled]="singleDisabled()">C</label>
      <label tri-radio-button value="D">D</label>
    </tri-radio-group>
  `
})
export class TriTestRadioGroupSolidComponent {
  value = 'A';
  readonly singleDisabled = signal(false);
}

/** https://github.com/NG-ZORRO/ng-zorro-antd/issues/7254 */
@Component({
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group>
      @for (item of items; track item) {
        <label tri-radio [value]="item.label" [(ngModel)]="item.checked">
          {{ item.label }}
        </label>
      }
    </tri-radio-group>
  `
})
export class TriTestRadioGroupLabelNgModelComponent {
  items = [
    {
      label: 'A',
      checked: false
    },
    {
      label: 'B',
      checked: false
    },
    {
      label: 'C',
      checked: false
    },
    {
      label: 'D',
      checked: false
    }
  ];
}

@Component({
  imports: [TriRadioModule],
  selector: 'tri-test-radio-group-final-size',
  template: `<tri-radio-group [size]="size()" />`
})
export class TestRadioGroupFinalSizeComponent {
  readonly size = signal<TriSizeLDSType>('default');
}
