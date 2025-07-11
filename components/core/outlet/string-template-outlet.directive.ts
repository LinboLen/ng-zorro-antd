/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { isTemplateRef } from 'ng-zorro-antd/core/util';

@Directive({
  selector: '[triStringTemplateOutlet]',
  exportAs: 'triStringTemplateOutlet'
})
export class TriStringTemplateOutletDirective<_T = unknown> implements OnChanges {
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<TriSafeAny>);

  private embeddedViewRef: EmbeddedViewRef<TriSafeAny> | null = null;
  private context = new TriStringTemplateOutletContext();
  @Input() stringTemplateOutletContext: TriSafeAny | null = null;
  @Input() stringTemplateOutlet: TriSafeAny | TemplateRef<TriSafeAny> = null;

  static ngTemplateContextGuard<T>(
    _dir: TriStringTemplateOutletDirective<T>,
    _ctx: TriSafeAny
  ): _ctx is TriStringTemplateOutletContext {
    return true;
  }

  private recreateView(): void {
    this.viewContainer.clear();
    if (isTemplateRef(this.stringTemplateOutlet)) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(
        this.stringTemplateOutlet,
        this.stringTemplateOutletContext
      );
    } else {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

  private updateContext(): void {
    const newCtx = isTemplateRef(this.stringTemplateOutlet) ? this.stringTemplateOutletContext : this.context;
    const oldCtx = this.embeddedViewRef!.context as TriSafeAny;
    if (newCtx) {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzStringTemplateOutletContext, nzStringTemplateOutlet } = changes;
    const shouldRecreateView = (): boolean => {
      let shouldOutletRecreate = false;
      if (nzStringTemplateOutlet) {
        shouldOutletRecreate =
          nzStringTemplateOutlet.firstChange ||
          isTemplateRef(nzStringTemplateOutlet.previousValue) ||
          isTemplateRef(nzStringTemplateOutlet.currentValue);
      }
      const hasContextShapeChanged = (ctxChange: SimpleChange): boolean => {
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
          for (const propName of currCtxKeys) {
            if (prevCtxKeys.indexOf(propName) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      };
      const shouldContextRecreate =
        nzStringTemplateOutletContext && hasContextShapeChanged(nzStringTemplateOutletContext);
      return shouldContextRecreate || shouldOutletRecreate;
    };

    if (nzStringTemplateOutlet) {
      this.context.$implicit = nzStringTemplateOutlet.currentValue;
    }

    const recreateView = shouldRecreateView();
    if (recreateView) {
      /** recreate view when context shape or outlet change **/
      this.recreateView();
    } else {
      /** update context **/
      this.updateContext();
    }
  }
}

export class TriStringTemplateOutletContext {
  public $implicit: TriSafeAny;
}
