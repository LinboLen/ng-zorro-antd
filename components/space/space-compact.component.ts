/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, input, signal } from '@angular/core';

import { TriSizeLDSType } from 'ng-zorro-antd/core/types';

import { TRI_SPACE_COMPACT_ITEMS, TRI_SPACE_COMPACT_SIZE } from './space-compact.token';

@Component({
  selector: '',
  exportAs: 'triSpaceCompact',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-space-compact',
    '[class.tri-space-compact-block]': `block()`,
    '[class.tri-space-compact-vertical]': `direction() === 'vertical'`
  },
  providers: [
    { provide: TRI_SPACE_COMPACT_SIZE, useFactory: () => inject(TriSpaceCompactComponent).size },
    { provide: TRI_SPACE_COMPACT_ITEMS, useFactory: () => signal([]) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriSpaceCompactComponent {
  readonly block = input(false, { transform: booleanAttribute });
  readonly direction = input<'vertical' | 'horizontal'>('horizontal');
  readonly size = input<TriSizeLDSType>('default');
  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
}
