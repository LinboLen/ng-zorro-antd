/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, input, model } from '@angular/core';

@Directive({
  selector: 'tri-input-password',
  exportAs: 'triInputPassword',
  host: {
    class: 'tri-input-password'
  }
})
export class TriInputPasswordDirective {
  readonly visibilityToggle = input(true);
  readonly visible = model(false);

  toggleVisible(): void {
    this.visible.update(value => !value);
  }
}

@Directive({
  selector: '[triInputPasswordIcon]'
})
export class TriInputPasswordIconDirective {
  /**
   * @internal
   */
  static ngTemplateContextGuard(_: TriInputPasswordIconDirective, context: unknown): context is { $implicit: boolean } {
    return true;
  }
}
