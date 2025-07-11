/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { booleanAttribute, Directive, forwardRef, Input } from '@angular/core';

@Directive({
  selector: 'tri-tree-node-toggle[nzTreeNodeNoopToggle],[triTreeNodeNoopToggle]',
  host: {
    class: 'tri-tree-switcher ant-tree-switcher-noop'
  }
})
export class TriTreeNodeNoopToggleDirective {}

@Directive({
  selector: 'tri-tree-node-toggle:not([nzTreeNodeNoopToggle]),[triTreeNodeToggle]',
  providers: [{ provide: CdkTreeNodeToggle, useExisting: forwardRef(() => TriTreeNodeToggleDirective) }],
  host: {
    class: 'tri-tree-switcher',
    '[class.tri-tree-switcher_open]': 'isExpanded',
    '[class.tri-tree-switcher_close]': '!isExpanded'
  }
})
export class TriTreeNodeToggleDirective<T> extends CdkTreeNodeToggle<T> {
  @Input({ alias: 'nzTreeNodeToggleRecursive', transform: booleanAttribute }) override recursive = false;

  get isExpanded(): boolean {
    return this._treeNode.isExpanded;
  }
}

@Directive({
  selector: '[triTreeNodeToggleRotateIcon]',
  host: {
    class: 'tri-tree-switcher-icon'
  }
})
export class TriTreeNodeToggleRotateIconDirective {}

@Directive({
  selector: '[triTreeNodeToggleActiveIcon]',
  host: {
    class: 'tri-tree-switcher-loading-icon'
  }
})
export class TriTreeNodeToggleActiveIconDirective {}
