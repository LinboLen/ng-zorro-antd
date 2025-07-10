/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ModalOptions } from './modal-types';

export function applyConfigDefaults(config: ModalOptions, defaultOptions: ModalOptions): ModalOptions {
  return { ...defaultOptions, ...config };
}

export function getValueWithConfig<T>(
  userValue: T | undefined,
  configValue: T | undefined,
  defaultValue: T
): T | undefined {
  return typeof userValue === 'undefined'
    ? typeof configValue === 'undefined'
      ? defaultValue
      : configValue
    : userValue;
}

export function getConfigFromComponent<T extends ModalOptions>(component: T): ModalOptions {
  const {
    centered,
    mask,
    maskClosable,
    closable,
    okLoading,
    okDisabled,
    cancelDisabled,
    cancelLoading,
    keyboard,
    noAnimation,
    draggable,
    content,
    footer,
    zIndex,
    width,
    wrapClassName,
    className,
    style,
    title,
    closeIcon,
    maskStyle,
    bodyStyle,
    okText,
    cancelText,
    okType,
    okDanger,
    iconType,
    modalType,
    onOk,
    onCancel,
    afterOpen,
    afterClose,
    closeOnNavigation,
    autofocus
  } = component;
  return {
    centered,
    mask,
    maskClosable,
    draggable,
    closable,
    okLoading,
    okDisabled,
    cancelDisabled,
    cancelLoading,
    keyboard,
    noAnimation,
    content,
    footer,
    zIndex,
    width,
    wrapClassName,
    className,
    style,
    title,
    closeIcon,
    maskStyle,
    bodyStyle,
    okText,
    cancelText,
    okType,
    okDanger,
    iconType,
    modalType,
    onOk,
    onCancel,
    afterOpen,
    afterClose,
    closeOnNavigation,
    autofocus
  };
}
