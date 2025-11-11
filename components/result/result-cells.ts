/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: 'div[nz-result-title]',
  exportAs: 'triResultTitle',
  host: {
    class: 'tri-result-title'
  }
})
export class TriResultTitleDirective {}

@Directive({
  selector: 'div[nz-result-subtitle]',
  exportAs: 'triResultSubtitle',
  host: {
    class: 'tri-result-subtitle'
  }
})
export class TriResultSubtitleDirective {}

@Directive({
  selector: '[tri-result-icon]',
  exportAs: 'triResultIcon'
})
export class TriResultIconDirective {}

@Directive({
  selector: 'div[nz-result-content]',
  exportAs: 'triResultContent',
  host: {
    class: 'tri-result-content'
  }
})
export class TriResultContentDirective {}

@Directive({
  selector: 'div[nz-result-extra]',
  exportAs: 'triResultExtra',
  host: {
    class: 'tri-result-extra'
  }
})
export class TriResultExtraDirective {}
