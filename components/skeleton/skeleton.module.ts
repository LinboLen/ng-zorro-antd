/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import {
  TriSkeletonElementAvatarComponent,
  TriSkeletonElementButtonComponent,
  TriSkeletonElementDirective,
  TriSkeletonElementImageComponent,
  TriSkeletonElementInputComponent
} from './skeleton-element.component';
import { TriSkeletonComponent } from './skeleton.component';

@NgModule({
  imports: [
    TriSkeletonElementDirective,
    TriSkeletonComponent,
    TriSkeletonElementButtonComponent,
    TriSkeletonElementAvatarComponent,
    TriSkeletonElementImageComponent,
    TriSkeletonElementInputComponent
  ],
  exports: [
    TriSkeletonElementDirective,
    TriSkeletonComponent,
    TriSkeletonElementButtonComponent,
    TriSkeletonElementAvatarComponent,
    TriSkeletonElementImageComponent,
    TriSkeletonElementInputComponent
  ]
})
export class TriSkeletonModule {}
