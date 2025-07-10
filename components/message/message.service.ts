/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { TriMNService } from './base';
import { TriMessageContainerComponent } from './message-container.component';
import { TriMessageContentType, TriMessageData, TriMessageDataOptions, TriMessageRef, TriMessageType } from './typings';

@Injectable({
  providedIn: 'root'
})
export class TriMessageService extends TriMNService<TriMessageContainerComponent> {
  protected componentPrefix = 'message-';

  success(content: TriMessageContentType, options?: TriMessageDataOptions): TriMessageRef {
    return this.createInstance({ type: 'success', content }, options);
  }

  error(content: TriMessageContentType, options?: TriMessageDataOptions): TriMessageRef {
    return this.createInstance({ type: 'error', content }, options);
  }

  info(content: TriMessageContentType, options?: TriMessageDataOptions): TriMessageRef {
    return this.createInstance({ type: 'info', content }, options);
  }

  warning(content: TriMessageContentType, options?: TriMessageDataOptions): TriMessageRef {
    return this.createInstance({ type: 'warning', content }, options);
  }

  loading(content: TriMessageContentType, options?: TriMessageDataOptions): TriMessageRef {
    return this.createInstance({ type: 'loading', content }, options);
  }

  create(type: TriMessageType | string, content: TriMessageContentType, options?: TriMessageDataOptions): TriMessageRef {
    return this.createInstance({ type, content }, options);
  }

  private createInstance(message: TriMessageData, options?: TriMessageDataOptions): TriMessageRef {
    this.container = this.withContainer(TriMessageContainerComponent);

    return this.container.create({
      ...message,
      ...{
        createdAt: new Date(),
        messageId: this.getInstanceId(),
        options
      }
    });
  }
}
