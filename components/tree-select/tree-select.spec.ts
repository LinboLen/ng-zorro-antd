/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BACKSPACE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestKey } from '@angular/cdk/testing';
import { UnitTestElement } from '@angular/cdk/testing/testbed';
import { Component, DebugElement, NgZone, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { TRI_FORM_SIZE, TRI_FORM_VARIANT } from 'ng-zorro-antd/core/form';
import {
  createKeyboardEvent,
  dispatchFakeEvent,
  dispatchMouseEvent,
  MockNgZone,
  typeInElement,
  updateNonSignalsInput
} from 'ng-zorro-antd/core/testing';
import { TriTreeNode, TriTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { TriSizeLDSType, TriStatus, TriVariant } from 'ng-zorro-antd/core/types';
import { TriFormControlStatusType, TriFormModule } from 'ng-zorro-antd/form';
import { TRI_SPACE_COMPACT_SIZE } from 'ng-zorro-antd/space';

import { TriPlacementType, TriTreeSelectComponent } from './tree-select.component';
import { TriTreeSelectModule } from './tree-select.module';

describe('tree-select', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNzNoAnimation(),
        {
          provide: NgZone,
          useFactory: () => {
            zone = new MockNgZone();
            return zone;
          }
        }
      ]
    });
  });

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriTestTreeSelectBasicComponent>;
    let testComponent: TriTestTreeSelectBasicComponent;
    let treeSelectComponent: TriTreeSelectComponent;
    let treeSelect: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent));
      treeSelectComponent = treeSelect.componentInstance;
    });

    it('should size work', () => {
      testComponent.size.set('small');
      fixture.detectChanges();
      expect(treeSelect.nativeElement.classList).toContain('ant-select-sm');
      testComponent.size.set('large');
      fixture.detectChanges();
      expect(treeSelect.nativeElement.classList).toContain('ant-select-lg');
    });

    it('should placement works', async () => {
      treeSelectComponent.openDropdown();
      fixture.detectChanges();
      let element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);

      const setPlacement = async (placement: TriPlacementType): Promise<void> => {
        treeSelectComponent.closeDropdown();
        fixture.detectChanges();
        testComponent.placement.set(placement);
        fixture.detectChanges();
        treeSelectComponent.openDropdown();
        fixture.detectChanges();
        await fixture.whenStable();
      };

      await setPlacement('bottomRight');
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);

      await setPlacement('topLeft');
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);

      await setPlacement('topRight');
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(true);
    });

    describe('should variant works', () => {
      it('outlined', () => {
        testComponent.variant.set('outlined');
        fixture.detectChanges();
        expect(treeSelect.nativeElement.classList).toContain('ant-select-outlined');
      });

      it('filled', () => {
        fixture.detectChanges();
        expect(treeSelect.nativeElement.classList).not.toContain('ant-select-filled');
        testComponent.variant.set('filled');
        fixture.detectChanges();
        expect(treeSelect.nativeElement.classList).toContain('ant-select-filled');
      });

      it('borderless', () => {
        fixture.detectChanges();
        expect(treeSelect.nativeElement.classList).not.toContain('ant-select-borderless');
        testComponent.variant.set('borderless');
        fixture.detectChanges();
        expect(treeSelect.nativeElement.classList).toContain('ant-select-borderless');
      });

      it('underlined', () => {
        fixture.detectChanges();
        expect(treeSelect.nativeElement.classList).not.toContain('ant-select-underlined');
        testComponent.variant.set('underlined');
        fixture.detectChanges();
        expect(treeSelect.nativeElement.classList).toContain('ant-select-underlined');
      });
    });

    it('should allowClear work', async () => {
      const nativeElement = treeSelect.nativeElement as HTMLElement;
      expect(nativeElement.classList).not.toContain('ant-select-allow-clear');
      expect(nativeElement.querySelector('nz-select-clear')).toBeNull();
      testComponent.allowClear.set(true);
      await fixture.whenStable();
      expect(nativeElement.classList).toContain('ant-select-allow-clear');
      expect(nativeElement.querySelector('nz-select-clear')).not.toBeNull();

      (nativeElement.querySelector('nz-select-clear') as HTMLElement)!.click();
      fixture.detectChanges();

      expect(nativeElement.querySelector('nz-select-clear')).toBeNull();
    });

    it('should click toggle open', () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(false);
    });

    it('should close when the outside clicks', () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      dispatchFakeEvent(document.body, 'click');
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(false);
      fixture.detectChanges();
    });

    it('should disabled work', async () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      expect(treeSelect.nativeElement.classList).toContain('ant-select-disabled');
      expect(treeSelectComponent.open).toBe(false);
      treeSelect.nativeElement.click();
      await fixture.whenStable();
      expect(treeSelectComponent.open).toBe(false);
    });

    it('should dropdownMatchSelectWidth work', async () => {
      testComponent.dropdownMatchSelectWidth.set(true);
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
      expect(overlayPane.style.width).toBe('250px');

      treeSelectComponent.closeDropdown();
      fixture.detectChanges();
      testComponent.dropdownMatchSelectWidth.set(false);
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      await updateNonSignalsInput(fixture, 16);
      fixture.detectChanges();
      expect(overlayPane.style.minWidth).toBe('250px');
    });

    it('should clear value work', async () => {
      testComponent.allowClear.set(true);
      await fixture.whenStable();
      expect(testComponent.value()).toBe('10001');
      treeSelectComponent.updateSelectedNodes();
      fixture.detectChanges();
      treeSelect.nativeElement.querySelector('nz-select-clear').click();
      await fixture.whenStable();
      expect(testComponent.value()).toBe(null);
    });

    it('should set null value work', async () => {
      fixture.detectChanges();
      expect(testComponent.value()).toBe('10001');
      testComponent.selectTreeComponent.updateSelectedNodes();
      fixture.detectChanges();
      testComponent.setNull();
      await fixture.whenStable();
      expect(testComponent.value()).toBe(null);
      expect(testComponent.selectTreeComponent.selectedNodes.length).toEqual(0);
      expect(testComponent.selectTreeComponent.value.length).toBe(0);
    });

    it('should dropdown style work', () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      const targetElement = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(targetElement.style.height).toBe('120px');
    });

    it('should dropdown classname work', () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      const targetElement = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(targetElement.classList).toContain('class1');
      expect(targetElement.classList).toContain('class2');
    });

    it('should click option close dropdown', async () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      fixture.detectChanges();
      const targetNode = overlayContainerElement.querySelectorAll('.ant-select-tree-node-content-wrapper')[2];
      dispatchMouseEvent(targetNode, 'click');
      await fixture.whenStable();
      expect(treeSelectComponent.open).toBe(false);
    });

    it('should be focusable', async () => {
      const focusTrigger = treeSelect.query(By.css('.ant-select-selection-search-input')).nativeElement;
      expect(treeSelect.nativeElement.classList).not.toContain('ant-select-focused');
      dispatchFakeEvent(focusTrigger, 'focus');
      await fixture.whenStable();
      expect(treeSelect.nativeElement.classList).toContain('ant-select-focused');
    });

    async function noop(): Promise<void> {
      // noop
    }

    it('should open dropdown when keydown', async () => {
      const testElement = new UnitTestElement(treeSelect.nativeElement, noop);
      expect(treeSelectComponent.open).toBe(false);

      await testElement.sendKeys(TestKey.ESCAPE);
      expect(treeSelectComponent.open).toBe(false);

      await testElement.sendKeys(TestKey.ENTER);
      expect(treeSelectComponent.open).toBe(true);
    });

    it('should close dropdown when TAB keydown', async () => {
      const testElement = new UnitTestElement(treeSelect.nativeElement, noop);

      treeSelectComponent.open = true;
      await updateNonSignalsInput(fixture);
      await testElement.sendKeys(TestKey.TAB);
      expect(treeSelectComponent.open).toBe(false);
    });

    it('should showSearch work', async () => {
      treeSelectComponent.updateSelectedNodes();
      fixture.detectChanges();
      testComponent.showSearch.set(true);
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      const searchInput = treeSelect.nativeElement.querySelector('nz-select-search .ant-select-selection-search-input');
      expect(searchInput).toBeTruthy();
      expect(searchInput.style.opacity).toBe('');
      testComponent.showSearch.set(false);
      fixture.detectChanges();
      expect(searchInput.style.opacity).toBe('0');
    });

    it('should display no data', async () => {
      treeSelectComponent.updateSelectedNodes();
      fixture.detectChanges();
      testComponent.showSearch.set(true);
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('nz-tree')!.getAttribute('hidden')).toBeNull();
      expect(overlayContainerElement.querySelector('.ant-select-not-found')).toBeFalsy();
      fixture.detectChanges();
      treeSelectComponent.setInputValue('invalid_value');
      await updateNonSignalsInput(fixture, 16);
      expect(overlayContainerElement.querySelector('nz-tree')!.getAttribute('hidden')).toBe('');
      expect(overlayContainerElement.querySelector('.ant-select-not-found')).toBeTruthy();
    });

    it('should clean search value when reopen', async () => {
      testComponent.showSearch.set(true);
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      treeSelectComponent.setInputValue('invalid_value');
      await updateNonSignalsInput(fixture, 16);
      expect(overlayContainerElement.querySelector('.ant-select-not-found')).toBeTruthy();

      treeSelect.nativeElement.click();
      await fixture.whenStable();
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.ant-select-not-found')).toBeFalsy();
    });

    it('should max tag count work', async () => {
      fixture.detectChanges();
      testComponent.multiple.set(true);
      fixture.detectChanges();
      testComponent.value.set(['1001', '10001', '100011', '100012']);
      await updateNonSignalsInput(fixture);
      expect(treeSelect.nativeElement.querySelectorAll('nz-select-item').length).toBe(4);

      testComponent.maxTagCount.set(2);
      await updateNonSignalsInput(fixture);
      expect(treeSelect.nativeElement.querySelectorAll('nz-select-item').length).toBe(3);
      const maxTagPlaceholderElement = treeSelect.nativeElement.querySelectorAll('nz-select-item')[2];
      expect(maxTagPlaceholderElement).toBeTruthy();
      expect(maxTagPlaceholderElement.innerText.trim()).toBe(
        `+ ${testComponent.value()!.length - testComponent.maxTagCount()} ...`
      );
    });

    it('should set selectable', async () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);

      let node = overlayContainerElement.querySelector('.ant-select-tree-node-content-wrapper')!;
      dispatchMouseEvent(node, 'click');
      await fixture.whenStable();
      expect(treeSelectComponent.open).toBe(false);

      testComponent.nodes.update(nodes => [{ ...nodes[0], selectable: false }, ...nodes.slice(1)]);
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);

      node = overlayContainerElement.querySelector('nz-tree-node[builtin]')!;
      dispatchMouseEvent(node, 'click');
      await fixture.whenStable();
      expect(treeSelectComponent.open).toBe(true);
    });

    it('should nzBackdrop work', () => {
      testComponent.hasBackdrop.set(true);
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      const boundingBox = overlayContainerElement.children[0];
      expect(boundingBox.children[0].classList).toContain('cdk-overlay-backdrop');
    });

    it('should isComposing/inputValue is correct', async () => {
      treeSelectComponent.inputValue = '';
      treeSelectComponent.isComposingChange(true);
      treeSelectComponent.setInputValue('1011');
      await updateNonSignalsInput(fixture);
      expect(treeSelectComponent.isComposing).toBe(true);
      expect(treeSelectComponent.inputValue).toBe('');
    });

    it('should nzPrefix work', () => {
      const host = fixture.debugElement.nativeElement;
      testComponent.prefix.set('prefix');
      fixture.detectChanges();
      expect(host.querySelector('.ant-select-prefix')!.textContent?.trim()).toBe('prefix');

      testComponent.prefix.set(testComponent.affixTemplate);
      fixture.detectChanges();
      expect(host.querySelector('.ant-select-prefix')!.textContent?.trim()).toBe('icon');
    });

    it('should nzSuffixIcon work', () => {
      const host = fixture.debugElement.nativeElement;
      expect(host.querySelector('.anticon-down')).toBeTruthy();
      testComponent.suffixIcon.set(testComponent.affixTemplate);
      fixture.detectChanges();
      expect(host.querySelector('nz-select-arrow')!.textContent?.trim()).toBe('icon');
    });
  });

  describe('checkable', () => {
    let fixture: ComponentFixture<TriTestTreeSelectCheckableComponent>;
    let testComponent: TriTestTreeSelectCheckableComponent;
    let treeSelectComponent: TriTreeSelectComponent;
    let treeSelect: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectCheckableComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent));
      treeSelectComponent = treeSelect.componentInstance;
    });

    it('should is multiple', async () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);
      expect(treeSelectComponent.isMultiple).toBe(true);
    });

    it('should update input width', async () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      testComponent.showSearch.set(true);
      await fixture.whenStable();
      const input = treeSelect.nativeElement.querySelector('input') as HTMLInputElement;
      typeInElement('test', input);
      await fixture.whenStable();
      typeInElement('test test test', input);
      await fixture.whenStable();
      typeInElement('', input);
      await fixture.whenStable();
      zone.simulateZoneExit();
      fixture.detectChanges();
      expect(input.style.width).toBe('');
    });

    it('should set null value work', async () => {
      expect(testComponent.value()![0]).toBe('1000122');
      testComponent.setNull();
      await fixture.whenStable();
      expect(testComponent.value()).toBe(null);
      expect(testComponent.selectTreeComponent.selectedNodes.length).toBe(0);
      expect(testComponent.selectTreeComponent.value.length).toBe(0);
    });

    it('should not check strictly work', async () => {
      testComponent.value.set(['1001', '10001', '100012']);
      await fixture.whenStable();
      expect(testComponent.selectTreeComponent.selectedNodes.length).toBe(1);
    });

    it('should check strictly work', async () => {
      testComponent.checkStrictly.set(true);
      testComponent.value.set(['1001', '10001', '100012']);
      await fixture.whenStable();
      expect(testComponent.selectTreeComponent.selectedNodes.length).toBe(3);
    });

    it('should remove checked when press backs', async () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      testComponent.showSearch.set(true);
      await fixture.whenStable();

      const input = treeSelect.nativeElement.querySelector('input') as HTMLInputElement;
      const BACKSPACE_EVENT = createKeyboardEvent('keydown', BACKSPACE, input);
      treeSelectComponent.updateSelectedNodes();
      fixture.detectChanges();
      expect(treeSelectComponent.selectedNodes.length).toBe(1);

      treeSelectComponent.onKeyDownInput(BACKSPACE_EVENT);
      await updateNonSignalsInput(fixture);
      expect(treeSelectComponent.selectedNodes.length).toBe(0);

      treeSelectComponent.onKeyDownInput(BACKSPACE_EVENT);
      await updateNonSignalsInput(fixture);
      expect(treeSelectComponent.selectedNodes.length).toBe(0);
    });

    it('should click option not close dropdown', async () => {
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(true);

      const targetNode = overlayContainerElement.querySelectorAll('nz-tree-node[builtin]')[2];
      dispatchMouseEvent(targetNode, 'click');
      await fixture.whenStable();
      expect(treeSelectComponent.open).toBe(true);
    });

    it('should prevent open the dropdown when click remove', async () => {
      testComponent.value.set(['1000122']);
      await fixture.whenStable();
      expect(treeSelectComponent.selectedNodes.length).toBe(1);

      treeSelect.nativeElement.querySelector('.ant-select-selection-item-remove').click();
      await fixture.whenStable();
      expect(treeSelectComponent.selectedNodes.length).toBe(0);
      expect(treeSelectComponent.open).toBe(false);
    });

    it('should display no data', async () => {
      treeSelectComponent.updateSelectedNodes();
      fixture.detectChanges();
      testComponent.showSearch.set(true);
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('nz-tree')!.getAttribute('hidden')).toBeNull();
      expect(overlayContainerElement.querySelector('.ant-select-not-found')).toBeFalsy();

      treeSelectComponent.setInputValue('invalid_value');
      await updateNonSignalsInput(fixture, 16);
      expect(overlayContainerElement.querySelector('nz-tree')!.getAttribute('hidden')).toBe('');
      expect(overlayContainerElement.querySelector('.ant-select-not-found')).toBeTruthy();
    });
  });

  describe('form', () => {
    let fixture: ComponentFixture<TriTestTreeSelectFormComponent>;
    let testComponent: TriTestTreeSelectFormComponent;
    let treeSelect: DebugElement;
    let treeSelectComponent: TriTreeSelectComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectFormComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent));
      treeSelectComponent = treeSelect.componentInstance;
    });

    it('should set disabled work', async () => {
      const nativeElement = treeSelect.nativeElement as HTMLElement;
      expect(nativeElement.classList).not.toContain('ant-select-disabled');
      expect(nativeElement.querySelector('nz-select-clear')).not.toBeNull();

      testComponent.disable();
      await fixture.whenStable();
      expect(nativeElement.classList).toContain('ant-select-disabled');
      expect(nativeElement.querySelector('nz-select-clear')).toBeNull();
    });

    it('should set null value work', async () => {
      expect(testComponent.formControl.value).toBe('10021');
      testComponent.setNull();
      await fixture.whenStable();
      expect(testComponent.formControl.value).toBe(null);
      expect(treeSelectComponent.selectedNodes.length).toBe(0);
      expect(treeSelectComponent.value.length).toBe(0);
    });
  });

  describe('tree component', () => {
    let fixture: ComponentFixture<TriTestTreeSelectCheckableComponent>;
    let testComponent: TriTestTreeSelectCheckableComponent;
    let treeSelectComponent: TriTreeSelectComponent;
    let treeSelect: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectCheckableComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent));
      treeSelectComponent = treeSelect.componentInstance;
    });

    it('should keep expand state', () => {
      testComponent.expandKeys.set([]);
      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.expandedKeys.length === 0).toBe(true);
      expect(treeSelectComponent.open).toBe(true);
      let targetSwitcher = overlayContainerElement.querySelector('.ant-select-tree-switcher')!;
      expect(targetSwitcher.classList.contains('ant-select-tree-switcher_close')).toBe(true);

      dispatchMouseEvent(targetSwitcher, 'click');
      fixture.detectChanges();
      targetSwitcher = overlayContainerElement.querySelector('.ant-select-tree-switcher')!;
      expect(targetSwitcher.classList.contains('ant-select-tree-switcher_open')).toBe(true);
      expect(treeSelectComponent.expandedKeys[0] === '1001').toBe(true);

      treeSelect.nativeElement.click();
      fixture.detectChanges();
      expect(treeSelectComponent.open).toBe(false);

      treeSelect.nativeElement.click();
      fixture.detectChanges();
      targetSwitcher = overlayContainerElement.querySelector('.ant-select-tree-switcher')!;
      expect(treeSelectComponent.open).toBe(true);
      expect(targetSwitcher.classList.contains('ant-select-tree-switcher_open')).toBe(true);
      expect(treeSelectComponent.expandedKeys[0] === '1001').toBe(true);
    });
  });

  describe('customized icon', () => {
    let fixture: ComponentFixture<TriTestTreeSelectCustomizedIconComponent>;
    let treeSelect: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectCustomizedIconComponent);
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent));
    });

    it('should display', async () => {
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      await fixture.whenStable();
      expect(overlayContainerElement.querySelector('.anticon.anticon-frown-o')).toBeTruthy();
    });
  });

  describe('Status', () => {
    let fixture: ComponentFixture<TriTestTreeSelectStatusComponent>;
    let treeSelect: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectStatusComponent);
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(treeSelect.nativeElement.className).toContain('ant-select-status-error');

      fixture.componentInstance.status.set('warning');
      fixture.detectChanges();
      expect(treeSelect.nativeElement.className).toContain('ant-select-status-warning');

      fixture.componentInstance.status.set('');
      fixture.detectChanges();
      expect(treeSelect.nativeElement.className).not.toContain('ant-select-status-warning');
    });
  });

  describe('in form', () => {
    let fixture: ComponentFixture<TriTestTreeSelectInFormComponent>;
    let treeSelect!: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectInFormComponent);
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(treeSelect.classList).toContain('ant-select-status-error');

      fixture.componentInstance.status.set('warning');
      fixture.detectChanges();
      expect(treeSelect.classList).toContain('ant-select-status-warning');

      fixture.componentInstance.status.set('success');
      fixture.detectChanges();
      expect(treeSelect.classList).toContain('ant-select-status-success');

      fixture.componentInstance.feedback.set(false);
      fixture.detectChanges();
      expect(treeSelect.querySelector('nz-form-item-feedback-icon')).toBeNull();
    });
  });

  describe('virtual scroll', () => {
    let fixture: ComponentFixture<TriTestTreeSelectVirtualScrollComponent>;
    let treeSelect: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestTreeSelectVirtualScrollComponent);
      treeSelect = fixture.debugElement.query(By.directive(TriTreeSelectComponent));
    });

    it('should set nzVirtualHeight work', async () => {
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      await fixture.whenStable();
      const virtualScrollViewport = overlayContainerElement.querySelector('.cdk-virtual-scroll-viewport')!;
      expect(window.getComputedStyle(virtualScrollViewport).height).toBe('300px');
    });

    it('should support x-scroll when the length of node label is greater than the length of select dropdown', async () => {
      fixture.detectChanges();
      treeSelect.nativeElement.click();
      await fixture.whenStable();
      overlayContainerElement
        .querySelector('.cdk-virtual-scroll-content-wrapper')!
        .setAttribute('style', 'width: 250px');
      const virtualScrollViewport = overlayContainerElement.querySelector('.cdk-virtual-scroll-content-wrapper')!;
      expect(virtualScrollViewport.clientWidth).toBe(250);
      expect(virtualScrollViewport.scrollWidth).toBeGreaterThan(250);
    });
  });
});

describe('tree-select finalSize', () => {
  let fixture: ComponentFixture<TestTreeSelectFinalSizeComponent>;
  let treeSelectElement: HTMLElement;
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
    fixture = TestBed.createComponent(TestTreeSelectFinalSizeComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.detectChanges();
    formSizeSignal.set('large');
    fixture.detectChanges();
    expect(treeSelectElement.classList).toContain('ant-select-lg');
  });

  it('should set correctly the size from the compactSize signal', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_SPACE_COMPACT_SIZE, useValue: compactSizeSignal }]
    });
    fixture = TestBed.createComponent(TestTreeSelectFinalSizeComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.detectChanges();
    expect(treeSelectElement.classList).toContain('ant-select-lg');
  });

  it('should set correctly the size from the component input', () => {
    fixture = TestBed.createComponent(TestTreeSelectFinalSizeComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.componentInstance.size.set('large');
    fixture.detectChanges();
    expect(treeSelectElement.classList).toContain('ant-select-lg');
  });
});

describe('finalVariant', () => {
  let fixture: ComponentFixture<TestTreeSelectFinalVariantComponent>;
  let treeSelectElement: HTMLElement;
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
    fixture = TestBed.createComponent(TestTreeSelectFinalVariantComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(treeSelectElement.classList).toContain('ant-select-filled');
  });

  it('should use nzVariant over formVariant when nzVariant is explicitly set', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestTreeSelectFinalVariantComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('borderless');
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(treeSelectElement.classList).toContain('ant-select-borderless');
    expect(treeSelectElement.classList).not.toContain('ant-select-filled');
  });

  it('should use nzVariant outlined over formVariant when explicitly set', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TRI_FORM_VARIANT, useValue: formVariantSignal }]
    });
    fixture = TestBed.createComponent(TestTreeSelectFinalVariantComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('outlined');
    fixture.detectChanges();
    formVariantSignal.set('filled');
    fixture.detectChanges();
    expect(treeSelectElement.classList).not.toContain('ant-select-filled');
  });

  it('should use nzVariant when no formVariant is provided', () => {
    fixture = TestBed.createComponent(TestTreeSelectFinalVariantComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.componentInstance.variant.set('filled');
    fixture.detectChanges();
    expect(treeSelectElement.classList).toContain('ant-select-filled');
  });

  it('should default to outlined when neither nzVariant nor formVariant is set', () => {
    fixture = TestBed.createComponent(TestTreeSelectFinalVariantComponent);
    treeSelectElement = fixture.debugElement.query(By.directive(TriTreeSelectComponent)).nativeElement;
    fixture.detectChanges();
    expect(treeSelectElement.classList).not.toContain('ant-select-filled');
    expect(treeSelectElement.classList).not.toContain('ant-select-borderless');
    expect(treeSelectElement.classList).not.toContain('ant-select-underlined');
  });
});

@Component({
  imports: [TriTreeSelectModule, FormsModule],
  template: `
    <tri-tree-select
      style="width:250px;position: relative;display: block;"
      placeHolder="Please select"
      [expandedKeys]="expandKeys()"
      [nodes]="nodes()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [size]="size()"
      [variant]="variant()"
      [allowClear]="allowClear()"
      [dropdownMatchSelectWidth]="dropdownMatchSelectWidth()"
      [disabled]="disabled()"
      [showSearch]="showSearch()"
      [multiple]="multiple()"
      [maxTagCount]="maxTagCount()"
      [dropdownStyle]="{ height: '120px' }"
      [backdrop]="hasBackdrop()"
      [prefix]="prefix()"
      [suffixIcon]="suffixIcon()"
      [placement]="placement()"
      dropdownClassName="class1 class2"
    />
    <ng-template #affixTemplate>icon</ng-template>
  `
})
export class TriTestTreeSelectBasicComponent {
  @ViewChild(TriTreeSelectComponent, { static: false }) selectTreeComponent!: TriTreeSelectComponent;
  @ViewChild('affixTemplate', { static: false }) affixTemplate!: TemplateRef<void>;
  readonly expandKeys = signal(['1001', '10001']);
  readonly value = signal<string | string[] | null>('10001');
  readonly size = signal<TriSizeLDSType>('default');
  readonly variant = signal<TriVariant>('outlined');
  readonly allowClear = signal(false);
  readonly disabled = signal(false);
  readonly showSearch = signal(false);
  readonly dropdownMatchSelectWidth = signal(true);
  readonly multiple = signal(false);
  readonly maxTagCount = signal(Infinity);
  readonly prefix = signal<string | TemplateRef<void> | null>(null);
  readonly suffixIcon = signal<string | TemplateRef<void> | null>(null);
  readonly nodes = signal<TriTreeNodeOptions[]>([
    {
      title: 'root1',
      key: '1001',
      children: [
        {
          title: 'child1',
          key: '10001',
          children: [
            {
              title: 'child1.1',
              key: '100011',
              children: []
            },
            {
              title: 'child1.2',
              key: '100012',
              children: [
                {
                  title: 'grandchild1.2.1',
                  key: '1000121',
                  isLeaf: true,
                  disabled: true
                },
                {
                  title: 'grandchild1.2.2',
                  key: '1000122',
                  isLeaf: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'root2',
      key: '1002',
      children: [
        {
          title: 'child2.1',
          key: '10021',
          children: [],
          disableCheckbox: true
        },
        {
          title: 'child2.2',
          key: '10022',
          children: [
            {
              title: 'grandchild2.2.1',
              key: '100221',
              isLeaf: true
            }
          ]
        }
      ]
    }
  ]);
  readonly hasBackdrop = signal(false);
  readonly placement = signal<TriPlacementType>('bottomLeft');

  setNull(): void {
    this.value.set(null);
  }
}

@Component({
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      placeHolder="Please select"
      [expandedKeys]="expandKeys()"
      [nodes]="nodes()"
      [showSearch]="showSearch()"
      [checkable]="true"
      [checkStrictly]="checkStrictly()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
    />
  `
})
export class TriTestTreeSelectCheckableComponent {
  @ViewChild(TriTreeSelectComponent, { static: false }) selectTreeComponent!: TriTreeSelectComponent;
  readonly expandKeys = signal(['1001', '10001']);
  readonly value = signal<string[] | null>(['1000122']);
  readonly showSearch = signal(false);
  readonly checkStrictly = signal(false);
  readonly nodes = signal([
    {
      title: 'root1',
      key: '1001',
      children: [
        {
          title: 'child1',
          key: '10001',
          children: [
            {
              title: 'child1.1',
              key: '100011',
              children: []
            },
            {
              title: 'child1.2',
              key: '100012',
              children: [
                {
                  title: 'grandchild1.2.1',
                  key: '1000121',
                  isLeaf: true,
                  disabled: true
                },
                {
                  title: 'grandchild1.2.2',
                  key: '1000122',
                  isLeaf: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'root2',
      key: '1002',
      children: [
        {
          title: 'child2.1',
          key: '10021',
          children: [],
          disableCheckbox: true
        },
        {
          title: 'child2.2',
          key: '10022',
          children: [
            {
              title: 'grandchild2.2.1',
              key: '100221',
              isLeaf: true
            }
          ]
        }
      ]
    }
  ]);

  setNull(): void {
    this.value.set(null);
  }
}

@Component({
  imports: [ReactiveFormsModule, TriTreeSelectModule],
  template: `
    <form>
      <tri-tree-select [formControl]="formControl" [nodes]="nodes" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestTreeSelectFormComponent {
  formControl = new FormControl('10021');
  nodes = [
    {
      title: 'root2',
      key: '1002',
      children: [
        {
          title: 'child2.1',
          key: '10021'
        },
        {
          title: 'child2.2',
          key: '10022'
        }
      ]
    }
  ].map(item => new TriTreeNode(item));

  disable(): void {
    this.formControl.disable();
  }

  setNull(): void {
    this.formControl.reset(null);
  }
}

@Component({
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select [nodes]="nodes" [(ngModel)]="value">
      <ng-template #nzTreeTemplate let-node>
        <span>
          <span class="anticon anticon-frown-o"></span>
          {{ node.title }}
        </span>
      </ng-template>
    </tri-tree-select>
  `
})
export class TriTestTreeSelectCustomizedIconComponent {
  value?: string;
  nodes = [
    new TriTreeNode({
      title: 'root3',
      key: '1003',
      children: [
        {
          title: 'child3.1',
          key: '10031'
        },
        {
          title: 'child3.2',
          key: '10032'
        }
      ]
    })
  ];
}

@Component({
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      [nodes]="nodes"
      showSearch
      [status]="status()"
      placeHolder="Please select"
      [(ngModel)]="value"
    />
  `
})
export class TriTestTreeSelectStatusComponent {
  readonly status = signal<TriStatus>('error');
  value?: string = '1001';
  nodes = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          children: [
            { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
            { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf 1-1-0', key: '10020', isLeaf: true }]
        }
      ]
    }
  ];
}

@Component({
  imports: [ReactiveFormsModule, TriFormModule, TriTreeSelectModule],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-control [hasFeedback]="feedback()" [validateStatus]="status()">
          <tri-tree-select [nodes]="[]" />
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestTreeSelectInFormComponent {
  readonly status = signal<TriFormControlStatusType>('error');
  readonly feedback = signal(true);
}

function dig(path = '0', level = 3): TriTreeNodeOptions[] {
  const list: TriTreeNodeOptions[] = [];
  for (let i = 0; i < 10; i += 1) {
    // long key for overflow
    const key = `${path}-${i}-${Array(50).join('x')}`;
    const treeNode: TriTreeNodeOptions = {
      title: key,
      key,
      expanded: true,
      children: [],
      isLeaf: false
    };

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    } else {
      treeNode.isLeaf = true;
    }

    list.push(treeNode);
  }
  return list;
}

@Component({
  imports: [TriTreeSelectModule],
  template: `
    <tri-tree-select
      [nodes]="nodes"
      showSearch
      placeHolder="Please select"
      virtualHeight="300px"
      hideUnMatched="true"
      [dropdownMatchSelectWidth]="true"
    />
  `
})
export class TriTestTreeSelectVirtualScrollComponent {
  nodes: TriTreeNodeOptions[] = dig();
}

@Component({
  imports: [TriTreeSelectModule],
  template: `<tri-tree-select [nodes]="[]" [size]="size()" />`
})
export class TestTreeSelectFinalSizeComponent {
  readonly size = signal<TriSizeLDSType>('default');
}

@Component({
  imports: [TriTreeSelectComponent],
  template: `<tri-tree-select [variant]="variant()" />`
})
export class TestTreeSelectFinalVariantComponent {
  readonly variant = signal<TriVariant | undefined>(undefined);
}
