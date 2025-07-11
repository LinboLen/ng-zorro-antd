/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, TemplateRef, inject } from '@angular/core';

import { TriModalRef } from './modal-ref';

@Directive({
  selector: '[triModalTitle]',
  exportAs: 'triModalTitle'
})
export class TriModalTitleDirective {
  public readonly templateRef: TemplateRef<{}> = inject(TemplateRef);
  private modalRef = inject(TriModalRef, { optional: true });

  constructor() {
    this.modalRef?.updateConfig({
      title: this.templateRef
    });
  }
}
