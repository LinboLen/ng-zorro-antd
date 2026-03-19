/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-loop-banner',
  imports: [TriAlertModule],
  template: `
    <tri-alert banner [message]="message" />
    <br />
    <tri-alert banner [message]="messagePauseOnHover" />

    <ng-template #message>
      <tri-alert-marquee speed="60">
        I can be a long text that scrolls continuously in the banner alert. This text will loop seamlessly.
      </tri-alert-marquee>
    </ng-template>

    <ng-template #messagePauseOnHover>
      <tri-alert-marquee speed="60" pauseOnHover="true">
        Hover over me to pause the scrolling animation. This text loops continuously.
      </tri-alert-marquee>
    </ng-template>
  `
})
export class TriDemoAlertLoopBannerComponent {}
