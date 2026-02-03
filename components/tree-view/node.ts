/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkTreeNode, CdkTreeNodeDef, CdkTreeNodeOutletContext } from '@angular/cdk/tree';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  effect,
  EmbeddedViewRef,
  forwardRef,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewContainerRef
} from '@angular/core';

import { TriAnimationTreeCollapseDirective } from 'ng-zorro-antd/core/animation';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriTreeNodeIndentsComponent } from './indent';
import { TriNodeBase } from './node-base';
import { TriTreeNodeNoopToggleDirective } from './toggle';

export interface TriTreeVirtualNodeData<T> {
  data: T;
  context: CdkTreeNodeOutletContext<T>;
  nodeDef: CdkTreeNodeDef<T>;
}

@Component({
  selector: 'tri-tree-node:not([builtin])',
  exportAs: 'triTreeNode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CdkTreeNode,
      useExisting: forwardRef(() => TriTreeNodeComponent)
    },
    {
      provide: TriNodeBase,
      useExisting: forwardRef(() => TriTreeNodeComponent)
    }
  ],
  template: `
    @if (indents().length) {
      <tri-tree-node-indents [indents]="indents()" />
    }
    <ng-content select="nz-tree-node-toggle, [nz-tree-node-toggle]" />
    @if (indents().length && isLeaf) {
      <tri-tree-node-toggle class="nz-tree-leaf-line-icon" treeNodeNoopToggle>
        <span class="tri-tree-switcher-leaf-line"></span>
      </tri-tree-node-toggle>
    }
    <ng-content select="nz-tree-node-checkbox" />
    <ng-content select="nz-tree-node-option" />
    <ng-content />
  `,
  hostDirectives: [TriAnimationTreeCollapseDirective],
  host: {
    class: 'tri-tree-treenode',
    '[class.tri-tree-treenode-switcher-open]': 'isExpanded',
    '[class.tri-tree-treenode-switcher-close]': '!isExpanded',
    '[class.tri-tree-treenode-selected]': 'selected()',
    '[class.tri-tree-treenode-disabled]': 'disabled()'
  },
  imports: [TriTreeNodeIndentsComponent, TriTreeNodeNoopToggleDirective]
})
export class TriTreeNodeComponent<T> extends TriNodeBase<T> implements OnDestroy, OnInit {
  // Used to determine whether it is a leaf node
  @Input({ alias: 'nzExpandable', transform: booleanAttribute })
  override get isExpandable(): boolean {
    return super.isExpandable;
  }
  override set isExpandable(value: boolean) {
    super.isExpandable = value;
  }

  indents = signal<boolean[]>([]);
  disabled = signal(false);
  selected = signal(false);

  get isLeaf(): boolean {
    return !this.isExpandable;
  }

  disable(): void {
    this.disabled.set(true);
  }

  enable(): void {
    this.disabled.set(false);
  }

  select(): void {
    this.selected.set(true);
  }

  deselect(): void {
    this.selected.set(false);
  }

  setIndents(indents: boolean[]): void {
    this.indents.set(indents);
  }
}

@Directive({
  selector: '[triTreeNodeDef]',
  providers: [
    {
      provide: CdkTreeNodeDef,
      useExisting: forwardRef(() => TriTreeNodeDefDirective)
    }
  ]
})
export class TriTreeNodeDefDirective<T> extends CdkTreeNodeDef<T> {
  @Input({ alias: 'nzTreeNodeDefWhen' }) override when: (index: number, nodeData: T) => boolean = null!;
}

@Directive({
  selector: '[triTreeVirtualScrollNodeOutlet]'
})
export class TriTreeVirtualScrollNodeOutletDirective<T> {
  readonly data = input.required<TriTreeVirtualNodeData<T>>();
  readonly compareBy = input.required<(value: T) => TriSafeAny>();

  private readonly _viewContainerRef = inject(ViewContainerRef);
  private _viewRef: EmbeddedViewRef<TriSafeAny> | null = null;
  private _previousData: TriTreeVirtualNodeData<T> | null = null;

  constructor() {
    effect(() => {
      const currentData = this.data();

      const recreateView = this.shouldRecreateView(this._previousData, currentData, this.compareBy());
      if (recreateView) {
        const viewContainerRef = this._viewContainerRef;

        if (this._viewRef) {
          viewContainerRef.remove(viewContainerRef.indexOf(this._viewRef));
        }

        this._viewRef = currentData
          ? viewContainerRef.createEmbeddedView(currentData.nodeDef.template, currentData.context)
          : null;

        if (CdkTreeNode.mostRecentTreeNode && this._viewRef) {
          CdkTreeNode.mostRecentTreeNode.data = currentData.data;
        }
      } else if (this._viewRef && currentData.context) {
        this.updateExistingContext(currentData.context);
      }

      // Save the current value as the previous value for the next iteration
      this._previousData = currentData;
    });
  }

  private shouldRecreateView(
    previousData: TriTreeVirtualNodeData<T> | null,
    currentData: TriTreeVirtualNodeData<T>,
    compareByFn: (value: T) => TriSafeAny
  ): boolean {
    const prevCtxKeys = Object.keys(previousData || {});
    const currCtxKeys = Object.keys(currentData || {});

    if (prevCtxKeys.length === currCtxKeys.length) {
      for (const propName of currCtxKeys) {
        if (prevCtxKeys.indexOf(propName) === -1) {
          return true;
        }
      }
      return compareByFn((previousData?.data ?? null) as T) !== compareByFn((currentData?.data ?? null) as T);
    }
    return true;
  }

  private updateExistingContext(ctx: CdkTreeNodeOutletContext<T>): void {
    for (const [key, value] of Object.entries(ctx)) {
      this._viewRef!.context[key] = value;
    }
  }
}
