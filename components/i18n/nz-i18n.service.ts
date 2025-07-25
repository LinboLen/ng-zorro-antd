/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { warn } from 'ng-zorro-antd/core/logger';
import { IndexableObject, TriSafeAny } from 'ng-zorro-antd/core/types';

import en_US from './languages/en_US';
import zh_CN from './languages/zh_CN';
import { DateLocale, TriI18nInterface } from './nz-i18n.interface';
import { TRI_DATE_LOCALE, TRI_I18N } from './nz-i18n.token';

@Injectable({
  providedIn: 'root'
})
export class TriI18nService {
  private _locale!: TriI18nInterface;
  private _change = new BehaviorSubject<TriI18nInterface>(this._locale);
  private dateLocale!: DateLocale;

  get localeChange(): Observable<TriI18nInterface> {
    return this._change.asObservable();
  }

  constructor() {
    this.setLocale(inject(TRI_I18N, { optional: true }) || zh_CN);
    this.setDateLocale(inject(TRI_DATE_LOCALE, { optional: true }) as DateLocale); // TODO: fix the type
  }

  // [NOTE] Performance issue: this method may called by every change detections
  // TODO: cache more deeply paths for performance
  translate(path: string, data?: TriSafeAny): string {
    // this._logger.debug(`[NzI18nService] Translating(${this._locale.locale}): ${path}`);
    let content = this._getObjectPath(this._locale, path) as string;
    if (typeof content === 'string') {
      if (data) {
        Object.keys(data).forEach(key => (content = content.replace(new RegExp(`%${key}%`, 'g'), data[key])));
      }
      return content;
    }
    return path;
  }

  /**
   * Set/Change current locale globally throughout the WHOLE application
   * NOTE: If called at runtime, rendered interface may not change along with the locale change,
   * because this do not trigger another render schedule.
   *
   * @param locale The translating letters
   */
  setLocale(locale: TriI18nInterface): void {
    if (this._locale && this._locale.locale === locale.locale) {
      return;
    }
    this._locale = locale;
    this._change.next(locale);
  }

  getLocale(): TriI18nInterface {
    return this._locale;
  }

  getLocaleId(): string {
    return this._locale ? this._locale.locale : '';
  }

  setDateLocale(dateLocale: DateLocale): void {
    this.dateLocale = dateLocale;
  }

  getDateLocale(): DateLocale {
    return this.dateLocale;
  }

  /**
   * Get locale data
   *
   * @param path dot paths for finding exist value from locale data, eg. "a.b.c"
   * @param defaultValue default value if the result is not "truthy"
   */
  getLocaleData(path: string, defaultValue?: TriSafeAny): TriSafeAny {
    const result = path ? this._getObjectPath(this._locale, path) : this._locale;

    if (!result && !defaultValue) {
      warn(`Missing translations for "${path}" in language "${this._locale.locale}".
You can use "NzI18nService.setLocale" as a temporary fix.
Welcome to submit a pull request to help us optimize the translations!
https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/CONTRIBUTING.md`);
    }

    return result || defaultValue || this._getObjectPath(en_US, path) || {};
  }

  private _getObjectPath(obj: IndexableObject, path: string): string | object | TriSafeAny {
    let res = obj;
    const paths = path.split('.');
    const depth = paths.length;
    let index = 0;
    while (res && index < depth) {
      res = res[paths[index++]];
    }
    return index === depth ? res : null;
  }
}
