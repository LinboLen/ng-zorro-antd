/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '',
  exportAs: 'triModalContent'
})
export class TriModalContentDirective {
  public readonly templateRef: TemplateRef<{}> = inject(TemplateRef);
}
