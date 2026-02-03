/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { ApplicationRef, Component, DebugElement, provideZoneChangeDetection, signal, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import { createMouseEvent } from 'ng-zorro-antd/core/testing';
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

    it('should click work', fakeAsync(() => {
      fixture.detectChanges();
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-checked');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radio.nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-checked');
      expect(testComponent.value).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      radio.nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-checked');
      expect(testComponent.value).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    }));

    it('should disabled work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-checked');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radio.nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-checked');
      expect(testComponent.value).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    }));

    it('should not run change detection if the radio is disabled', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      const appRef = TestBed.inject(ApplicationRef);
      spyOn(appRef, 'tick');
      const event = createMouseEvent('click');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      radio.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(appRef.tick).not.toHaveBeenCalled();
    }));

    it('should autofocus work', () => {
      fixture.detectChanges();
      testComponent.autoFocus = true;
      fixture.detectChanges();
      expect(radio.nativeElement.querySelector('input').attributes.getNamedItem('autofocus').name).toBe('autofocus');
      testComponent.autoFocus = false;
      fixture.detectChanges();
      expect(radio.nativeElement.querySelector('input').attributes.getNamedItem('autofocus')).toBe(null);
    });

    it('should focus and blur function work', () => {
      fixture.detectChanges();
      expect(radio.nativeElement.querySelector('input') === document.activeElement).toBe(false);
      testComponent.radioComponent.focus();
      fixture.detectChanges();
      expect(radio.nativeElement.querySelector('input') === document.activeElement).toBe(true);
      testComponent.radioComponent.blur();
      fixture.detectChanges();
      expect(radio.nativeElement.querySelector('input') === document.activeElement).toBe(false);
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

    it('should click work', fakeAsync(() => {
      fixture.detectChanges();
      expect(testComponent.value).toBe('A');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radios[1].nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(radios[0].nativeElement.firstElementChild!.classList).not.toContain('ant-radio-button-checked');
      expect(radios[1].nativeElement.firstElementChild!.classList).toContain('ant-radio-button-checked');
      expect(testComponent.value).toBe('B');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      radios[1].nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe('B');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    }));

    it('should disable work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(testComponent.value).toBe('A');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      radios[1].nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(radios[1].nativeElement.firstElementChild!.classList).not.toContain('ant-radio-button-checked');
      expect(testComponent.value).toBe('A');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    }));

    it('should name work', fakeAsync(() => {
      testComponent.name = 'test';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(radios.every(radio => radio.nativeElement.querySelector('input').name === 'test')).toBe(true);
    }));
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

    it('should group disable work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.value).toBe('A');
      radios[1].nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(radios[1].nativeElement.firstElementChild!.classList).not.toContain('ant-radio-button-checked');
      expect(testComponent.value).toBe('A');
    }));

    it('should single disable work', fakeAsync(() => {
      testComponent.disabled = false;
      fixture.detectChanges();
      testComponent.singleDisabled = true;
      fixture.detectChanges();
      expect(testComponent.value).toBe('A');
      radios[2].nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(radios[2].nativeElement.firstElementChild!.classList).not.toContain('ant-radio-button-checked');
      expect(testComponent.value).toBe('A');
    }));
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

    it('should be in pristine, untouched, and valid states and enable initially', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      const inputElement = radio.nativeElement.querySelector('input') as HTMLInputElement;
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeFalsy();
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
    }));

    it('should be disable if form is disable and nzDisable set to false initially', fakeAsync(() => {
      testComponent.formControl.disable();
      fixture.detectChanges();
      flush();
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      const inputElement = radio.nativeElement.querySelector('input') as HTMLInputElement;
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeTruthy();
    }));

    it('should set disabled work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      flush();
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      const inputElement = radio.nativeElement.querySelector('input') as HTMLInputElement;
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeTruthy();
      expect(testComponent.formControl.value).toBe(false);
      inputElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(false);

      testComponent.enable();
      fixture.detectChanges();
      flush();
      expect(radio.nativeElement.firstElementChild!.classList).not.toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeFalsy();
      inputElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(true);

      testComponent.disable();
      fixture.detectChanges();
      flush();
      expect(radio.nativeElement.firstElementChild!.classList).toContain('ant-radio-disabled');
      expect(inputElement.disabled).toBeTruthy();
      inputElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(true);
    }));
  });

  describe('radio group form', () => {
    let fixture: ComponentFixture<TriTestRadioGroupFormComponent>;
    let testComponent: TriTestRadioGroupFormComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestRadioGroupFormComponent);
      testComponent = fixture.componentInstance;
    }));

    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      fixture.detectChanges();
      flush();
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
    }));

    it('should be disable if form is disable and nzDisable set to false initially', fakeAsync(() => {
      testComponent.formControl.disable();
      fixture.detectChanges();
      flush();
      const radioGroup: TriRadioGroupComponent = fixture.debugElement.query(
        By.directive(TriRadioGroupComponent)
      ).componentInstance;
      expect(radioGroup.disabled).toBeTruthy();
    }));

    it('should set disabled work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      flush();
      const radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));
      const radioGroup: TriRadioGroupComponent = fixture.debugElement.query(
        By.directive(TriRadioGroupComponent)
      ).componentInstance;
      expect(radioGroup.disabled).toBeTruthy();
      radios[0].nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe('B');

      testComponent.enable();
      fixture.detectChanges();
      flush();

      expect(radioGroup.disabled).toBeFalsy();
      radios[0].nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe('A');

      testComponent.disable();
      fixture.detectChanges();
      flush();

      expect(radioGroup.disabled).toBeTruthy();
      radios[1].nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe('A');
    }));
  });

  describe('radio group disable form', () => {
    it('expect not to thrown error', fakeAsync(() => {
      expect(() => {
        const fixture = TestBed.createComponent(TriTestRadioGroupDisabledFormComponent);
        fixture.detectChanges();
      }).not.toThrow();
    }));
  });

  describe('ngModel on the `nz-radio` button', () => {
    it('`onChange` of each `nz-radio` should emit correct values', () => {
      const fixture = TestBed.createComponent(TriTestRadioGroupLabelNgModelComponent);
      fixture.detectChanges();

      const radios = fixture.debugElement.queryAll(By.directive(TriRadioComponent));

      radios[0].nativeElement.click();
      expect(fixture.componentInstance.items).toEqual([
        { label: 'A', checked: true },
        { label: 'B', checked: false },
        { label: 'C', checked: false },
        { label: 'D', checked: false }
      ]);

      radios[1].nativeElement.click();
      expect(fixture.componentInstance.items).toEqual([
        { label: 'A', checked: false },
        { label: 'B', checked: true },
        { label: 'C', checked: false },
        { label: 'D', checked: false }
      ]);
    });
  });

  describe('RTL', () => {
    it('should single radio className correct', () => {
      const fixture = TestBed.createComponent(TriTestRadioSingleRtlComponent);
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      fixture.detectChanges();
      expect(radio.nativeElement.className).toContain('ant-radio-wrapper-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(radio.nativeElement.className).not.toContain('ant-radio-wrapper-rtl');
    });

    it('should radio button className correct', () => {
      const fixture = TestBed.createComponent(TriTestRadioButtonRtlComponent);
      const radio = fixture.debugElement.query(By.directive(TriRadioComponent));
      fixture.detectChanges();
      expect(radio.nativeElement.className).toContain('ant-radio-button-wrapper-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(radio.nativeElement.className).not.toContain('ant-radio-button-wrapper-rtl');
    });

    it('should radio group className correct', () => {
      const fixture = TestBed.createComponent(TriTestRadioGroupRtlComponent);
      const radioGroup = fixture.debugElement.query(By.directive(TriRadioGroupComponent));
      fixture.detectChanges();
      expect(radioGroup.nativeElement.classList).toContain('ant-radio-group-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(radioGroup.nativeElement.className).not.toContain('ant-radio-group-rtl');
    });
  });

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
      component.size = 'default';
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

@Component({
  selector: 'tri-test-radio-single',
  imports: [FormsModule, TriRadioModule],
  template: `
    <label
      tri-radio
      [(ngModel)]="value"
      (ngModelChange)="modelChange($event)"
      [disabled]="disabled"
      [autoFocus]="autoFocus"
    >
      Radio
    </label>
  `
})
export class TriTestRadioSingleComponent {
  @ViewChild(TriRadioComponent, { static: false }) radioComponent!: TriRadioComponent;
  value = false;
  autoFocus = false;
  disabled = false;
  modelChange = jasmine.createSpy('change callback');
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
      [name]="name"
      [disabled]="disabled"
      (ngModelChange)="modelChange($event)"
      [size]="size"
    >
      <label tri-radio-button value="A">A</label>
      <label tri-radio-button value="B">B</label>
      <label tri-radio-button value="C">C</label>
      <label tri-radio-button value="D">D</label>
    </tri-radio-group>
  `
})
export class TriTestRadioGroupComponent {
  size: TriSizeLDSType = 'default';
  value = 'A';
  disabled = false;
  name!: string;
  modelChange = jasmine.createSpy('change callback');
}

@Component({
  imports: [ReactiveFormsModule, TriRadioModule],
  template: `
    <form>
      <label tri-radio [formControl]="formControl" [disabled]="disabled"></label>
    </form>
  `
})
export class TriTestRadioFormComponent {
  formControl = new FormControl(false);

  disabled = false;

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
      <tri-radio-group [formControl]="formControl" [disabled]="disabled">
        <label tri-radio-button value="A" [disabled]="true">A</label>
        <label tri-radio-button value="B">B</label>
        <label tri-radio-button value="C">C</label>
        <label tri-radio-button value="D">D</label>
      </tri-radio-group>
    </form>
  `
})
export class TriTestRadioGroupFormComponent {
  formControl = new FormControl('B');
  disabled = false;

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
    <tri-radio-group [(ngModel)]="value" [name]="name" [disabled]="disabled" [size]="size">
      <label tri-radio-button value="A">A</label>
      <label tri-radio-button value="B">B</label>
      <label tri-radio-button value="C" [disabled]="singleDisabled">C</label>
      <label tri-radio-button value="D">D</label>
    </tri-radio-group>
  `
})
export class TriTestRadioGroupDisabledComponent {
  size: TriSizeLDSType = 'default';
  value = 'A';
  disabled = false;
  name!: string;
  singleDisabled = false;
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
  `
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
      <label tri-radio-button value="C" [disabled]="singleDisabled">C</label>
      <label tri-radio-button value="D">D</label>
    </tri-radio-group>
  `
})
export class TriTestRadioGroupSolidComponent {
  value = 'A';
  singleDisabled = false;
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
  imports: [BidiModule, TriTestRadioSingleComponent],
  template: `
    <div [dir]="direction">
      <tri-test-radio-single />
    </div>
  `
})
export class TriTestRadioSingleRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  imports: [BidiModule, TriRadioModule],
  template: `
    <div [dir]="direction">
      <label tri-radio-button>Radio</label>
    </div>
  `
})
export class TriTestRadioButtonRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  imports: [BidiModule, TriTestRadioGroupComponent],
  template: `
    <div [dir]="direction">
      <tri-test-radio-group />
    </div>
  `
})
export class TriTestRadioGroupRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  imports: [TriRadioModule],
  template: `<tri-radio-group [size]="size" />`
})
export class TestRadioGroupFinalSizeComponent {
  size: TriSizeLDSType = 'default';
}
