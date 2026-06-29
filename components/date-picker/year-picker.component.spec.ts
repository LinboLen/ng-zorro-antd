/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, DebugElement, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { dispatchFakeEvent, dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { TriDatePickerSizeType } from 'ng-zorro-antd/date-picker/date-picker.component';
import { getPickerAbstract, getPickerInput } from 'ng-zorro-antd/date-picker/testing/util';
import { PREFIX_CLASS } from 'ng-zorro-antd/date-picker/util';
import { TriDatePickerI18nInterface, TriDatePickerLangI18nInterface } from 'ng-zorro-antd/i18n';
import { TriInputModule } from 'ng-zorro-antd/input';

import { TriDatePickerModule } from './date-picker.module';

registerLocaleData(zh);

describe('year-picker', () => {
  let fixture: ComponentFixture<TriTestYearPickerComponent>;
  let fixtureInstance: TriTestYearPickerComponent;
  let debugElement: DebugElement;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
    fixture = TestBed.createComponent(TriTestYearPickerComponent);
    fixtureInstance = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  beforeEach(() => vi.useFakeTimers());

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(() => vi.useRealTimers());

  describe('general api testing', () => {
    beforeEach(() => fixtureInstance.useSuite.set(1));

    it('should open by click and close by click at outside', async () => {
      fixture.detectChanges();
      await openPickerByClickTrigger();
      expect(getPickerContainer()).not.toBeNull();

      dispatchFakeEvent(getPickerInput(fixture.debugElement), 'focusout');
      await stabilize(500);
      expect(getPickerContainer()).toBeNull();
    });

    it('should support nzAllowClear and work properly', async () => {
      const clearBtnSelector = By.css(`.${PREFIX_CLASS}-clear`);
      const initial = new Date();
      fixtureInstance.value.set(initial);
      fixtureInstance.allowClear.set(false);
      await stabilize(500);
      expect(debugElement.query(clearBtnSelector)).toBeFalsy();

      fixtureInstance.allowClear.set(true);
      await stabilize(500);
      expect(fixtureInstance.value()).toBe(initial);
      expect(debugElement.query(clearBtnSelector)).toBeDefined();

      const nzOnChange = vi.spyOn(fixtureInstance, 'nzOnChange');
      debugElement.query(clearBtnSelector).nativeElement.click();
      await stabilize(500);
      expect(fixtureInstance.value()).toBe(initial);
      expect(nzOnChange).toHaveBeenCalledWith(null);
      expect(debugElement.query(clearBtnSelector)).toBeFalsy();
    });

    it('should support nzAutoFocus', () => {
      fixtureInstance.autoFocus.set(true);
      fixture.detectChanges();
      expect(getPickerInput(fixture.debugElement) === document.activeElement).toBeTruthy();
    });

    it('should support nzDisabled', async () => {
      // Make sure picker clear button shown up
      fixtureInstance.allowClear.set(true);
      fixtureInstance.value.set(new Date());

      fixtureInstance.disabled.set(true);
      await stabilize();
      expect(debugElement.query(By.css('.ant-picker-disabled'))).not.toBeNull();
      expect(debugElement.query(By.css('.ant-picker-clear'))).toBeNull();

      fixtureInstance.disabled.set(false);
      await stabilize();
      expect(debugElement.query(By.css('.ant-picker-disabled'))).toBeNull();
      expect(debugElement.query(By.css('.ant-picker-clear'))).not.toBeNull();
    });

    it('should support nzOpen if assigned', async () => {
      fixtureInstance.useSuite.set(2);

      fixture.detectChanges();
      await stabilize(500);
      expect(getPickerContainer()).toBeNull();

      fixtureInstance.open.set(true);
      await stabilize(500);
      expect(getPickerContainer()).not.toBeNull();

      fixtureInstance.open.set(false);
      await stabilize(500);
      expect(getPickerContainer()).toBeNull();
    });

    it('should nz-year-picker work', async () => {
      fixtureInstance.useSuite.set(4);
      await stabilize(500);
      expect(getPickerContainer()).not.toBeNull();
      const pickerInput = getPickerInput(fixture.debugElement);
      expect(pickerInput).not.toBeNull();
    });

    it('should support nzDisabledDate', async () => {
      fixture.detectChanges();
      fixtureInstance.value.set(new Date('2018-11-11 12:12:12'));
      fixtureInstance.disabledDate.set((current: Date) => current.getFullYear() === 2013);
      await stabilize();

      await openPickerByClickTrigger();
      const disabledCell = overlayContainerElement.querySelector(
        '.ant-picker-year-panel tr td.ant-picker-cell-disabled'
      )!;
      expect(disabledCell.textContent).toContain('2013');
    });

    it('should support nzLocale', () => {
      const featureKey = 'TEST_PLACEHOLDER';
      fixtureInstance.locale.set({
        lang: { yearPlaceholder: featureKey } as unknown as TriDatePickerLangI18nInterface,
        timePickerLocale: {}
      });
      fixture.detectChanges();
      expect(getPickerInput(fixture.debugElement).getAttribute('placeholder')).toBe(featureKey);
    });

    it('should support nzPlaceHolder', () => {
      const featureKey = 'TEST_PLACEHOLDER';
      fixtureInstance.placeHolder.set(featureKey);
      fixture.detectChanges();
      expect(getPickerInput(fixture.debugElement).getAttribute('placeholder')).toBe(featureKey);
    });

    it('should support nzPopupStyle', async () => {
      fixtureInstance.popupStyle.set({ color: 'red' });
      fixture.detectChanges();
      await openPickerByClickTrigger();
      expect(queryFromOverlay(`.${PREFIX_CLASS}-dropdown`).style.color).toBe('red');
    });

    it('should support nzDropdownClassName', async () => {
      const keyCls = 'my-test-class';
      fixtureInstance.dropdownClassName.set(keyCls);
      fixture.detectChanges();
      await openPickerByClickTrigger();
      expect(queryFromOverlay(`.${PREFIX_CLASS}-dropdown`).classList.contains(keyCls)).toBeTruthy();
    });

    it('should support nzSize', () => {
      fixtureInstance.size.set('large');
      fixture.detectChanges();
      expect(getPickerAbstract(fixture.debugElement).classList.contains('ant-picker-large')).toBeTruthy();

      fixtureInstance.size.set('small');
      fixture.detectChanges();
      expect(getPickerAbstract(fixture.debugElement).classList.contains('ant-picker-small')).toBeTruthy();
    });

    it('should support nzOnOpenChange', async () => {
      const nzOnOpenChange = vi.spyOn(fixtureInstance, 'nzOnOpenChange');
      fixture.detectChanges();
      await openPickerByClickTrigger();
      expect(nzOnOpenChange).toHaveBeenCalledWith(true);

      dispatchFakeEvent(getPickerInput(fixture.debugElement), 'focusout');
      await stabilize();
      expect(nzOnOpenChange).toHaveBeenCalledWith(false);
      expect(nzOnOpenChange).toHaveBeenCalledTimes(2);
    });
    it('should support nzValue', async () => {
      fixtureInstance.value.set(new Date('2018-11-22'));
      await stabilize();
      await openPickerByClickTrigger();
      expect(getSelectedYearCell().textContent).toContain('2018');
    });

    it('should support nzOnChange', async () => {
      fixtureInstance.value.set(new Date('2018-11'));
      const nzOnChange = vi.spyOn(fixtureInstance, 'nzOnChange');
      fixture.detectChanges();
      await openPickerByClickTrigger();

      const cell = getSecondYearCell(); // Use the second cell
      const cellText = cell.textContent!.trim();
      dispatchMouseEvent(cell, 'click');
      await stabilize(500);
      expect(nzOnChange).toHaveBeenCalled();
      const result = (nzOnChange.mock.calls[0] as Date[])[0];
      expect(result.getFullYear()).toBe(parseInt(cellText, 10));
    });
  }); // /general api testing

  describe('panel switch and move forward/afterward', () => {
    beforeEach(() => fixtureInstance.useSuite.set(1));

    it('should support decade panel changes', async () => {
      fixtureInstance.value.set(new Date('2018-11'));
      fixture.detectChanges();
      await openPickerByClickTrigger();
      // Click to show decade panel
      dispatchMouseEvent(queryFromOverlay('.ant-picker-header-year-btn'), 'click');
      await stabilize(500);
      expect(queryFromOverlay('.ant-picker-decade-panel')).toBeDefined();
      // Goto previous decade
      dispatchMouseEvent(getSuperPreBtn(), 'click');
      await stabilize(500);
      expect(queryFromOverlay('.ant-picker-header-decade-btn').textContent).toContain('1900');
      expect(queryFromOverlay('.ant-picker-header-decade-btn').textContent).toContain('1999');
      // Goto next decade * 2
      dispatchMouseEvent(getSuperNextBtn(), 'click');
      await stabilize(500);
      dispatchMouseEvent(getSuperNextBtn(), 'click');
      await stabilize(500);
      expect(queryFromOverlay('.ant-picker-header-decade-btn').textContent).toContain('2100');
      expect(queryFromOverlay('.ant-picker-header-decade-btn').textContent).toContain('2199');
    });
  }); // /panel switch and move forward/afterward

  describe('specified date picker testing', () => {
    beforeEach(() => fixtureInstance.useSuite.set(1));

    it('should support nzRenderExtraFooter', async () => {
      fixtureInstance.renderExtraFooter.set(() => fixtureInstance.tplExtraFooter);
      fixture.detectChanges();

      await openPickerByClickTrigger();
      expect(overlayContainerElement.textContent!.indexOf('TEST_EXTRA_FOOTER') > -1).toBeTruthy();

      fixtureInstance.renderExtraFooter.set('TEST_EXTRA_FOOTER_STRING');
      fixture.detectChanges();
      expect(overlayContainerElement.textContent!.indexOf('TEST_EXTRA_FOOTER_STRING') > -1).toBeTruthy();
    });
  }); // /specified date picker testing

  describe('ngModel value accessors', () => {
    beforeEach(() => fixtureInstance.useSuite.set(3));

    it('should specified date provide by "modelValue" be chosen', async () => {
      fixtureInstance.modelValue.set(new Date('2018-11'));
      await stabilize();
      expect(getSelectedYearCell().textContent).toContain('2018');
      // Click the first cell to change ngModel
      const cell = getSecondYearCell();
      const cellText = cell.textContent!.trim();
      dispatchMouseEvent(cell, 'click');
      await stabilize(500);
      expect(fixtureInstance.modelValue()!.getFullYear()).toBe(parseInt(cellText, 10));
    });
  });

  ////////////

  function getSuperPreBtn(): HTMLElement {
    return queryFromOverlay(`.${PREFIX_CLASS}-header-super-prev-btn`);
  }

  function getSuperNextBtn(): HTMLElement {
    return queryFromOverlay(`.${PREFIX_CLASS}-header-super-next-btn`);
  }

  function getPickerContainer(): HTMLElement {
    return queryFromOverlay('.ant-picker-panel-container') as HTMLElement;
  }

  function getSelectedYearCell(): HTMLElement {
    return queryFromOverlay('.ant-picker-year-panel td.ant-picker-cell-selected') as HTMLElement;
  }

  function getSecondYearCell(): HTMLElement {
    return queryFromOverlay(
      '.ant-picker-year-panel td.ant-picker-cell:nth-child(2) .ant-picker-cell-inner'
    ) as HTMLElement;
  }

  function queryFromOverlay(selector: string): HTMLElement {
    return overlayContainerElement.querySelector(selector) as HTMLElement;
  }

  async function openPickerByClickTrigger(): Promise<void> {
    dispatchMouseEvent(getPickerInput(fixture.debugElement), 'click');
    await stabilize(500);
  }

  async function stabilize(ms = 500): Promise<void> {
    fixture.detectChanges();
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
    fixture.detectChanges();
  }
});

@Component({
  imports: [FormsModule, TriDatePickerModule, TriInputModule],
  template: `
    <ng-template #tplExtraFooter>TEST_EXTRA_FOOTER</ng-template>
    @switch (useSuite()) {
      @case (1) {
        <tri-date-picker
          mode="year"
          [allowClear]="allowClear()"
          [autoFocus]="autoFocus()"
          [disabled]="disabled()"
          [disabledDate]="disabledDate()"
          [locale]="locale()!"
          [placeHolder]="placeHolder()!"
          [popupStyle]="popupStyle() ?? {}"
          [dropdownClassName]="dropdownClassName()"
          [size]="size()!"
          (onOpenChange)="onOpenChange($event)"
          [ngModel]="value()"
          (ngModelChange)="onChange($event)"
          [renderExtraFooter]="renderExtraFooter()"
        />
      }
      @case (2) {
        <tri-date-picker mode="year" [open]="open()" />
      }
      @case (3) {
        <tri-date-picker mode="year" open [(ngModel)]="modelValue" />
      }
      @case (4) {
        <tri-year-picker open [(ngModel)]="modelValue" />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
class TriTestYearPickerComponent {
  readonly useSuite = signal<1 | 2 | 3 | 4 | undefined>(undefined);
  @ViewChild('tplExtraFooter', { static: true }) tplExtraFooter!: TemplateRef<void>;

  // --- Suite 1
  readonly allowClear = signal(false);
  readonly autoFocus = signal(false);
  readonly disabled = signal(false);
  readonly disabledDate = signal<((d: Date) => boolean) | undefined>(undefined);
  readonly locale = signal<TriDatePickerI18nInterface | undefined>(undefined);
  readonly placeHolder = signal<string | undefined>(undefined);
  readonly popupStyle = signal<NgStyleInterface | undefined>(undefined);
  readonly dropdownClassName = signal<string | undefined>(undefined);
  readonly size = signal<TriDatePickerSizeType | undefined>(undefined);
  readonly value = signal<Date | null>(null);
  readonly renderExtraFooter = signal<string | (() => TemplateRef<void> | string) | undefined>(undefined);

  onOpenChange(_: boolean): void {}

  onChange(_: Date | null): void {}

  // --- Suite 2
  readonly open = signal(false);

  // --- Suite 3
  readonly modelValue = signal<Date | undefined>(undefined);
}
