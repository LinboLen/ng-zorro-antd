/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable, TemplateRef } from '@angular/core';

import type { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriMNService } from 'ng-zorro-antd/message';

import { TriNotificationContainerComponent } from './notification-container.component';
import type { TriNotificationComponent } from './notification.component';
import { TriNotificationContentType, TriNotificationData, TriNotificationDataOptions, TriNotificationRef } from './typings';

let notificationId = 0;

@Injectable({
  providedIn: 'root'
})
export class TriNotificationService extends TriMNService<TriNotificationContainerComponent> {
  protected componentPrefix = 'notification-';

  success(
    title: string | TemplateRef<void>,
    content: TriNotificationContentType,
    options?: TriNotificationDataOptions
  ): TriNotificationRef {
    return this.create('success', title, content, options);
  }

  error(
    title: string | TemplateRef<void>,
    content: TriNotificationContentType,
    options?: TriNotificationDataOptions
  ): TriNotificationRef {
    return this.create('error', title, content, options);
  }

  info(
    title: string | TemplateRef<void>,
    content: TriNotificationContentType,
    options?: TriNotificationDataOptions
  ): TriNotificationRef {
    return this.create('info', title, content, options);
  }

  warning(
    title: string | TemplateRef<void>,
    content: TriNotificationContentType,
    options?: TriNotificationDataOptions
  ): TriNotificationRef {
    return this.create('warning', title, content, options);
  }

  blank(
    title: string | TemplateRef<void>,
    content: TriNotificationContentType,
    options?: TriNotificationDataOptions
  ): TriNotificationRef {
    return this.create('blank', title, content, options);
  }

  create(
    type: 'success' | 'info' | 'warning' | 'error' | 'blank' | string,
    title: string | TemplateRef<void>,
    content: TriNotificationContentType,
    options?: TriNotificationDataOptions
  ): TriNotificationRef {
    return this.createInstance({ type, title, content }, options);
  }

  template(
    template: TemplateRef<{
      $implicit: TriNotificationComponent;
      data: TriSafeAny;
    }>,
    options?: TriNotificationDataOptions
  ): TriNotificationRef {
    return this.createInstance({ template }, options);
  }

  protected generateMessageId(): string {
    return `${this.componentPrefix}-${notificationId++}`;
  }

  private createInstance(message: TriNotificationData, options?: TriNotificationDataOptions): TriNotificationRef {
    this.container = this.withContainer(TriNotificationContainerComponent);

    return this.container.create({
      ...message,
      ...{
        createdAt: new Date(),
        messageId: options?.nzKey || this.generateMessageId(),
        options
      }
    });
  }
}
