/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

import { TriFormControlComponent } from './form-control.component';
import { TriFormItemComponent } from './form-item.component';
import { TriFormLabelComponent } from './form-label.component';
import { TriFormSplitComponent } from './form-split.component';
import { TriFormTextComponent } from './form-text.component';
import { TriFormDirective } from './form.directive';

@NgModule({
  imports: [
    TriFormDirective,
    TriFormItemComponent,
    TriFormLabelComponent,
    TriFormControlComponent,
    TriFormTextComponent,
    TriFormSplitComponent
  ],
  exports: [
    TriGridModule,
    TriFormDirective,
    TriFormItemComponent,
    TriFormLabelComponent,
    TriFormControlComponent,
    TriFormTextComponent,
    TriFormSplitComponent
  ]
})
export class TriFormModule {}
