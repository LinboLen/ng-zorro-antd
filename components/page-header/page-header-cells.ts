/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: '',
  exportAs: 'triPageHeaderTitle',
  host: {
    class: 'tri-page-header-heading-title'
  }
})
export class TriPageHeaderTitleDirective {}

@Directive({
  selector: '',
  exportAs: 'triPageHeaderSubtitle',
  host: {
    class: 'tri-page-header-heading-sub-title'
  }
})
export class TriPageHeaderSubtitleDirective {}

@Directive({
  selector: '',
  exportAs: 'triPageHeaderContent',
  host: {
    class: 'tri-page-header-content'
  }
})
export class TriPageHeaderContentDirective {}

@Directive({
  selector: '',
  exportAs: 'triPageHeaderTags',
  host: {
    class: 'tri-page-header-heading-tags'
  }
})
export class TriPageHeaderTagDirective {}

@Directive({
  selector: '',
  exportAs: 'triPageHeaderExtra',
  host: {
    class: 'tri-page-header-heading-extra'
  }
})
export class TriPageHeaderExtraDirective {}

@Directive({
  selector: '',
  exportAs: 'triPageHeaderFooter',
  host: {
    class: 'tri-page-header-footer'
  }
})
export class TriPageHeaderFooterDirective {}

@Directive({
  selector: '',
  exportAs: 'triPageHeaderBreadcrumb'
})
export class TriPageHeaderBreadcrumbDirective {}

@Directive({
  selector: '',
  exportAs: 'triPageHeaderAvatar'
})
export class TriPageHeaderAvatarDirective {}
