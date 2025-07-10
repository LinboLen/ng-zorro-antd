/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriFloatButtonContentComponent } from './float-button-content.component';
import { TriFloatButtonGroupComponent } from './float-button-group.component';
import { TriFloatButtonTopComponent } from './float-button-top.component';
import { TriFloatButtonComponent } from './float-button.component';

@NgModule({
  exports: [
    TriFloatButtonComponent,
    TriFloatButtonGroupComponent,
    TriFloatButtonTopComponent,
    TriFloatButtonContentComponent
  ],
  imports: [
    TriFloatButtonComponent,
    TriFloatButtonGroupComponent,
    TriFloatButtonTopComponent,
    TriFloatButtonContentComponent
  ]
})
export class TriFloatButtonModule {}
