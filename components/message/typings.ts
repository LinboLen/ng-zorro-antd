/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

import { TriSafeAny, type NgClassInterface, type NgStyleInterface } from 'ng-zorro-antd/core/types';

import { TriMNComponent } from './base';

export type TriMessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export type TriMessageContentType = string | TemplateRef<void | { $implicit: TriMNComponent; data: TriSafeAny }>;

export interface TriMessageDataOptions {
  nzDuration?: number;
  nzAnimate?: boolean;
  nzPauseOnHover?: boolean;
  nzData?: TriSafeAny;
  nzStyle?: NgStyleInterface | string;
  nzClass?: NgClassInterface | string;
}

export interface TriMessageData {
  type?: TriMessageType | string;
  content?: TriMessageContentType;
  messageId?: string;
  createdAt?: Date;
  options?: TriMessageDataOptions;
  state?: 'enter' | 'leave';
  onClose?: Subject<boolean>;
}

export type TriMessageRef = Pick<Required<TriMessageData>, 'onClose' | 'messageId'>;
