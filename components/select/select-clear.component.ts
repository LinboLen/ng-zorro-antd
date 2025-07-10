/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (clearIcon) {
      <ng-template [ngTemplateOutlet]="clearIcon"></ng-template>
    } @else {
      <tri-icon type="close-circle" theme="fill" class="tri-select-close-icon" />
    }
  `,
  host: {
    class: 'tri-select-clear',
    '(click)': 'onClick($event)'
  },
  imports: [NgTemplateOutlet, TriIconModule]
})
export class TriSelectClearComponent {
  @Input() clearIcon: TemplateRef<TriSafeAny> | null = null;
  @Output() readonly clear = new EventEmitter<MouseEvent>();

  onClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.clear.emit(e);
  }
}
