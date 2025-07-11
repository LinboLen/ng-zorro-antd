/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input, booleanAttribute, inject } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

@Directive({
  selector: '[triNoAnimation]',
  exportAs: 'triNoAnimation',
  host: {
    '[class.nz-animate-disabled]': `nzNoAnimation || animationType === 'NoopAnimations'`
  }
})
export class TriNoAnimationDirective {
  animationType = inject(ANIMATION_MODULE_TYPE, { optional: true });
  @Input({ transform: booleanAttribute }) noAnimation: boolean = false;
}
