/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  booleanAttribute,
  inject
} from '@angular/core';

import { TriHighlightPipe } from 'ng-zorro-antd/core/highlight';
import { TriTreeNode, TriTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriTreeDropIndicatorComponent } from './tree-drop-indicator.component';

@Component({
  selector: 'tri-tree-node-title',
  template: `
    <ng-template
      [ngTemplateOutlet]="treeTemplate"
      [ngTemplateOutletContext]="{ $implicit: context, origin: context.origin }"
    />
    @if (!treeTemplate) {
      @if (icon && showIcon) {
        <span
          [class.tri-tree-icon__open]="isSwitcherOpen"
          [class.tri-tree-icon__close]="isSwitcherClose"
          [class.tri-tree-icon_loading]="isLoading"
          [class.tri-select-tree-iconEle]="selectMode"
          [class.tri-tree-iconEle]="!selectMode"
        >
          <span
            [class.tri-select-tree-iconEle]="selectMode"
            [class.tri-select-tree-icon__customize]="selectMode"
            [class.tri-tree-iconEle]="!selectMode"
            [class.tri-tree-icon__customize]="!selectMode"
          >
            <tri-icon [type]="icon" />
          </span>
        </span>
      }
      <span class="tri-tree-title" [innerHTML]="title | nzHighlight: matchedValue : 'i' : 'font-highlight'"></span>
    }
    @if (showIndicator) {
      <tri-tree-drop-indicator [dropPosition]="dragPosition" [level]="context.level" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.title]': 'title',
    '[attr.draggable]': 'canDraggable',
    '[attr.aria-grabbed]': 'canDraggable',
    '[class.draggable]': 'canDraggable',
    '[class.tri-select-tree-node-content-wrapper]': `selectMode`,
    '[class.tri-select-tree-node-content-wrapper-open]': `selectMode && isSwitcherOpen`,
    '[class.tri-select-tree-node-content-wrapper-close]': `selectMode && isSwitcherClose`,
    '[class.tri-select-tree-node-selected]': `selectMode && isSelected`,
    '[class.tri-tree-node-content-wrapper]': `!selectMode`,
    '[class.tri-tree-node-content-wrapper-open]': `!selectMode && isSwitcherOpen`,
    '[class.tri-tree-node-content-wrapper-close]': `!selectMode && isSwitcherClose`,
    '[class.tri-tree-node-selected]': `!selectMode && isSelected`
  },
  imports: [NgTemplateOutlet, TriIconModule, TriHighlightPipe, TriTreeDropIndicatorComponent]
})
export class TriTreeNodeTitleComponent implements OnChanges {
  private cdr = inject(ChangeDetectorRef);

  @Input() searchValue!: string;
  @Input() treeTemplate: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }> | null = null;
  @Input({ transform: booleanAttribute }) draggable!: boolean;
  @Input({ transform: booleanAttribute }) showIcon!: boolean;
  @Input() selectMode = false;
  @Input() context!: TriTreeNode;
  @Input() icon!: string;
  @Input() title!: string;
  @Input({ transform: booleanAttribute }) isLoading!: boolean;
  @Input({ transform: booleanAttribute }) isSelected!: boolean;
  @Input({ transform: booleanAttribute }) isDisabled!: boolean;
  @Input({ transform: booleanAttribute }) isMatched!: boolean;
  @Input({ transform: booleanAttribute }) isExpanded!: boolean;
  @Input({ transform: booleanAttribute }) isLeaf!: boolean;
  // Drag indicator
  @Input() showIndicator = true;
  @Input() dragPosition?: number;

  get canDraggable(): boolean | null {
    return this.draggable && !this.isDisabled ? true : null;
  }

  get matchedValue(): string {
    return this.isMatched ? this.searchValue : '';
  }

  get isSwitcherOpen(): boolean {
    return this.isExpanded && !this.isLeaf;
  }

  get isSwitcherClose(): boolean {
    return !this.isExpanded && !this.isLeaf;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { showIndicator, dragPosition } = changes;
    if (showIndicator || dragPosition) {
      this.cdr.markForCheck();
    }
  }
}
