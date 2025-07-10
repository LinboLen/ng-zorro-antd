/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';
import { EventEmitter, TemplateRef, Type, ViewContainerRef } from '@angular/core';

import { TriButtonShape, TriButtonSize, TriButtonType } from 'ng-zorro-antd/button';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

export type OnClickCallback<T> = (instance: T) => (false | void | {}) | Promise<false | void | {}>;

export type ModalTypes = 'default' | 'confirm'; // Different modal styles we have supported

export type ConfirmType = 'confirm' | 'info' | 'success' | 'error' | 'warning'; // Subtypes of Confirm Modal

export interface StyleObjectLike {
  [key: string]: string;
}

const noopFun = () => void 0;

export class ModalOptions<T = TriSafeAny, D = TriSafeAny, R = TriSafeAny> {
  centered?: boolean = false;
  closable?: boolean = true;
  okLoading?: boolean = false;
  okDisabled?: boolean = false;
  cancelDisabled?: boolean = false;
  cancelLoading?: boolean = false;
  draggable?: boolean = false;
  noAnimation?: boolean = false;
  autofocus?: 'ok' | 'cancel' | 'auto' | null = 'auto';
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean = true;
  zIndex?: number = 1000;
  width?: number | string = 520;
  closeIcon?: string | TemplateRef<void> = 'close';
  okType?: TriButtonType = 'primary';
  okDanger?: boolean = false;
  modalType?: ModalTypes = 'default';
  onCancel?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  onOk?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  data?: D;
  maskStyle?: StyleObjectLike;
  bodyStyle?: StyleObjectLike;
  wrapClassName?: string;
  className?: string;
  style?: object;
  title?: string | TemplateRef<{}>;
  footer?: string | TemplateRef<{}> | Array<ModalButtonOptions<T>> | null; // Default Modal ONLY
  cancelText?: string | null;
  okText?: string | null;
  content?: string | TemplateRef<TriSafeAny> | Type<T>;
  closeOnNavigation?: boolean;
  viewContainerRef?: ViewContainerRef;
  // Template use only
  afterOpen?: EventEmitter<void>;
  afterClose?: EventEmitter<R>;

  // Confirm
  iconType?: string = 'question-circle';
  direction?: Direction;
}

export interface ModalButtonOptions<T = TriSafeAny> {
  label: string;
  type?: TriButtonType;
  danger?: boolean;
  shape?: TriButtonShape;
  ghost?: boolean;
  size?: TriButtonSize;
  autoLoading?: boolean; // Default: true, indicate whether show loading automatically while onClick returned a Promise

  // [NOTE] "componentInstance" will refer to the component's instance when using Component
  show?: boolean | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean);
  loading?: boolean | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean); // This prop CAN'T use with autoLoading=true
  disabled?: boolean | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean);
  onClick?(this: ModalButtonOptions<T>, contentComponentInstance?: T): TriSafeAny | Promise<TriSafeAny>;
  [key: string]: TriSafeAny;
}
