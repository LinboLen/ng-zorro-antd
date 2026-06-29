/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BACKSPACE, DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ApplicationRef, Component, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { TRI_FORM_SIZE, TRI_FORM_VARIANT } from 'ng-zorro-antd/core/form';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  updateNonSignalsInput
} from 'ng-zorro-antd/core/testing';
import { TriSafeAny, TriSizeLDSType, TriStatus, TriVariant } from 'ng-zorro-antd/core/types';
import { TriFormControlStatusType, TriFormModule } from 'ng-zorro-antd/form';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';
import { TRI_SPACE_COMPACT_SIZE } from 'ng-zorro-antd/space';

import { TriSelectSearchComponent } from './select-search.component';
import { TriSelectTopControlComponent } from './select-top-control.component';
import { TriSelectComponent, TriSelectSizeType } from './select.component';
import { TriSelectModule } from './select.module';
import {
  TriFilterOptionType,
  TriSelectItemInterface,
  TriSelectModeType,
  TriSelectOptionInterface,
  TriSelectPlacementType
} from './select.types';

describe('select', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNzNoAnimation()]
    });
  });

  describe('default template mode', () => {
    let component: TestSelectTemplateDefaultComponent;
    let fixture: ComponentFixture<TestSelectTemplateDefaultComponent>;
    let selectElement!: HTMLElement;
    let overlayContainerElement: HTMLElement;

    async function flushChanges(): Promise<void> {
      fixture.detectChanges();
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectTemplateDefaultComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    });

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    }));

    it('should classname correct', () => {
      expect(selectElement.classList).toContain('ant-select');
      expect(selectElement.classList).toContain('ant-select-single');
    });

    it('should nzSize work', () => {
      component.size.set('large');
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-lg');
      component.size.set('small');
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-sm');
    });

    it('should nzPlaceHolder work', () => {
      expect(selectElement.querySelector('.ant-select-selection-placeholder')!.textContent!.trim()).toBe('');
      component.placeHolder.set('placeholder');
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-selection-placeholder')!.textContent?.trim()).toContain(
        'placeholder'
      );
    });

    it('should nzDropdownRender work', () => {
      component.open.set(true);
      fixture.detectChanges();
      expect(document.getElementsByClassName('dropdown-render').length).toBe(0);
      component.dropdownRender.set(component.dropdownTemplate);
      fixture.detectChanges();
      expect(document.getElementsByClassName('dropdown-render')[0]!.textContent?.trim()).toBe('dropdownRender');
    });

    it('should ngModel match nzLabel', async () => {
      component.listOfOption.set([{ nzValue: 'test_value', nzLabel: 'test_label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')).toBeFalsy();
      component.value.set('test_value');
      await flushChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('test_label');
      component.listOfOption.set([]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('test_label');
      expect(component.valueChange).not.toHaveBeenCalled();
    });

    it('should ngModelChange trigger when click option', async () => {
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'test_01' },
        { nzValue: 'test_02', nzLabel: 'test_02' }
      ]);
      component.value.set('test_01');
      component.open.set(true);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith('test_02');
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(false);
    });

    it('should ngModelChange trigger when click clear icon', async () => {
      component.listOfOption.set([{ nzValue: 'test_value', nzLabel: 'test_label' }]);
      component.value.set('test_value');
      await flushChanges();
      expect(selectElement.querySelector('nz-select-clear')).toBeFalsy();
      component.allowClear.set(true);
      fixture.detectChanges();
      dispatchMouseEvent(selectElement.querySelector('nz-select-clear')!, 'click');
      fixture.detectChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith(null);
    });

    it('should nzOpenChange trigger correct times', () => {
      component.open.set(true);
      fixture.detectChanges();
      expect(component.openChange).not.toHaveBeenCalled();
      const topSelectElement = selectElement.querySelector('.ant-select-selector')!;
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(false);
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(2);
      expect(component.openChange).toHaveBeenCalledWith(true);
    });

    it('should click input not close in searching mode', () => {
      component.showSearch.set(true);
      fixture.detectChanges();
      const topSelectElement = selectElement.querySelector('.ant-select-selector')!;
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(true);
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(1);
    });

    it('should nzCustomTemplate works', async () => {
      component.listOfOption.set([{ nzValue: 'value', nzLabel: 'label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')).toBeFalsy();
      component.value.set('value');
      component.customTemplate.set(component._customTemplate);
      await flushChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('selected: label');
    });

    it('should nzShowArrow works', () => {
      expect(selectElement.querySelector('nz-select-arrow')).toBeTruthy();
      component.showArrow.set(false);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-arrow')).toBeFalsy();
    });

    it('should nzPrefix works', () => {
      component.prefix.set('prefix');
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-prefix')!.textContent?.trim()).toBe('prefix');

      component.prefix.set(component.affixTemplate);
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-prefix')!.textContent?.trim()).toBe('icon');
    });

    it('should nzSuffixIcon works', () => {
      expect(selectElement.querySelector('.anticon-down')).toBeTruthy();
      component.suffixIcon.set(component.affixTemplate);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-arrow')!.textContent?.trim()).toBe('icon');
    });

    it('should nzClearIcon works', async () => {
      component.allowClear.set(true);
      component.listOfOption.set([{ nzValue: 'value', nzLabel: 'label' }]);
      component.value.set('value');
      await flushChanges();
      expect(selectElement.querySelector('.anticon-close-circle')).toBeTruthy();
      component.clearIcon.set(component.affixTemplate);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-clear')!.textContent?.trim()).toBe('icon');
    });

    it('should nzShowSearch works', async () => {
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'test_01' },
        { nzValue: 'test_02', nzLabel: 'test_02' }
      ]);
      component.showSearch.set(true);
      component.open.set(true);
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('test');
      expect(document.querySelectorAll('nz-option-item').length).toBe(2);
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item').length).toBe(1);
    });

    it('should nzFilterOption works', async () => {
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'test_01' },
        { nzValue: 'test_02', nzLabel: 'test_02' },
        { nzValue: 'test_03', nzLabel: 'test_03' }
      ]);
      component.showSearch.set(true);
      component.filterOption.set(() => true);
      component.open.set(true);
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item').length).toBe(3);
    });

    it('should compareWith works', async () => {
      component.listOfOption.set([{ nzValue: { value: 'test_value' }, nzLabel: 'test_label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')).toBeFalsy();
      component.value.set({ value: 'test_value' });
      component.compareWith.set((o1: TriSafeAny, o2: TriSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2));
      await flushChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('test_label');
    });

    describe('should variant works', () => {
      it('outlined', () => {
        component.variant.set('outlined');
        fixture.detectChanges();
        expect(selectElement.classList).toContain('ant-select-outlined');
      });

      it('filled', () => {
        fixture.detectChanges();
        expect(selectElement.classList).not.toContain('ant-select-filled');
        component.variant.set('filled');
        fixture.detectChanges();
        expect(selectElement.classList).toContain('ant-select-filled');
      });

      it('borderless', () => {
        fixture.detectChanges();
        expect(selectElement.classList).not.toContain('ant-select-borderless');
        component.variant.set('borderless');
        fixture.detectChanges();
        expect(selectElement.classList).toContain('ant-select-borderless');
      });

      it('underlined', () => {
        fixture.detectChanges();
        expect(selectElement.classList).not.toContain('ant-select-underlined');
        component.variant.set('underlined');
        fixture.detectChanges();
        expect(selectElement.classList).toContain('ant-select-underlined');
      });
    });

    it('should nzAutoFocus works', () => {
      component.autoFocus.set(true);
      fixture.detectChanges();
      expect(selectElement.querySelector('input')!.attributes.getNamedItem('autofocus')!.name).toBe('autofocus');
      component.autoFocus.set(false);
      fixture.detectChanges();
      expect(selectElement.querySelector('input')!.attributes.getNamedItem('autofocus')).toBeFalsy();
    });

    it('should nzServerSearch works', async () => {
      component.listOfOption.set([
        { nzValue: '1', nzLabel: '1' },
        { nzValue: '2', nzLabel: '2' },
        { nzValue: '3', nzLabel: '3' }
      ]);
      component.serverSearch.set(true);
      component.showSearch.set(true);
      component.open.set(true);
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item').length).toBe(3);
    });

    it('should nzDisabled works', async () => {
      component.disabled.set(true);
      await flushChanges();
      expect(selectElement.classList).toContain('ant-select-disabled');
      expect(selectElement.querySelector('input')!.getAttribute('disabled')).toBe('');
    });

    it('should nzTitle works', async () => {
      component.listOfOption.set([
        { nzValue: '1', nzLabel: '1' },
        { nzValue: '2', nzLabel: '2', nzTitle: '-' },
        { nzValue: '3', nzLabel: '3', nzTitle: null }
      ]);
      component.open.set(true);
      await flushChanges();
      expect((document.querySelectorAll('nz-option-item')[0] as HTMLElement)?.title).toBe('1');
      expect((document.querySelectorAll('nz-option-item')[1] as HTMLElement)?.title).toBe('-');
      expect((document.querySelectorAll('nz-option-item')[2] as HTMLElement)?.title).toBeFalsy();
    });

    it('should select option by enter', async () => {
      component.listOfOption.set([
        { nzValue: 'value', nzLabel: 'label' },
        { nzValue: 'disabledValue', nzLabel: 'disabledLabel', nzDisabled: true }
      ]);
      component.showSearch.set(true);
      component.open.set(true);

      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label';

      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('label');

      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      await flushChanges();
      expect(component.value()).toBe('value');
    });

    it('should nzDisabled option works', async () => {
      component.listOfOption.set([
        { nzValue: 'value', nzLabel: 'label' },
        { nzValue: 'disabledValue', nzLabel: 'disabledLabel', nzDisabled: true }
      ]);
      component.showSearch.set(true);
      component.open.set(true);

      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'disabled';

      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('disabled');

      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      await flushChanges();
      expect(component.value()).not.toBe('disabledValue');
    });

    it('should nzBackdrop works', async () => {
      component.open.set(true);
      component.backdrop.set(true);
      await flushChanges();
      const boundingBox = overlayContainerElement.children[0];
      expect(boundingBox.children[0].classList).toContain('cdk-overlay-backdrop');
    });

    it('should close dropdown when ESC keydown', async () => {
      component.open.set(true);
      await flushChanges();
      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);
      await flushChanges();
      expect(component.open()).toBe(false);
    });

    it('should keydown up arrow and down arrow', async () => {
      component.listOfOption.set([
        { nzValue: 'value_01', nzLabel: 'label_01' },
        { nzValue: 'value_02', nzLabel: 'label_02', nzDisabled: true },
        { nzValue: 'value_03', nzLabel: 'label_03' }
      ]);
      component.value.set('value_01');
      component.open.set(true);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', UP_ARROW, inputElement);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')[2]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')[0]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      await flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledWith('value_03');
      await flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(true);
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(3);
    });

    it('should not throw error with keydown up arrow and down arrow event when listOfOption is empty', async () => {
      component.listOfOption.set([]);
      component.open.set(true);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', UP_ARROW, inputElement);
      await flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(0);
    });

    it('should mouseenter activated option work', async () => {
      component.listOfOption.set([
        { nzValue: 'value_01', nzLabel: 'label_01' },
        { nzValue: 'value_02', nzLabel: 'label_02', nzDisabled: true },
        { nzValue: 'value_03', nzLabel: 'label_03' }
      ]);
      component.open.set(true);
      await flushChanges();
      const targetItem = document.querySelectorAll('nz-option-item')[2]!;
      expect(targetItem.classList).not.toContain('ant-select-item-option-active');
      dispatchFakeEvent(targetItem, 'mouseenter');
      await flushChanges();
      expect(targetItem.classList).toContain('ant-select-item-option-active');
    });

    it('should group item change work', async () => {
      component.listOfGroup.set([{ nzLabel: 'group-1', children: [{ nzValue: 'value_01', nzLabel: 'label_01' }] }]);
      component.open.set(true);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')!.length).toBe(1);
      expect(document.querySelectorAll('nz-option-item-group')!.length).toBe(1);
      component.listOfGroup.set([
        {
          nzLabel: 'group-1',
          children: [
            { nzValue: 'value_01', nzLabel: 'label_01' },
            { nzValue: 'value_02', nzLabel: 'label_02' }
          ]
        },
        {
          nzLabel: 'group-2',
          children: [{ nzValue: 'value_03', nzLabel: 'label_03' }]
        }
      ]);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')!.length).toBe(3);
      expect(document.querySelectorAll('nz-option-item-group')!.length).toBe(2);
      expect(document.querySelectorAll('nz-option-item-group')[0]!.textContent?.trim()).toBe('group-1');
      expect(document.querySelectorAll('nz-option-item')[0].textContent?.trim()).toBe('label_01');
      component.listOfGroup.set([
        {
          nzLabel: 'change-group',
          children: [
            { nzValue: 'value_01', nzLabel: 'change-label' },
            { nzValue: 'value_02', nzLabel: 'label_02' }
          ]
        },
        {
          nzLabel: 'group-2',
          children: [{ nzValue: 'value_03', nzLabel: 'label_03' }]
        }
      ]);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item-group')[0]!.textContent?.trim()).toBe('change-group');
      expect(document.querySelectorAll('nz-option-item')[0].textContent?.trim()).toBe('change-label');
    });

    it('should group item sort be right', async () => {
      component.listOfGroup.set([
        {
          nzLabel: 'group-1',
          children: [
            { nzValue: 'value_01', nzLabel: 'label_01' },
            { nzValue: 'value_02', nzLabel: 'label_02' }
          ]
        },
        {
          nzLabel: 'group-2',
          children: [
            { nzValue: 'value_03', nzLabel: 'label_03' },
            { nzValue: 'value_04', nzLabel: 'label_04' }
          ]
        }
      ]);
      component.open.set(true);
      await flushChanges();
      expect(
        document
          .querySelectorAll('nz-option-item')[0]
          .parentElement!.querySelector('nz-option-item')!
          .nextElementSibling!.textContent?.trim()
      ).toBe('label_02');
    });

    it('should have selected class if item was selected', async () => {
      component.listOfOption.set([
        { nzValue: 0, nzLabel: 'Falsy value' },
        { nzValue: 'Truthy value', nzLabel: 'Truthy value' },
        { nzValue: 'disabled', nzLabel: 'disabled', nzDisabled: true },
        { nzValue: undefined, nzLabel: 'undefined' },
        { nzValue: null, nzLabel: 'null' }
      ]);
      component.open.set(true);
      component.value.set(0);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item.ant-select-item-option-selected').length).toBe(1);
      expect(document.querySelectorAll('nz-option-item.ant-select-item-option-selected')[0].textContent?.trim()).toBe(
        'Falsy value'
      );
      component.value.set('Truthy value');
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item.ant-select-item-option-selected').length).toBe(1);
      expect(document.querySelectorAll('nz-option-item.ant-select-item-option-selected')[0].textContent?.trim()).toBe(
        'Truthy value'
      );
      for (const value of ['disabled', undefined, null]) {
        component.value.set(value);
        await flushChanges();
        expect(document.querySelectorAll('nz-option-item.ant-select-item-option-selected').length).toBe(0);
      }
    });

    it('should select item on TAB when nzSelectOnTab is true', async () => {
      component.selectOnTab.set(true);
      component.listOfOption.set([
        { nzValue: 'value_01', nzLabel: 'label_01' },
        { nzValue: 'value_02', nzLabel: 'label_02' },
        { nzValue: 'value_03', nzLabel: 'label_03' }
      ]);
      component.open.set(true);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledWith('value_01');
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(1);
    });

    it('should close select and keep the same value on TAB when nzSelectOnTab is default(false)', async () => {
      component.listOfOption.set([
        { nzValue: 'value_01', nzLabel: 'label_01' },
        { nzValue: 'value_02', nzLabel: 'label_02' },
        { nzValue: 'value_03', nzLabel: 'label_03' }
      ]);
      component.value.set('value_02');
      component.open.set(true);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      await flushChanges();
      expect(component.valueChange).not.toHaveBeenCalled();
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('multiple template mode', () => {
    let component: TestSelectTemplateMultipleComponent;
    let fixture: ComponentFixture<TestSelectTemplateMultipleComponent>;
    let selectElement!: HTMLElement;
    let overlayContainerElement: HTMLElement;

    async function flushChanges(): Promise<void> {
      fixture.detectChanges();
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectTemplateMultipleComponent);
      component = fixture.componentInstance;
      selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
      fixture.detectChanges();
      overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();
    });

    it('should classname correct', () => {
      expect(selectElement.classList).toContain('ant-select-multiple');
    });

    it('should ngModel works', async () => {
      component.listOfOption.set([
        { nzValue: 'value_01', nzLabel: 'label_01' },
        { nzValue: 'value_02', nzLabel: 'label_02' }
      ]);
      component.value.set(['value_01', 'value_02']);
      await flushChanges();
      let listOfSelectItem = selectElement.querySelectorAll('nz-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent?.trim()).toBe('label_01');
      expect(listOfSelectItem[1].textContent?.trim()).toBe('label_02');
      component.listOfOption.set([{ nzValue: 'value_01', nzLabel: 'label_01' }]);
      fixture.detectChanges();
      listOfSelectItem = selectElement.querySelectorAll('nz-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent?.trim()).toBe('label_01');
      expect(listOfSelectItem[1].textContent?.trim()).toBe('label_02');
      expect(component.valueChange).not.toHaveBeenCalled();
    });

    it('should click option work', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'test_01' },
        { nzValue: 'test_02', nzLabel: 'test_02' }
      ]);
      component.value.set(['test_01']);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.value().length).toBe(2);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(2);
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
      expect(component.openChange).not.toHaveBeenCalled();
    });

    it('should compareWith works', async () => {
      component.listOfOption.set([{ nzValue: { value: 'value' }, nzLabel: 'label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelectorAll('nz-select-item').length).toBe(0);
      component.value.set([{ value: 'value' }]);
      component.compareWith.set((o1: TriSafeAny, o2: TriSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2));
      await flushChanges();
      expect(selectElement.querySelectorAll('nz-select-item').length).toBe(1);
      expect(selectElement.querySelectorAll('nz-select-item')[0].textContent?.trim()).toBe('label');
    });

    it('should nzMenuItemSelectedIcon works', async () => {
      component.listOfOption.set([{ nzValue: 'value', nzLabel: 'label' }]);
      component.value.set(['value']);
      component.open.set(true);
      await flushChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(1);
      component.menuItemSelectedIcon.set(component.iconTemplate);
      fixture.detectChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(0);
      expect(document.querySelector('.ant-select-item-option-state')!.textContent?.trim()).toBe('icon');
    });

    it('should removeIcon works', async () => {
      component.listOfOption.set([{ nzValue: 'value', nzLabel: 'label' }]);
      component.value.set(['value']);
      await flushChanges();
      expect(selectElement.querySelector('.anticon-close')).toBeTruthy();
      component.removeIcon.set(component.iconTemplate);
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-selection-item-remove')!.textContent?.trim()).toBe('icon');
    });

    it('should removeIcon click works', async () => {
      component.listOfOption.set([{ nzValue: 'value', nzLabel: 'label' }]);
      component.value.set(['value']);
      await flushChanges();
      dispatchFakeEvent(selectElement.querySelector('.anticon-close')!, 'click');
      await flushChanges();
      expect(component.value().length).toBe(0);
    });

    it('should backspace works', async () => {
      component.listOfOption.set([{ nzValue: 'value', nzLabel: 'label' }]);
      component.value.set(['value']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', BACKSPACE, inputElement);
      await flushChanges();
      expect(component.value().length).toBe(0);
    });

    it('should nzTokenSeparators work', async () => {
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'label_01' },
        { nzValue: 'test_02', nzLabel: 'label_02' }
      ]);
      component.value.set([]);
      component.tokenSeparators.set([',']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
    });

    it('should nzMaxMultipleCount work', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'test_01' },
        { nzValue: 'test_02', nzLabel: 'test_02' }
      ]);
      component.value.set([]);
      component.maxMultipleCount.set(1);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(component.value().length).toBe(1);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
    });

    it('should nzAutoClearSearchValue work', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'test_01' },
        { nzValue: 'test_02', nzLabel: 'test_02' }
      ]);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(inputElement.value).toBe('');
      component.autoClearSearchValue.set(false);
      await flushChanges();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(inputElement.value).toBe('test');
    });

    it('should nzAutoClearSearchValue work when cdkOverlay send emit close', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'test_01' },
        { nzValue: 'test_02', nzLabel: 'test_02' }
      ]);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(inputElement.value).toBe('');
      component.autoClearSearchValue.set(false);
      await flushChanges();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);
      await flushChanges();
      expect(inputElement.value).toBe('test');
    });
  });

  describe('tags template mode', () => {
    let component: TestSelectTemplateTagsComponent;
    let fixture: ComponentFixture<TestSelectTemplateTagsComponent>;
    let selectElement!: HTMLElement;

    async function flushChanges(): Promise<void> {
      fixture.detectChanges();
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectTemplateTagsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    });

    it('should classname correct', () => {
      expect(selectElement.classList).toContain('ant-select-multiple');
    });

    it('should nzTokenSeparators works', async () => {
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'label_01' },
        { nzValue: 'test_02', nzLabel: 'label_02' }
      ]);
      component.value.set([]);
      component.tokenSeparators.set([',']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.value().length).toBe(2);
      expect(component.value()[0]).toBe('test_01');
      expect(component.value()[1]).toBe('test_02');
    });

    it('should nzMaxTagCount works', async () => {
      component.listOfOption.set([
        { nzValue: 'test_01', nzLabel: 'label_01' },
        { nzValue: 'test_02', nzLabel: 'label_02' },
        { nzValue: 'test_03', nzLabel: 'label_03' },
        { nzValue: 'test_04', nzLabel: 'label_04' }
      ]);
      component.value.set(['test_01', 'test_02', 'test_03', 'test_04']);
      component.maxTagCount.set(2);
      await flushChanges();
      const listOfItem = selectElement.querySelectorAll('nz-select-item');
      expect(listOfItem.length).toBe(3);
      expect(listOfItem[2].querySelector('.ant-select-selection-item-content')!.textContent?.trim()).toBe('+ 2 ...');
      component.maxTagPlaceholder.set(component.tagTemplate);
      fixture.detectChanges();
      expect(listOfItem[2].textContent?.trim()).toBe('and 2 more selected');
    });
  });

  describe('default reactive mode', () => {
    let component: TestSelectReactiveDefaultComponent;
    let fixture: ComponentFixture<TestSelectReactiveDefaultComponent>;
    let selectElement!: HTMLElement;

    async function flushChanges(): Promise<void> {
      fixture.detectChanges();
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectReactiveDefaultComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    });

    it('should ngModel match nzLabel', async () => {
      component.listOfOption.set([{ value: 'test_value', label: 'test_label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')).toBeFalsy();
      component.value.set('test_value');
      await flushChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('test_label');
      component.listOfOption.set([]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('test_label');
      expect(component.valueChange).not.toHaveBeenCalled();
    });

    it('should ngModelChange trigger when click option', async () => {
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      component.value.set('test_01');
      component.open.set(true);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith('test_02');
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(false);
    });

    it('should ngModelChange trigger when click clear icon', async () => {
      component.listOfOption.set([{ value: 'test_value', label: 'test_label' }]);
      component.value.set('test_value');
      await flushChanges();
      expect(selectElement.querySelector('nz-select-clear')).toBeFalsy();
      component.allowClear.set(true);
      fixture.detectChanges();
      dispatchMouseEvent(selectElement.querySelector('nz-select-clear')!, 'click');
      fixture.detectChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith(null);
    });

    it('should call the event emitter nzOnClear when click on te clear icon', async () => {
      component.listOfOption.set([{ value: 'test_value', label: 'test_label' }]);
      component.value.set('test_value');
      await flushChanges();
      expect(selectElement.querySelector('nz-select-clear')).toBeFalsy();
      component.allowClear.set(true);
      fixture.detectChanges();
      dispatchMouseEvent(selectElement.querySelector('nz-select-clear')!, 'click');
      fixture.detectChanges();
      expect(component.onClear).toHaveBeenCalled();
    });

    it('should nzCustomTemplate works', async () => {
      component.listOfOption.set([{ value: 'value', label: 'label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')).toBeFalsy();
      component.value.set('value');
      component.customTemplate.set(component._customTemplate);
      await flushChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('selected: label');
    });

    it('should nzShowSearch works', async () => {
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      component.showSearch.set(true);
      component.open.set(true);
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('test');
      expect(document.querySelectorAll('nz-option-item').length).toBe(2);
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item').length).toBe(1);
    });

    it('should nzFilterOption works', async () => {
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' },
        { value: 'test_03', label: 'test_03' }
      ]);
      component.showSearch.set(true);
      component.filterOption.set(() => true);
      component.open.set(true);
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item').length).toBe(3);
    });

    it('should compareWith works', async () => {
      component.listOfOption.set([{ value: { value: 'test_value' }, label: 'test_label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-item')).toBeFalsy();
      component.value.set({ value: 'test_value' });
      component.compareWith.set((o1: TriSafeAny, o2: TriSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2));
      await flushChanges();
      expect(selectElement.querySelector('nz-select-item')!.textContent?.trim()).toBe('test_label');
    });

    it('should nzServerSearch works', async () => {
      component.listOfOption.set([
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ]);
      component.serverSearch.set(true);
      component.showSearch.set(true);
      component.open.set(true);
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item').length).toBe(3);
    });

    it('should keydown up arrow and down arrow', async () => {
      component.listOfOption.set([
        { value: 'value_01', label: 'label_01' },
        { value: 'value_02', label: 'label_02', disabled: true },
        { value: 'value_03', label: 'label_03' }
      ]);
      component.value.set('value_01');
      component.open.set(true);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', UP_ARROW, inputElement);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')[2]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')[0]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      await flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledWith('value_03');
      await flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(true);
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      await flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(3);
    });

    it('should mouseenter activated option work', async () => {
      component.listOfOption.set([
        { value: 'value_01', label: 'label_01' },
        { value: 'value_02', label: 'label_02', disabled: true },
        { value: 'value_03', label: 'label_03' }
      ]);
      component.open.set(true);
      await flushChanges();
      const targetItem = document.querySelectorAll('nz-option-item')[2]!;
      expect(targetItem.classList).not.toContain('ant-select-item-option-active');
      dispatchFakeEvent(targetItem, 'mouseenter');
      await flushChanges();
      expect(targetItem.classList).toContain('ant-select-item-option-active');
    });

    it('should group item change work', async () => {
      component.listOfOption.set([{ groupLabel: 'group-1', value: 'value_01', label: 'label_01' }]);
      component.open.set(true);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')!.length).toBe(1);
      expect(document.querySelectorAll('nz-option-item-group')!.length).toBe(1);
      component.listOfOption.set([
        { value: 'value_01', label: 'label_01', groupLabel: 'group-1' },
        { value: 'value_02', label: 'label_02', groupLabel: 'group-1' },
        { value: 'value_03', label: 'label_03', groupLabel: 'group-2' }
      ]);
      await flushChanges();
      expect(document.querySelectorAll('nz-option-item')!.length).toBe(3);
      expect(document.querySelectorAll('nz-option-item-group')!.length).toBe(2);
      expect(document.querySelectorAll('nz-option-item-group')[0]!.textContent?.trim()).toBe('group-1');
      expect(document.querySelectorAll('nz-option-item')[0].textContent?.trim()).toBe('label_01');
      component.listOfOption.set([{ groupLabel: 'change-group', value: 'value_01', label: 'change-label' }]);

      fixture.detectChanges();
      expect(document.querySelectorAll('nz-option-item-group')[0]!.textContent?.trim()).toBe('change-group');
      expect(document.querySelectorAll('nz-option-item')[0].textContent?.trim()).toBe('change-label');
    });

    it('should nzAutoClearSearchValue in default mode not work when set to false', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      component.autoClearSearchValue.set(false);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      const inputElement = selectElement.querySelector('input')!;

      await flushChanges();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(inputElement.value).toBe('');
    });

    it('should group item sort be right', async () => {
      component.listOfOption.set([
        { value: 'value_01', label: 'label_01', groupLabel: 'group-1' },
        { value: 'value_02', label: 'label_02', groupLabel: 'group-1' },
        { value: 'value_03', label: 'label_03', groupLabel: 'group-2' },
        { value: 'value_04', label: 'label_04', groupLabel: 'group-2' }
      ]);
      component.open.set(true);
      await flushChanges();
      expect(
        document
          .querySelectorAll('nz-option-item')[0]
          .parentElement!.querySelector('nz-option-item')!
          .nextElementSibling!.textContent?.trim()
      ).toBe('label_02');
    });
  });

  describe('multiple reactive mode', () => {
    let component: TestSelectReactiveMultipleComponent;
    let fixture: ComponentFixture<TestSelectReactiveMultipleComponent>;
    let selectComponent: TriSelectComponent;
    let selectElement!: HTMLElement;
    let overlayContainerElement: HTMLElement;

    async function flushChanges(): Promise<void> {
      fixture.detectChanges();
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectReactiveMultipleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectComponent = fixture.debugElement.query(By.directive(TriSelectComponent)).componentInstance;
      selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
      overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();
    });

    it('should ngModel works', async () => {
      component.listOfOption.set([
        { value: 'value_01', label: 'label_01' },
        { value: 'value_02', label: 'label_02' }
      ]);
      component.value.set(['value_01', 'value_02']);
      await flushChanges();
      let listOfSelectItem = selectElement.querySelectorAll('nz-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent?.trim()).toBe('label_01');
      expect(listOfSelectItem[1].textContent?.trim()).toBe('label_02');
      component.listOfOption.set([{ value: 'value_01', label: 'label_01' }]);
      fixture.detectChanges();
      listOfSelectItem = selectElement.querySelectorAll('nz-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent?.trim()).toBe('label_01');
      expect(listOfSelectItem[1].textContent?.trim()).toBe('label_02');
      expect(component.valueChange).not.toHaveBeenCalled();
    });

    it('should click option work', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      component.value.set(['test_01']);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.value().length).toBe(2);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(2);
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
      expect(component.openChange).not.toHaveBeenCalled();
    });

    it('should compareWith works', async () => {
      component.listOfOption.set([{ value: { value: 'value' }, label: 'label' }]);
      fixture.detectChanges();
      expect(selectElement.querySelectorAll('nz-select-item').length).toBe(0);
      component.value.set([{ value: 'value' }]);
      component.compareWith.set((o1: TriSafeAny, o2: TriSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2));
      await flushChanges();
      expect(selectElement.querySelectorAll('nz-select-item').length).toBe(1);
      expect(selectElement.querySelectorAll('nz-select-item')[0].textContent?.trim()).toBe('label');
    });

    it('should nzMenuItemSelectedIcon works', async () => {
      component.listOfOption.set([{ value: 'value', label: 'label' }]);
      component.value.set(['value']);
      component.open.set(true);
      await flushChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(1);
      component.menuItemSelectedIcon.set(component.iconTemplate);
      fixture.detectChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(0);
      expect(document.querySelector('.ant-select-item-option-state')!.textContent?.trim()).toBe('icon');
    });

    it('should removeIcon works', async () => {
      component.listOfOption.set([{ value: 'value', label: 'label' }]);
      component.value.set(['value']);
      await flushChanges();
      expect(selectElement.querySelector('.anticon-close')).toBeTruthy();
      component.removeIcon.set(component.iconTemplate);
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-selection-item-remove')!.textContent?.trim()).toBe('icon');
    });

    it('should removeIcon click works', async () => {
      component.listOfOption.set([{ value: 'value', label: 'label' }]);
      component.value.set(['value']);
      await flushChanges();
      dispatchFakeEvent(selectElement.querySelector('.anticon-close')!, 'click');
      await flushChanges();
      expect(component.value().length).toBe(0);
    });

    it('should backspace works', async () => {
      component.listOfOption.set([{ value: 'value', label: 'label' }]);
      component.value.set(['value']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', BACKSPACE, inputElement);
      await flushChanges();
      expect(component.value().length).toBe(0);
    });

    it('should nzTokenSeparators work', async () => {
      component.listOfOption.set([
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' }
      ]);
      component.value.set([]);
      component.tokenSeparators.set([',']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
    });

    it('should nzTokenSeparators + nzMaxMultipleCount work', async () => {
      component.maxMultipleCount.set(1);
      component.listOfOption.set([
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' }
      ]);
      component.value.set([]);
      component.tokenSeparators.set([',']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,label_02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
    });

    it('should nzMaxMultipleCount work', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      component.value.set([]);
      component.maxMultipleCount.set(1);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(component.value().length).toBe(1);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      await flushChanges();
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
      expect(listOfContainerItem[1].classList.contains('ant-select-item-option-disabled')).toBe(true);
    });

    it('should isMaxMultipleCountSet work correct', () => {
      component.maxMultipleCount.set(Infinity);
      fixture.detectChanges();
      expect(selectComponent.isMaxMultipleCountSet).toBeFalsy();

      component.maxMultipleCount.set(1);
      fixture.detectChanges();
      expect(selectComponent.isMaxMultipleCountSet).toBeTruthy();

      component.mode.set('default');
      fixture.detectChanges();
      expect(selectComponent.isMaxMultipleCountSet).toBeFalsy();
    });

    it('should isMaxMultipleCountReached be set correctly when click options', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      component.value.set([]);
      component.maxMultipleCount.set(1);
      await flushChanges();
      expect(selectComponent.isMaxMultipleCountReached).toBeFalsy();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(selectComponent.isMaxMultipleCountReached).toBeTruthy();
    });

    it('should isMaxMultipleCountReached be set correctly when change the ng model value', async () => {
      const options = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ];
      component.open.set(true);
      component.listOfOption.set(options);
      component.value.set([]);
      component.maxMultipleCount.set(1);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      expect(selectComponent.isMaxMultipleCountReached).toBeFalsy();
      selectComponent.writeValue([options[0]]);
      await flushChanges();
      expect(selectComponent.isMaxMultipleCountReached).toBeTruthy();
      expect(listOfContainerItem[1].classList.contains('ant-select-item-option-disabled')).toBe(true);
      selectComponent.writeValue([]);
      await flushChanges();
      expect(selectComponent.isMaxMultipleCountReached).toBeFalsy();
      expect(listOfContainerItem[0].classList.contains('ant-select-item-option-disabled')).toBe(false);
      expect(listOfContainerItem[1].classList.contains('ant-select-item-option-disabled')).toBe(false);
    });

    it('should show nzShowArrow component when nzMaxMultipleCount is not Infinity', () => {
      component.maxMultipleCount.set(1);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-select-arrow')).toBeTruthy();
    });

    it('should nzAutoClearSearchValue work', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(inputElement.value).toBe('');
      component.autoClearSearchValue.set(false);
      await flushChanges();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(inputElement.value).toBe('test');
    });

    it('should nzAutoClearSearchValue work when cdkOverlay send emit close', async () => {
      component.open.set(true);
      component.listOfOption.set([
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ]);
      await flushChanges();
      const listOfContainerItem = document.querySelectorAll('nz-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      await flushChanges();
      expect(inputElement.value).toBe('');
      component.autoClearSearchValue.set(false);
      await flushChanges();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);
      fixture.detectChanges();
      await flushChanges();
      fixture.detectChanges();
      expect(inputElement.value).toBe('test');
    });
  });

  describe('tags reactive mode', () => {
    let component: TestSelectReactiveTagsComponent;
    let fixture: ComponentFixture<TestSelectReactiveTagsComponent>;
    let selectElement!: HTMLElement;

    async function flushChanges(): Promise<void> {
      fixture.detectChanges();
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectReactiveTagsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    });

    it('should nzTokenSeparators works', async () => {
      component.listOfOption.set([
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' }
      ]);
      component.value.set([]);
      component.tokenSeparators.set([',']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.value().length).toBe(2);
      expect(component.value()[0]).toBe('test_01');
      expect(component.value()[1]).toBe('test_02');
    });

    it('should nzTokenSeparators + nzMaxMultipleCount work', async () => {
      component.maxMultipleCount.set(1);
      component.listOfOption.set([
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' }
      ]);
      component.value.set([]);
      component.tokenSeparators.set([',']);
      await flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,label_02';
      dispatchFakeEvent(inputElement, 'input');
      await flushChanges();
      expect(component.value().length).toBe(1);
      expect(component.value()[0]).toBe('test_01');
    });

    it('should nzMaxTagCount works', async () => {
      component.listOfOption.set([
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' },
        { value: 'test_03', label: 'label_03' },
        { value: 'test_04', label: 'label_04' }
      ]);
      component.value.set(['test_01', 'test_02', 'test_03', 'test_04']);
      component.maxTagCount.set(2);
      await flushChanges();
      const listOfItem = selectElement.querySelectorAll('nz-select-item');
      expect(listOfItem.length).toBe(3);
      expect(listOfItem[2].querySelector('.ant-select-selection-item-content')!.textContent?.trim()).toBe('+ 2 ...');
      component.maxTagPlaceholder.set(component.tagTemplate);
      fixture.detectChanges();
      expect(listOfItem[2].textContent?.trim()).toBe('and 2 more selected');
    });
  });

  describe('change detection', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    let component: TestSelectTemplateDefaultComponent;
    let fixture: ComponentFixture<TestSelectTemplateDefaultComponent>;
    let selectComponent: TriSelectComponent;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectTemplateDefaultComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectComponent = fixture.debugElement.query(By.directive(TriSelectComponent)).componentInstance;
    });

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    }));

    it('should not run change detection if the `triggerWidth` has not been changed', () => {
      const detectChangesSpy = vi.spyOn(selectComponent['cdr'], 'detectChanges');
      // const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame'); this test is totally unstable, depends upon the order of execution

      component.open.set(true);
      fixture.detectChanges();
      // The `requestAnimationFrame` is simulated as `setTimeout(..., 16)` in the test clock.
      vi.advanceTimersByTime(16);

      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);
      fixture.detectChanges();
      vi.advanceTimersByTime(10000);

      expect(component.open()).toEqual(false);

      component.open.set(true);
      fixture.detectChanges();
      vi.advanceTimersByTime(16);

      // Ensure that the `detectChanges()` have been called only once since the `triggerWidth` hasn't been changed.
      expect(detectChangesSpy.mock.calls.length).toBeLessThanOrEqual(1);
      // expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
    });

    it('should not run change detection when `nz-select-top-control` is clicked and should focus the `nz-select-search`', () => {
      const appRef = TestBed.inject(ApplicationRef);
      vi.spyOn(appRef, 'tick').mockImplementation(() => {});

      const nzSelectSearch = fixture.debugElement.query(By.directive(TriSelectSearchComponent));
      vi.spyOn(nzSelectSearch.componentInstance, 'focus').mockImplementation(() => {});

      const nzSelectTopControl = fixture.debugElement.query(By.directive(TriSelectTopControlComponent));
      dispatchMouseEvent(nzSelectTopControl.nativeElement, 'click');

      expect(appRef.tick).toHaveBeenCalledTimes(0);
      expect(nzSelectSearch.componentInstance.focus).toHaveBeenCalled();
    });

    it('should not run change detection when non-backspace button is pressed on the `nz-select-top-control`', () => {
      const appRef = TestBed.inject(ApplicationRef);
      vi.spyOn(appRef, 'tick').mockImplementation(() => {});

      const nzSelectTopControl = fixture.debugElement.query(By.directive(TriSelectTopControlComponent));
      dispatchKeyboardEvent(nzSelectTopControl.nativeElement, 'keydown', TAB, nzSelectTopControl.nativeElement);

      expect(appRef.tick).toHaveBeenCalledTimes(0);
    });
  });

  describe('status', () => {
    let component: TestSelectStatusComponent;
    let fixture: ComponentFixture<TestSelectStatusComponent>;
    let selectElement!: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectStatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    });

    it('should classname correct', () => {
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-error');

      component.status.set('warning');
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-warning');

      component.status.set('');
      fixture.detectChanges();
      expect(selectElement.classList).not.toContain('ant-select-status-warning');
    });
  });

  describe('in form', () => {
    let component: TestSelectInFormComponent;
    let fixture: ComponentFixture<TestSelectInFormComponent>;

    async function flushChanges(): Promise<void> {
      fixture.detectChanges();
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectInFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should classname correct and be disable initially', () => {
      const selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

      expect(inputElement.disabled).toBeFalsy();
      expect(selectElement.classList).not.toContain('ant-select-disabled');
      expect(selectElement.classList).toContain('ant-select-status-error');
      expect(selectElement.classList).toContain('ant-select-in-form-item');
      expect(selectElement.querySelector('nz-form-item-feedback-icon')).toBeTruthy();

      component.status.set('warning');
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-warning');

      component.status.set('success');
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-success');

      component.feedback.set(false);
      fixture.detectChanges();
      expect(selectElement.querySelector('nz-form-item-feedback-icon')).toBeNull();
    });

    it('should be disable by default even if form is enable', async () => {
      component.disabled.set(true);
      await flushChanges();
      const selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      expect(inputElement.disabled).toBeTruthy();
      expect(selectElement.classList).toContain('ant-select-disabled');
    });

    it('should be disable if form is disabled and nzDisabled set to false', async () => {
      component.disable();
      await flushChanges();
      const selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      expect(inputElement.disabled).toBeTruthy();
      expect(selectElement.classList).toContain('ant-select-disabled');
    });
  });

  describe('placement', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    let component: TestSelectTemplateDefaultComponent;
    let fixture: ComponentFixture<TestSelectTemplateDefaultComponent>;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestSelectTemplateDefaultComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    }));

    it('should nzPlacement work', () => {
      component.open.set(true);
      fixture.detectChanges();
      let element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);
      component.open.set(false);
      component.placement.set('bottomRight');
      fixture.detectChanges();
      component.open.set(true);
      vi.advanceTimersByTime(0);
      fixture.detectChanges();
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);
      component.open.set(false);
      component.placement.set('topLeft');
      fixture.detectChanges();
      component.open.set(true);
      vi.advanceTimersByTime(0);
      fixture.detectChanges();
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);
      component.open.set(false);
      component.placement.set('topRight');
      fixture.detectChanges();
      component.open.set(true);
      vi.advanceTimersByTime(0);
      fixture.detectChanges();
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(true);
      component.open.set(false);
      fixture.detectChanges();
      vi.advanceTimersByTime(10000);
    });
  });
});

describe('select finalSize', () => {
  let fixture: ComponentFixture<TestSelectFinalSizeComponent>;
  let selectElement: HTMLElement;
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
    fixture = TestBed.createComponent(TestSelectFinalSizeComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('large');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-lg');
  });
  it('should set correctly the size from the compactSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_SPACE_COMPACT_SIZE, useValue: compactSizeSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalSizeComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-lg');
  });
  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TestSelectFinalSizeComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.size.set('large');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-lg');
  });
});

describe('select finalVariant', () => {
  let fixture: ComponentFixture<TestSelectFinalVariantComponent>;
  let selectElement: HTMLElement;
  let formVariantSignal: WritableSignal<TriVariant>;

  beforeEach(() => {
    formVariantSignal = signal<TriVariant>('outlined');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should use formVariant when nzVariant is not set (undefined by default)', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-filled');
  });

  it('should use nzVariant over formVariant when nzVariant is explicitly set', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('borderless');
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-borderless');
    expect(selectElement.classList).not.toContain('ant-select-filled');
  });

  it('should use nzVariant outlined over formVariant when explicitly set', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('outlined');
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).not.toContain('ant-select-filled');
  });

  it('should use nzVariant when no formVariant is provided', () => {
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-filled');
  });

  it('should default to outlined when neither nzVariant nor formVariant is set', () => {
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    expect(selectElement.classList).not.toContain('ant-select-filled');
    expect(selectElement.classList).not.toContain('ant-select-borderless');
    expect(selectElement.classList).not.toContain('ant-select-underlined');
  });
});

describe('select finalSize', () => {
  let fixture: ComponentFixture<TestSelectFinalSizeComponent>;
  let selectElement: HTMLElement;
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
    fixture = TestBed.createComponent(TestSelectFinalSizeComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('large');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-lg');
  });
  it('should set correctly the size from the compactSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_SPACE_COMPACT_SIZE, useValue: compactSizeSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalSizeComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-lg');
  });
  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TestSelectFinalSizeComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.size = 'large';
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-lg');
  });
});

describe('select finalVariant', () => {
  let fixture: ComponentFixture<TestSelectFinalVariantComponent>;
  let selectElement: HTMLElement;
  let formVariantSignal: WritableSignal<TriVariant>;

  beforeEach(() => {
    formVariantSignal = signal<TriVariant>('outlined');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should use formVariant when nzVariant is not set (undefined by default)', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-filled');
  });

  it('should use nzVariant over formVariant when nzVariant is explicitly set', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('borderless');
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-borderless');
    expect(selectElement.classList).not.toContain('ant-select-filled');
  });

  it('should use nzVariant outlined over formVariant when explicitly set', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('outlined');
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).not.toContain('ant-select-filled');
  });

  it('should use nzVariant when no formVariant is provided', () => {
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('filled');
    fixture.detectChanges();
    expect(selectElement.classList).toContain('ant-select-filled');
  });

  it('should default to outlined when neither nzVariant nor formVariant is set', () => {
    fixture = TestBed.createComponent(TestSelectFinalVariantComponent);
    selectElement = fixture.debugElement.query(By.directive(TriSelectComponent)).nativeElement;
    fixture.detectChanges();
    expect(selectElement.classList).not.toContain('ant-select-filled');
    expect(selectElement.classList).not.toContain('ant-select-borderless');
    expect(selectElement.classList).not.toContain('ant-select-underlined');
  });
});

@Component({
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      mode="default"
      [(ngModel)]="value"
      (ngModelChange)="valueChange($event)"
      [size]="size()"
      [dropdownMatchSelectWidth]="dropdownMatchSelectWidth"
      [placeHolder]="placeHolder()"
      [dropdownRender]="dropdownRender()"
      [customTemplate]="customTemplate() ?? null"
      [prefix]="prefix()"
      [suffixIcon]="suffixIcon()"
      [clearIcon]="clearIcon()"
      [showArrow]="showArrow()"
      [filterOption]="filterOption()"
      [compareWith]="compareWith()"
      [allowClear]="allowClear()"
      [variant]="variant()"
      [showSearch]="showSearch()"
      [loading]="loading"
      [autoFocus]="autoFocus()"
      [serverSearch]="serverSearch()"
      [disabled]="disabled()"
      [backdrop]="backdrop()"
      [(openChange)]="open"
      (openChange)="openChange($event)"
      [placement]="placement()"
      [selectOnTab]="selectOnTab()"
      [maxMultipleCount]="maxMultipleCount()"
      (onSearch)="searchValueChange($event)"
    >
      @for (o of listOfOption(); track value) {
        <tri-option
          [value]="value"
          [label]="label"
          [title]="title"
          [disabled]="disabled"
          [hide]="hide"
        />
      }
      @for (group of listOfGroup(); track label) {
        <tri-option-group [label]="label">
          @for (o of group.children; track o) {
            <tri-option
              [value]="value"
              [label]="label"
              [title]="title"
              [disabled]="disabled"
              [hide]="hide"
            />
          }
        </tri-option-group>
      }
    </tri-select>
    <ng-template #dropdownTemplate><div class="dropdown-render">dropdownRender</div></ng-template>
    <ng-template #customTemplate let-selected>selected: {{ selected.nzLabel }}</ng-template>
    <ng-template #affixTemplate>icon</ng-template>
  `
})
export class TestSelectTemplateDefaultComponent {
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<TriSafeAny>;
  @ViewChild('customTemplate') _customTemplate!: TemplateRef<TriSafeAny>;
  @ViewChild('affixTemplate') affixTemplate!: TemplateRef<TriSafeAny>;
  readonly value = signal<TriSafeAny | null>(null);
  readonly open = signal(false);
  valueChange = vi.fn<(value: TriSafeAny) => void>();
  openChange = vi.fn<(open: TriSafeAny) => void>();
  searchValueChange = vi.fn<(value: TriSafeAny) => void>();
  readonly listOfGroup = signal<
    Array<{ nzLabel: string | TemplateRef<TriSafeAny> | null; children: TriSelectItemInterface[] }>
  >([]);
  readonly listOfOption = signal<TriSelectItemInterface[]>([]);
  readonly size = signal<TriSelectSizeType>('default');
  dropdownMatchSelectWidth = true;
  readonly placeHolder = signal<string | TemplateRef<TriSafeAny> | null>(null);
  readonly dropdownRender = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly customTemplate = signal<TemplateRef<{ $implicit: TriSelectItemInterface }> | undefined>(undefined);
  readonly prefix = signal<string | TemplateRef<TriSafeAny> | null>(null);
  readonly suffixIcon = signal<string | TemplateRef<TriSafeAny> | null>(null);
  readonly clearIcon = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly showArrow = signal(true);
  readonly maxMultipleCount = signal<number>(Infinity);
  readonly filterOption = signal<TriFilterOptionType>((searchValue: string, item: TriSelectItemInterface): boolean => {
    if (item && item.nzLabel) {
      return item.nzLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    } else {
      return false;
    }
  });
  readonly compareWith = signal<(o1: TriSafeAny, o2: TriSafeAny) => boolean>((o1: TriSafeAny, o2: TriSafeAny) => o1 === o2);
  readonly allowClear = signal(false);
  readonly variant = signal<TriVariant | undefined>(undefined);
  readonly showSearch = signal(false);
  loading = false;
  readonly autoFocus = signal(false);
  readonly serverSearch = signal(false);
  readonly disabled = signal(false);
  readonly backdrop = signal(false);
  readonly selectOnTab = signal(false);
  readonly placement = signal<TriSelectPlacementType | null>('bottomLeft');
}

@Component({
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      mode="multiple"
      [(ngModel)]="value"
      (ngModelChange)="valueChange($event)"
      [menuItemSelectedIcon]="menuItemSelectedIcon()"
      [tokenSeparators]="tokenSeparators()"
      [removeIcon]="removeIcon()"
      [maxMultipleCount]="maxMultipleCount()"
      [compareWith]="compareWith()"
      [autoClearSearchValue]="autoClearSearchValue()"
      [(openChange)]="open"
      (openChange)="valueChange($event)"
    >
      @for (o of listOfOption(); track value) {
        <tri-option [value]="value" [label]="label" [disabled]="disabled" [hide]="hide" />
      }
    </tri-select>
    <ng-template #iconTemplate>icon</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestSelectTemplateMultipleComponent {
  @ViewChild('iconTemplate') iconTemplate!: TemplateRef<TriSafeAny>;
  readonly listOfOption = signal<TriSelectItemInterface[]>([]);
  readonly value = signal<TriSafeAny>([]);
  readonly open = signal(false);
  valueChange = vi.fn<(value: TriSafeAny) => void>();
  openChange = vi.fn<(open: TriSafeAny) => void>();
  readonly menuItemSelectedIcon = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly removeIcon = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly tokenSeparators = signal<string[]>([]);
  readonly maxMultipleCount = signal(Infinity);
  readonly compareWith = signal<(o1: TriSafeAny, o2: TriSafeAny) => boolean>((o1: TriSafeAny, o2: TriSafeAny) => o1 === o2);
  readonly autoClearSearchValue = signal(true);
}

@Component({
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      mode="tags"
      [(ngModel)]="value"
      (ngModelChange)="valueChange($event)"
      [size]="size()"
      [maxTagCount]="maxTagCount()"
      [tokenSeparators]="tokenSeparators()"
      [maxTagPlaceholder]="maxTagPlaceholder() ?? null"
    >
      @for (o of listOfOption(); track value) {
        <tri-option [value]="value" [label]="label" [disabled]="disabled" [hide]="hide" />
      }
    </tri-select>
    <ng-template #tagTemplate let-selectedList>and {{ selectedList.length }} more selected</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestSelectTemplateTagsComponent {
  @ViewChild('tagTemplate') tagTemplate!: TemplateRef<TriSafeAny>;
  readonly size = signal<TriSelectSizeType>('default');
  readonly maxTagCount = signal(Infinity);
  readonly value = signal<TriSafeAny[]>([]);
  readonly listOfOption = signal<TriSelectItemInterface[]>([]);
  valueChange = vi.fn();
  readonly tokenSeparators = signal<string[]>([]);
  readonly maxTagPlaceholder = signal<TemplateRef<{ $implicit: TriSafeAny[] }> | undefined>(undefined);
}

@Component({
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      mode="default"
      [(ngModel)]="value"
      (ngModelChange)="valueChange($event)"
      [options]="listOfOption()"
      [size]="size()"
      [dropdownMatchSelectWidth]="dropdownMatchSelectWidth"
      [placeHolder]="placeHolder()"
      [dropdownRender]="dropdownRender()"
      [customTemplate]="customTemplate() ?? null"
      [suffixIcon]="suffixIcon()"
      [clearIcon]="clearIcon()"
      [showArrow]="showArrow()"
      [filterOption]="filterOption()"
      [compareWith]="compareWith()"
      [allowClear]="allowClear()"
      [showSearch]="showSearch()"
      [loading]="loading"
      [autoFocus]="autoFocus()"
      [serverSearch]="serverSearch()"
      [disabled]="disabled()"
      [autoClearSearchValue]="autoClearSearchValue()"
      [(openChange)]="open"
      (openChange)="openChange($event)"
      (onSearch)="searchValueChange($event)"
      (onClear)="onClear()"
    />
    <ng-template #dropdownTemplate><div class="dropdown-render">dropdownRender</div></ng-template>
    <ng-template #customTemplate let-selected>selected: {{ selected.nzLabel }}</ng-template>
    <ng-template #suffixIconTemplate>icon</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestSelectReactiveDefaultComponent {
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<TriSafeAny>;
  @ViewChild('customTemplate') _customTemplate!: TemplateRef<TriSafeAny>;
  @ViewChild('suffixIconTemplate') suffixIconTemplate!: TemplateRef<TriSafeAny>;
  readonly value = signal<TriSafeAny | null>(null);
  readonly open = signal(false);
  valueChange = vi.fn<(value: TriSafeAny) => void>();
  openChange = vi.fn<(open: TriSafeAny) => void>();
  readonly autoClearSearchValue = signal(true);

  onClear = vi.fn<() => void>();
  searchValueChange = vi.fn<(value: TriSafeAny) => void>();
  readonly listOfOption = signal<TriSelectOptionInterface[]>([]);
  readonly size = signal<TriSelectSizeType>('default');
  dropdownMatchSelectWidth = true;
  readonly placeHolder = signal<string | TemplateRef<TriSafeAny> | null>(null);
  readonly dropdownRender = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly customTemplate = signal<TemplateRef<{ $implicit: TriSelectItemInterface }> | undefined>(undefined);
  readonly suffixIcon = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly clearIcon = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly showArrow = signal(true);
  readonly filterOption = signal<TriFilterOptionType>((searchValue: string, item: TriSelectItemInterface): boolean => {
    if (item && item.nzLabel) {
      return item.nzLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    } else {
      return false;
    }
  });
  readonly compareWith = signal<(o1: TriSafeAny, o2: TriSafeAny) => boolean>((o1: TriSafeAny, o2: TriSafeAny) => o1 === o2);
  readonly allowClear = signal(false);
  readonly showSearch = signal(false);
  loading = false;
  readonly autoFocus = signal(false);
  readonly serverSearch = signal(false);
  readonly disabled = signal(false);
}

@Component({
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      [mode]="mode()"
      [(ngModel)]="value"
      (ngModelChange)="valueChange($event)"
      [options]="listOfOption()"
      [menuItemSelectedIcon]="menuItemSelectedIcon()"
      [tokenSeparators]="tokenSeparators()"
      [removeIcon]="removeIcon()"
      [maxMultipleCount]="maxMultipleCount()"
      [compareWith]="compareWith()"
      [autoClearSearchValue]="autoClearSearchValue()"
      [(openChange)]="open"
      (openChange)="valueChange($event)"
    />
    <ng-template #iconTemplate>icon</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestSelectReactiveMultipleComponent {
  @ViewChild('iconTemplate') iconTemplate!: TemplateRef<TriSafeAny>;
  readonly listOfOption = signal<TriSelectOptionInterface[]>([]);
  readonly value = signal<TriSafeAny[]>([]);
  readonly open = signal(false);
  valueChange = vi.fn();
  openChange = vi.fn();
  readonly menuItemSelectedIcon = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly removeIcon = signal<TemplateRef<TriSafeAny> | null>(null);
  readonly tokenSeparators = signal<string[]>([]);
  readonly maxMultipleCount = signal(Infinity);
  readonly mode = signal<TriSelectModeType>('multiple');
  readonly compareWith = signal<(o1: TriSafeAny, o2: TriSafeAny) => boolean>((o1: TriSafeAny, o2: TriSafeAny) => o1 === o2);
  readonly autoClearSearchValue = signal(true);
}

@Component({
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      mode="tags"
      [(ngModel)]="value"
      (ngModelChange)="valueChange($event)"
      [options]="listOfOption()"
      [size]="size()"
      [maxTagCount]="maxTagCount()"
      [maxMultipleCount]="maxMultipleCount()"
      [tokenSeparators]="tokenSeparators()"
      [maxTagPlaceholder]="maxTagPlaceholder() ?? null"
    />
    <ng-template #tagTemplate let-selectedList>and {{ selectedList.length }} more selected</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestSelectReactiveTagsComponent {
  @ViewChild('tagTemplate') tagTemplate?: TemplateRef<TriSafeAny>;
  readonly size = signal<TriSelectSizeType>('default');
  readonly maxTagCount = signal(Infinity);
  readonly value = signal<TriSafeAny[]>([]);
  readonly listOfOption = signal<TriSelectOptionInterface[]>([]);
  valueChange = vi.fn();
  readonly tokenSeparators = signal<string[]>([]);
  readonly maxTagPlaceholder = signal<TemplateRef<TriSafeAny> | undefined>(undefined);
  readonly maxMultipleCount = signal<number | undefined>(undefined);
}

@Component({
  imports: [TriSelectModule],
  template: `<tri-select [status]="status()" />`
})
export class TestSelectStatusComponent {
  readonly status = signal<TriStatus>('error');
}

@Component({
  imports: [ReactiveFormsModule, TriFormModule, TriSelectModule],
  template: `
    <form tri-form [formGroup]="selectForm">
      <tri-form-item>
        <tri-form-control [hasFeedback]="feedback()" [validateStatus]="status()">
          <tri-select formControlName="selectControl" [options]="[]" [disabled]="disabled()" />
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TestSelectInFormComponent {
  selectForm = new FormGroup({
    selectControl: new FormControl(null)
  });
  readonly status = signal<TriFormControlStatusType>('error');
  readonly feedback = signal(true);

  readonly disabled = signal(false);

  disable(): void {
    this.selectForm.disable();
  }

  enable(): void {
    this.selectForm.enable();
  }
}

@Component({
  imports: [TriSelectModule],
  template: `<tri-select [size]="size()" />`
})
export class TestSelectFinalSizeComponent {
  readonly size = signal<TriSelectSizeType>('default');
}

@Component({
  imports: [TriSelectModule],
  template: `<tri-select [variant]="variant()" />`
})
export class TestSelectFinalVariantComponent {
  readonly variant = signal<TriVariant | undefined>(undefined);
}
