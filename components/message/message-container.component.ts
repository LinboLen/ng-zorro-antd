/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { MessageConfig, onConfigChangeEventForComponent } from 'ng-zorro-antd/core/config';
import { toCssPixel } from 'ng-zorro-antd/core/util';

import { TriMNContainerComponent } from './base';
import { TriMessageComponent } from './message.component';

const TRI_CONFIG_COMPONENT_NAME = 'message';

const TRI_MESSAGE_DEFAULT_CONFIG: Required<MessageConfig> = {
  nzAnimate: true,
  nzDuration: 3000,
  nzMaxStack: 7,
  nzPauseOnHover: true,
  nzTop: 24,
  nzDirection: 'ltr'
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-message-container',
  exportAs: 'triMessageContainer',
  template: `
    <div class="tri-message" [class.tri-message-rtl]="dir === 'rtl'" [style.top]="top">
      @for (instance of instances; track instance) {
        <tri-message [instance]="instance" (destroyed)="remove($event.id, $event.userAction)" />
      }
    </div>
  `,
  imports: [TriMessageComponent]
})
export class TriMessageContainerComponent extends TriMNContainerComponent {
  dir: Direction = this.configService.getConfigForComponent(TRI_CONFIG_COMPONENT_NAME)?.nzDirection || 'ltr';
  top?: string | null;

  constructor() {
    super();
    this.updateConfig();
  }

  protected subscribeConfigChange(): void {
    onConfigChangeEventForComponent(TRI_CONFIG_COMPONENT_NAME, () => {
      this.updateConfig();
      this.dir = this.configService.getConfigForComponent(TRI_CONFIG_COMPONENT_NAME)?.nzDirection || this.dir;
    });
  }

  protected updateConfig(): void {
    this.config = {
      ...TRI_MESSAGE_DEFAULT_CONFIG,
      ...this.config,
      ...this.configService.getConfigForComponent(TRI_CONFIG_COMPONENT_NAME)
    };

    this.top = toCssPixel(this.config.nzTop);
    this.cdr.markForCheck();
  }
}
