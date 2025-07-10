/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, inject, OnDestroy } from '@angular/core';
import { ComponentFixture, TestBed, inject as testingInject } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { NZ_I18N, provideNzI18n } from 'ng-zorro-antd/i18n/nz-i18n.token';

import cs_CZ from './languages/cs_CZ';
import de_DE from './languages/de_DE';
import en_US from './languages/en_US';
import ka_GE from './languages/ka_GE';
import zh_CN from './languages/zh_CN';
import { TriI18nInterface } from './nz-i18n.interface';
import { TriI18nService } from './nz-i18n.service';

describe('i18n service', () => {
  let srv: TriI18nService;
  let fixture: ComponentFixture<TriI18nTestComponent>;
  let testComponent: TriI18nTestComponent;
  const DEFAULT_LAN = zh_CN;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzI18n(DEFAULT_LAN)]
    });
  });

  describe('#setLocale', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TriI18nTestComponent);
      testComponent = fixture.debugElement.componentInstance;
    });

    beforeEach(
      testingInject([TriI18nService], (s: TriI18nService) => {
        srv = s;
      })
    );

    it('should interface be right', () => {
      const i18nEN: TriI18nInterface = en_US;
      const i18nDE: TriI18nInterface = de_DE;
      const i18nCS: TriI18nInterface = cs_CZ;
      const i18nKA: TriI18nInterface = ka_GE;
      console.log(i18nEN, i18nDE, i18nCS, i18nKA);
    });

    it('should be provide interface be right', () => {
      fixture = TestBed.createComponent(TriI18nTestComponent);
      expect(fixture.componentInstance.locale === DEFAULT_LAN).toBe(true);
    });

    it('should be auto default zh_CN', () => {
      expect(testComponent.locale.locale).toBe(DEFAULT_LAN.locale);
    });

    it('should trigger changed when set different lang', () => {
      const spy = spyOn(testComponent, 'updateLocale');
      expect(spy).not.toHaveBeenCalled();
      srv.setLocale(en_US);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not trigger change when set same lang', () => {
      const spy = spyOn(testComponent, 'updateLocale');
      expect(spy).not.toHaveBeenCalled();
      srv.setLocale(zh_CN);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should warn when locale for a component is not provided', () => {
      const spy = spyOn(console, 'warn');
      srv.setLocale({ locale: 'not_existing_language' } as any); // eslint-disable-line  @typescript-eslint/no-explicit-any
      expect(srv.getLocaleData('global.placeholder')).toBeTruthy();
      expect(spy).toHaveBeenCalledWith(
        '[NG-ZORRO]:',
        `Missing translations for "global.placeholder" in language "not_existing_language".
You can use "NzI18nService.setLocale" as a temporary fix.
Welcome to submit a pull request to help us optimize the translations!
https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/CONTRIBUTING.md`
      );
    });
  });
});

@Component({
  template: ''
})
export class TriI18nTestComponent implements OnDestroy {
  private localeSubscription: Subscription;
  locale = inject(NZ_I18N);

  constructor(private nzI18nService: TriI18nService) {
    this.localeSubscription = this.nzI18nService.localeChange.subscribe(locale => {
      this.updateLocale(locale);
    });
  }

  ngOnDestroy(): void {
    this.localeSubscription.unsubscribe();
  }

  updateLocale(locale: TriI18nInterface): void {
    this.locale = locale;
  }
}
