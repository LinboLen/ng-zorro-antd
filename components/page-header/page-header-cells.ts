/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: 'tri-page-header-title,[tri-page-header-title]',
  exportAs: 'triPageHeaderTitle',
  host: {
    class: 'tri-page-header-heading-title'
  }
})
export class TriPageHeaderTitleDirective {}

@Directive({
  selector: 'tri-page-header-subtitle,[tri-page-header-subtitle]',
  exportAs: 'triPageHeaderSubtitle',
  host: {
    class: 'tri-page-header-heading-sub-title'
  }
})
export class TriPageHeaderSubtitleDirective {}

@Directive({
  selector: 'tri-page-header-content,[tri-page-header-content]',
  exportAs: 'triPageHeaderContent',
  host: {
    class: 'tri-page-header-content'
  }
})
export class TriPageHeaderContentDirective {}

@Directive({
  selector: 'tri-page-header-tags,[tri-page-header-tags]',
  exportAs: 'triPageHeaderTags',
  host: {
    class: 'tri-page-header-heading-tags'
  }
})
export class TriPageHeaderTagDirective {}

@Directive({
  selector: 'tri-page-header-extra,[tri-page-header-extra]',
  exportAs: 'triPageHeaderExtra',
  host: {
    class: 'tri-page-header-heading-extra'
  }
})
export class TriPageHeaderExtraDirective {}

@Directive({
  selector: 'tri-page-header-footer,[tri-page-header-footer]',
  exportAs: 'triPageHeaderFooter',
  host: {
    class: 'tri-page-header-footer'
  }
})
export class TriPageHeaderFooterDirective {}

@Directive({
  selector: 'tri-breadcrumb[nz-page-header-breadcrumb]',
  exportAs: 'triPageHeaderBreadcrumb'
})
export class TriPageHeaderBreadcrumbDirective {}

@Directive({
  selector: 'tri-avatar[nz-page-header-avatar]',
  exportAs: 'triPageHeaderAvatar'
})
export class TriPageHeaderAvatarDirective {}
