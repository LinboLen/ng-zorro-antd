/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

import { NgClassInterface, NgStyleInterface, TriSafeAny } from 'ng-zorro-antd/core/types';

import type { TriNotificationComponent } from './notification.component';

export type TriNotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom';

export type TriNotificationContentType =
  | string
  | TemplateRef<void | {
      $implicit: TriNotificationComponent;
      data: TriSafeAny;
    }>;

export interface TriNotificationDataOptions<T = {}> {
  nzKey?: string;
  nzStyle?: NgStyleInterface;
  nzClass?: NgClassInterface | string;
  nzCloseIcon?: TemplateRef<void> | string;
  nzButton?: TemplateRef<{ $implicit: TriNotificationComponent }>;
  nzPlacement?: TriNotificationPlacement;
  nzData?: T;
  nzDuration?: number;
  nzAnimate?: boolean;
  nzPauseOnHover?: boolean;
}

export interface TriNotificationData {
  title?: string | TemplateRef<void>;
  content?: TriNotificationContentType;
  createdAt?: Date;
  messageId?: string;
  options?: TriNotificationDataOptions;
  state?: 'enter' | 'leave';
  template?: TemplateRef<{}>;
  type?: 'success' | 'info' | 'warning' | 'error' | 'blank' | string;

  // observables exposed to users
  onClose?: Subject<boolean>;
  onClick?: Subject<MouseEvent>;
}

export type TriNotificationRef = Pick<Required<TriNotificationData>, 'onClose' | 'onClick' | 'messageId'>;
