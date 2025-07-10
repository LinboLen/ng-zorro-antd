/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ComponentRef, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriDrawerPlacement } from './drawer-options';

export abstract class TriDrawerRef<T = TriSafeAny, R = TriSafeAny> {
  abstract _afterClose: Observable<R | undefined>;
  abstract _afterOpen: Observable<void>;
  abstract close(result?: R): void;
  abstract open(): void;
  abstract getContentComponent(): T | null;
  abstract getContentComponentRef(): Readonly<ComponentRef<T>> | null;

  abstract closable?: boolean;
  abstract noAnimation?: boolean;
  abstract maskClosable?: boolean;
  abstract keyboard?: boolean;
  abstract mask?: boolean;
  abstract title?: string | TemplateRef<{}>;
  abstract placement?: TriDrawerPlacement;
  abstract maskStyle?: object;
  abstract bodyStyle?: object;
  abstract wrapClassName?: string;
  abstract width?: number | string;
  abstract height?: number | string;
  abstract zIndex?: number | string;
  abstract offsetX?: number | string;
  abstract offsetY?: number | string;
}
