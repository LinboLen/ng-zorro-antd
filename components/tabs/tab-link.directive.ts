/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, ElementRef, TemplateRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TabTemplateContext } from './interfaces';

/**
 * Fix https://github.com/angular/angular/issues/8563
 */
@Directive({
  selector: 'ng-template[nzTabLink]',
  exportAs: 'triTabLinkTemplate'
})
export class TriTabLinkTemplateDirective {
  templateRef: TemplateRef<TabTemplateContext> = inject(TemplateRef, { host: true });
}

/**
 * This component is for catching `routerLink` directive.
 */
@Directive({
  selector: 'a[nz-tab-link]',
  exportAs: 'triTabLink'
})
export class TriTabLinkDirective {
  elementRef = inject(ElementRef<HTMLAnchorElement>);
  routerLink = inject(RouterLink, { self: true, optional: true });
}
