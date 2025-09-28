/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { moveUpMotion } from 'ng-zorro-antd/core/animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriMNComponent } from './base';
import { TriMessageData } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-message',
  exportAs: 'triMessage',
  animations: [moveUpMotion],
  template: `
    <div
      class="tri-message-notice"
      [class]="instance.options?.nzClass"
      [style]="instance.options?.nzStyle"
      [@moveUpMotion]="instance.state"
      (@moveUpMotion.done)="animationStateChanged.next($event)"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      <div class="tri-message-notice-content">
        <div class="tri-message-custom-content" [class]="'ant-message-' + instance.type">
          @switch (instance.type) {
            @case ('success') {
              <tri-icon type="check-circle" />
            }
            @case ('info') {
              <tri-icon type="info-circle" />
            }
            @case ('warning') {
              <tri-icon type="exclamation-circle" />
            }
            @case ('error') {
              <tri-icon type="close-circle" />
            }
            @case ('loading') {
              <tri-icon type="loading" />
            }
          }
          <ng-container
            *stringTemplateOutlet="instance.content; stringTemplateOutletContext: { $implicit: this, data: instance.options?.nzData }"
          >
            <span [innerHTML]="instance.content"></span>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  imports: [TriIconModule, TriOutletModule]
})
export class TriMessageComponent extends TriMNComponent implements OnInit {
  @Input() override instance!: Required<TriMessageData>;
  @Output() override readonly destroyed = new EventEmitter<{ id: string; userAction: boolean }>();
  index?: number;
}
