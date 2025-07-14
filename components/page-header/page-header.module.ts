/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import {
  TriPageHeaderAvatarDirective,
  TriPageHeaderBreadcrumbDirective,
  TriPageHeaderContentDirective,
  TriPageHeaderExtraDirective,
  TriPageHeaderFooterDirective,
  TriPageHeaderSubtitleDirective,
  TriPageHeaderTagDirective,
  TriPageHeaderTitleDirective
} from './page-header-cells';
import { TriPageHeaderComponent } from './page-header.component';

const TriPageHeaderCells = [
  TriPageHeaderTitleDirective,
  TriPageHeaderSubtitleDirective,
  TriPageHeaderContentDirective,
  TriPageHeaderTagDirective,
  TriPageHeaderExtraDirective,
  TriPageHeaderFooterDirective,
  TriPageHeaderBreadcrumbDirective,
  TriPageHeaderAvatarDirective
];

@NgModule({
  imports: [TriPageHeaderComponent, TriPageHeaderCells],
  exports: [TriPageHeaderComponent, TriPageHeaderCells]
})
export class TriPageHeaderModule {}
