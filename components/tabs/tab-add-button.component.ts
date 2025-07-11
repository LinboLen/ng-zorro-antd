/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ElementRef, inject, Input, TemplateRef } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-tab-add-button,button[nz-tab-add-button]',
  template: `
    <ng-container *stringTemplateOutlet="addIcon; let icon">
      <tri-icon [type]="icon" theme="outline" />
    </ng-container>
  `,
  host: {
    class: 'tri-tabs-nav-add',
    'aria-label': 'Add tab',
    type: 'button'
  },
  imports: [TriOutletModule, TriIconModule]
})
export class TriTabAddButtonComponent {
  @Input() addIcon: string | TemplateRef<TriSafeAny> = 'plus';

  private readonly element: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  getElementWidth(): number {
    return this.element?.offsetWidth || 0;
  }

  getElementHeight(): number {
    return this.element?.offsetHeight || 0;
  }
}
