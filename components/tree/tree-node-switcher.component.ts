/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, booleanAttribute } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriTreeNode, TriTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  template: `
    @if (isShowSwitchIcon) {
      @if (!isLoading) {
        <ng-container *stringTemplateOutlet="expandedIcon; stringTemplateOutletContext: { $implicit: context, origin: context.origin }">
          <tri-icon
            type="caret-down"
            [class.tri-select-tree-switcher-icon]="selectMode"
            [class.tri-tree-switcher-icon]="!selectMode"
          />
        </ng-container>
      } @else {
        <tri-icon type="loading" [spin]="true" class="tri-tree-switcher-loading-icon" />
      }
    }
    @if (showLine) {
      @if (!isLoading) {
        <ng-container *stringTemplateOutlet="expandedIcon; stringTemplateOutletContext: { $implicit: context, origin: context.origin }">
          @if (isShowLineIcon) {
            <tri-icon [type]="isSwitcherOpen ? 'minus-square' : 'plus-square'" class="tri-tree-switcher-line-icon" />
          } @else {
            <tri-icon type="file" class="tri-tree-switcher-line-icon" />
          }
        </ng-container>
      } @else {
        <tri-icon type="loading" [spin]="true" class="tri-tree-switcher-loading-icon" />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tri-select-tree-switcher]': 'selectMode',
    '[class.tri-select-tree-switcher-noop]': 'selectMode && isLeaf',
    '[class.tri-select-tree-switcher_open]': 'selectMode && isSwitcherOpen',
    '[class.tri-select-tree-switcher_close]': 'selectMode && isSwitcherClose',
    '[class.tri-tree-switcher]': '!selectMode',
    '[class.tri-tree-switcher-noop]': '!selectMode && isLeaf',
    '[class.tri-tree-switcher_open]': '!selectMode && isSwitcherOpen',
    '[class.tri-tree-switcher_close]': '!selectMode && isSwitcherClose'
  },
  imports: [TriIconModule, TriOutletModule]
})
export class TriTreeNodeSwitcherComponent {
  @Input({ transform: booleanAttribute }) showExpand?: boolean;
  @Input({ transform: booleanAttribute }) showLine?: boolean;
  @Input() expandedIcon?: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }>;
  @Input() selectMode = false;
  @Input() context!: TriTreeNode;
  @Input({ transform: booleanAttribute }) isLeaf?: boolean;
  @Input({ transform: booleanAttribute }) isLoading?: boolean;
  @Input({ transform: booleanAttribute }) isExpanded?: boolean;

  get isShowLineIcon(): boolean {
    return !this.isLeaf && !!this.showLine;
  }

  get isShowSwitchIcon(): boolean {
    return !this.isLeaf && !this.showLine;
  }

  get isSwitcherOpen(): boolean {
    return !!this.isExpanded && !this.isLeaf;
  }

  get isSwitcherClose(): boolean {
    return !this.isExpanded && !this.isLeaf;
  }
}
