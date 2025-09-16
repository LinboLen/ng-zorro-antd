/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { createOverlayRef, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriDrawerOptions, TriDrawerOptionsOfComponent } from './drawer-options';
import { TriDrawerRef } from './drawer-ref';
import { TriDrawerComponent } from './drawer.component';

export class DrawerBuilderForService<T extends {}, R> {
  private drawerRef: TriDrawerComponent<T, R> | null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private overlayRef: OverlayRef,
    private options: TriDrawerOptions
  ) {
    /** pick {@link TriDrawerOptions.nzOnCancel} and omit this option */
    const { nzOnCancel, ...componentOption } = this.options;
    this.drawerRef = this.overlayRef.attach(new ComponentPortal(TriDrawerComponent)).instance;
    this.updateOptions(componentOption);
    // Prevent repeatedly open drawer when tap focus element.
    this.drawerRef.savePreviouslyFocusedElement();
    this.drawerRef.onViewInit.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.drawerRef!.open();
    });
    this.drawerRef.onClose.subscribe(() => {
      if (nzOnCancel) {
        nzOnCancel().then(canClose => {
          if (canClose !== false) {
            this.drawerRef!.close();
          }
        });
      } else {
        this.drawerRef!.close();
      }
    });

    this.drawerRef._afterClose.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.overlayRef.dispose();
      this.drawerRef = null;
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    });
  }

  getInstance(): TriDrawerRef<T, R> {
    return this.drawerRef!;
  }

  updateOptions(options: TriDrawerOptionsOfComponent): void {
    Object.assign(this.drawerRef!, options);
  }
}

@Injectable()
export class TriDrawerService {
  private injector = inject(Injector);

  create<T extends {} = TriSafeAny, D = undefined, R = TriSafeAny>(
    options: TriDrawerOptions<T, D extends undefined ? {} : D>
  ): TriDrawerRef<T, R> {
    return new DrawerBuilderForService<T, R>(createOverlayRef(this.injector), options).getInstance();
  }
}
