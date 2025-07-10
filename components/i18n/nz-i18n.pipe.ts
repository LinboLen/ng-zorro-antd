/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { inject, Pipe, PipeTransform } from '@angular/core';

import { TriI18nService } from './nz-i18n.service';

@Pipe({
  name: 'nzI18n'
})
export class TriI18nPipe implements PipeTransform {
  private _locale = inject(TriI18nService);

  transform(path: string, keyValue?: object): string {
    return this._locale.translate(path, keyValue);
  }
}
