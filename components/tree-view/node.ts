/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkTreeNode, CdkTreeNodeDef, CdkTreeNodeOutletContext } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  EmbeddedViewRef,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';

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
    @if (indents.length) {
      <tri-tree-node-indents [indents]="indents"></tri-tree-node-indents>
    }
    <ng-content select="nz-tree-node-toggle, [nz-tree-node-toggle]"></ng-content>
    @if (indents.length && isLeaf) {
      <tri-tree-node-toggle class="nz-tree-leaf-line-icon" treeNodeNoopToggle>
        <span class="tri-tree-switcher-leaf-line"></span>
      </tri-tree-node-toggle>
    }
    <ng-content select="nz-tree-node-checkbox"></ng-content>
    <ng-content select="nz-tree-node-option"></ng-content>
    <ng-content></ng-content>
  `,
  host: {
    class: 'tri-tree-treenode',
    '[class.tri-tree-treenode-switcher-open]': 'isExpanded',
    '[class.tri-tree-treenode-switcher-close]': '!isExpanded',
    '[class.tri-tree-treenode-selected]': 'selected',
    '[class.tri-tree-treenode-disabled]': 'disabled'
  },
  imports: [TriTreeNodeIndentsComponent, TriTreeNodeNoopToggleDirective]
})
export class TriTreeNodeComponent<T> extends TriNodeBase<T> implements OnInit {
  indents: boolean[] = [];
  disabled = false;
  selected = false;
  isLeaf = false;

  private cdr = inject(ChangeDetectorRef);

  override ngOnInit(): void {
    super.ngOnInit();
    this.isLeaf = !this._tree.treeControl?.isExpandable(this.data);
  }

  disable(): void {
    this.disabled = true;
  }

  enable(): void {
    this.disabled = false;
  }

  select(): void {
    this.selected = true;
  }

  deselect(): void {
    this.selected = false;
  }

  setIndents(indents: boolean[]): void {
    this.indents = indents;
    this.cdr.markForCheck();
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
  @Input('nzTreeNodeDefWhen') override when: (index: number, nodeData: T) => boolean = null!;
}

@Directive({
  selector: '[triTreeVirtualScrollNodeOutlet]'
})
export class TriTreeVirtualScrollNodeOutletDirective<T> implements OnChanges {
  private _viewRef: EmbeddedViewRef<TriSafeAny> | null = null;
  private _viewContainerRef = inject(ViewContainerRef);
  @Input() data!: TriTreeVirtualNodeData<T>;
  @Input() compareBy?: ((value: T) => T | string | number) | null;

  ngOnChanges(changes: SimpleChanges): void {
    const recreateView = this.shouldRecreateView(changes);
    if (recreateView) {
      const viewContainerRef = this._viewContainerRef;

      if (this._viewRef) {
        viewContainerRef.remove(viewContainerRef.indexOf(this._viewRef));
      }

      this._viewRef = this.data
        ? viewContainerRef.createEmbeddedView(this.data.nodeDef.template, this.data.context)
        : null;

      if (CdkTreeNode.mostRecentTreeNode && this._viewRef) {
        CdkTreeNode.mostRecentTreeNode.data = this.data.data;
      }
    } else if (this._viewRef && this.data.context) {
      this.updateExistingContext(this.data.context);
    }
  }

  private shouldRecreateView(changes: SimpleChanges): boolean {
    const ctxChange = changes.data;
    return ctxChange && this.hasContextShapeChanged(ctxChange);
  }

  private hasContextShapeChanged(ctxChange: SimpleChange): boolean {
    const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
    const currCtxKeys = Object.keys(ctxChange.currentValue || {});

    if (prevCtxKeys.length === currCtxKeys.length) {
      for (const propName of currCtxKeys) {
        if (prevCtxKeys.indexOf(propName) === -1) {
          return true;
        }
      }
      return (
        this.innerCompareBy(ctxChange.previousValue?.data ?? null) !==
        this.innerCompareBy(ctxChange.currentValue?.data ?? null)
      );
    }
    return true;
  }

  get innerCompareBy(): (value: T | null) => T | string | number | null {
    return value => {
      if (value === null) return value;
      if (this.compareBy) return this.compareBy(value as T);
      return value;
    };
  }

  private updateExistingContext(ctx: TriSafeAny): void {
    for (const propName of Object.keys(ctx)) {
      this._viewRef!.context[propName] = (this.data.context as TriSafeAny)[propName];
    }
  }
}
