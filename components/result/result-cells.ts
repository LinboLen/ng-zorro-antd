/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: '',
  exportAs: 'triResultTitle',
  host: {
    class: 'tri-result-title'
  }
})
export class TriResultTitleDirective {}

@Directive({
  selector: '',
  exportAs: 'triResultSubtitle',
  host: {
    class: 'tri-result-subtitle'
  }
})
export class TriResultSubtitleDirective {}

@Directive({
  selector: '',
  exportAs: 'triResultIcon'
})
export class TriResultIconDirective {}

@Directive({
  selector: '',
  exportAs: 'triResultContent',
  host: {
    class: 'tri-result-content'
  }
})
export class TriResultContentDirective {}

@Directive({
  selector: '',
  exportAs: 'triResultExtra',
  host: {
    class: 'tri-result-extra'
  }
})
export class TriResultExtraDirective {}
