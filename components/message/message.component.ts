/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  viewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriMNComponent } from './base';
import { TriMessageData } from './typings';

@Component({
  selector: 'tri-message',
  exportAs: 'triMessage',
  imports: [TriIconModule, TriOutletModule],
  template: `
    <div
      #animationElement
      class="tri-message-notice"
      [class]="instance.options?.nzClass"
      [style]="instance.options?.nzStyle"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriMessageComponent extends TriMNComponent implements OnInit {
  @Input() override instance!: Required<TriMessageData>;
  @Output() override readonly destroyed = new EventEmitter<{ id: string; userAction: boolean }>();
  index?: number;

  readonly animationElement = viewChild.required('animationElement', { read: ElementRef });
  protected readonly _animationKeyframeMap = {
    enter: 'MessageMoveIn',
    leave: 'MessageMoveOut'
  };
  protected readonly _animationClassMap = {
    enter: 'ant-message-move-up-enter',
    leave: 'ant-message-move-up-leave'
  };
}
