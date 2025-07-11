/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, TemplateRef, inject } from '@angular/core';

import { TriModalRef } from './modal-ref';

@Directive({
  selector: '[triModalFooter]',
  exportAs: 'triModalFooter'
})
export class TriModalFooterDirective {
  public readonly templateRef: TemplateRef<{}> = inject(TemplateRef);
  private modalRef = inject(TriModalRef, { optional: true });

  constructor() {
    this.modalRef?.updateConfig({
      footer: this.templateRef
    });
  }
}
