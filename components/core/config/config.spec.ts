/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ElementRef, inject, input, Input, inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TriButtonSize } from 'ng-zorro-antd/button';

import { TriConfigKey, provideNzConfig } from './config';
import { TriConfigService, withConfigFactory, WithConfig } from './config.service';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'button';
const withConfig = withConfigFactory(TRI_CONFIG_MODULE_NAME);

@Component({
  selector: 'tri-with-config',
  template: ``
})
class TriWithConfigTestComponent {
  readonly elementRef = inject(ElementRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input() @WithConfig() size: TriButtonSize = 'default';
}

@Component({
  selector: 'tri-with-config-signal',
  template: ``
})
class TriWithConfigSignalTestComponent {
  readonly elementRef = inject(ElementRef);

  readonly size = input<TriButtonSize>();
  readonly innerSize = withConfig('nzSize', this.size, 'default');
}

describe('nz global config', () => {
  const size = signal<TriButtonSize | undefined>(undefined);

  // resign to unassigned value
  afterEach(() => {
    size.set(undefined);
  });

  describe('@WithConfig', () => {
    it('should render with in-component props', async () => {
      const fixture = TestBed.createComponent(TriWithConfigTestComponent, {
        bindings: [inputBinding('nzSize', size)]
      });
      const component = fixture.debugElement.componentInstance as TriWithConfigTestComponent;
      await fixture.whenStable();

      fixture.detectChanges();
      expect(component.size).toBe('default');

      size.set('large');
      fixture.detectChanges();
      expect(component.size).toBe('large');
    });

    describe('with config', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            provideNzConfig({
              button: {
                nzSize: 'large'
              }
            })
          ]
        });
      });

      it('should static config work', async () => {
        const fixture = TestBed.createComponent(TriWithConfigTestComponent, {
          bindings: [inputBinding('nzSize', size)]
        });
        const component = fixture.debugElement.componentInstance as TriWithConfigTestComponent;
        await fixture.whenStable();

        fixture.detectChanges();
        expect(component.size).toBe('large');

        size.set('default');
        fixture.detectChanges();
        expect(component.size).toBe('default');
      });

      it('should dynamic config work', async () => {
        const fixture = TestBed.createComponent(TriWithConfigTestComponent, {
          bindings: [inputBinding('nzSize', size)]
        });
        const component = fixture.debugElement.componentInstance as TriWithConfigTestComponent;
        const nzConfigService = TestBed.inject(TriConfigService);
        await fixture.whenStable();

        fixture.detectChanges();
        expect(component.size).toBe('large');

        nzConfigService.set('button', { nzSize: 'small' });
        fixture.detectChanges();
        expect(component.size).toBe('small');

        size.set('default');
        fixture.detectChanges();
        expect(component.size).toBe('default');
      });
    });
  });

  describe('withConfig signal', () => {
    it('should render with in-component props', async () => {
      const fixture = TestBed.createComponent(TriWithConfigSignalTestComponent, {
        bindings: [inputBinding('nzSize', size)]
      });
      const component = fixture.debugElement.componentInstance as TriWithConfigSignalTestComponent;
      await fixture.whenStable();

      fixture.detectChanges();
      expect(component.size()).toBeUndefined();
      expect(component.innerSize()).toBe('default');

      size.set('large');
      fixture.detectChanges();
      expect(component.size()).toBe('large');
      expect(component.innerSize()).toBe('large');
    });

    describe('with config', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            provideNzConfig({
              button: {
                nzSize: 'large'
              }
            })
          ]
        });
      });

      it('should static config work', async () => {
        const fixture = TestBed.createComponent(TriWithConfigSignalTestComponent, {
          bindings: [inputBinding('nzSize', size)]
        });
        const component = fixture.debugElement.componentInstance as TriWithConfigSignalTestComponent;
        await fixture.whenStable();

        fixture.detectChanges();
        expect(component.size()).toBeUndefined();
        expect(component.innerSize()).toBe('large');

        size.set('default');
        fixture.detectChanges();
        expect(component.size()).toBe('default');
        expect(component.innerSize()).toBe('default');
      });

      it('should dynamic config work', async () => {
        const fixture = TestBed.createComponent(TriWithConfigSignalTestComponent, {
          bindings: [inputBinding('nzSize', size)]
        });
        const component = fixture.debugElement.componentInstance as TriWithConfigSignalTestComponent;
        const nzConfigService = TestBed.inject(TriConfigService);
        await fixture.whenStable();

        fixture.detectChanges();
        expect(component.size()).toBeUndefined();
        expect(component.innerSize()).toBe('large');

        nzConfigService.set('button', { nzSize: 'small' });
        fixture.detectChanges();
        expect(component.size()).toBeUndefined();
        expect(component.innerSize()).toBe('small');

        size.set('default');
        fixture.detectChanges();
        expect(component.size()).toBe('default');
        expect(component.innerSize()).toBe('default');
      });
    });
  });

  describe('theme config', () => {
    let nzConfigService: TriConfigService;

    beforeEach(() => {
      nzConfigService = TestBed.inject(TriConfigService);
    });

    function getComputedStylePropertyValue(property: string): string {
      return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    }

    it('should dynamic theme colors config work', () => {
      nzConfigService.set('theme', { primaryColor: '#0000FF' });
      expect(getComputedStylePropertyValue('--ant-primary-color')).toEqual('rgb(0, 0, 255)');
    });

    it('should dynamic theme colors config with custom prefix work', () => {
      nzConfigService.set('prefixCls', { prefixCls: 'custom-variable' });
      nzConfigService.set('theme', { primaryColor: '#0000FF' });
      expect(getComputedStylePropertyValue('--custom-variable-primary-color')).toEqual('rgb(0, 0, 255)');
    });
  });
});
