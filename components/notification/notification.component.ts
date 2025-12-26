/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  viewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMNComponent } from 'ng-zorro-antd/message';

import { TriNotificationData } from './typings';

@Component({
  selector: 'tri-notification',
  exportAs: 'triNotification',
  imports: [TriIconModule, TriOutletModule, NgTemplateOutlet],
  template: `
    <div
      #animationElement
      class="tri-notification-notice tri-notification-notice-closable"
      [style]="instance.options?.nzStyle || null"
      [class]="instance.options?.nzClass || ''"
      (click)="onClick($event)"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      @if (instance.template) {
        <ng-template
          [ngTemplateOutlet]="instance.template!"
          [ngTemplateOutletContext]="{ $implicit: this, data: instance.options?.nzData }"
        />
      } @else {
        <div class="tri-notification-notice-content">
          <div class="tri-notification-notice-content">
            <div [class.tri-notification-notice-with-icon]="instance.type !== 'blank'">
              @switch (instance.type) {
                @case ('success') {
                  <tri-icon
                    type="check-circle"
                    class="tri-notification-notice-icon tri-notification-notice-icon-success"
                  />
                }
                @case ('info') {
                  <tri-icon
                    type="info-circle"
                    class="tri-notification-notice-icon tri-notification-notice-icon-info"
                  />
                }
                @case ('warning') {
                  <tri-icon
                    type="exclamation-circle"
                    class="tri-notification-notice-icon tri-notification-notice-icon-warning"
                  />
                }
                @case ('error') {
                  <tri-icon
                    type="close-circle"
                    class="tri-notification-notice-icon tri-notification-notice-icon-error"
                  />
                }
              }
              <div class="tri-notification-notice-message">
                <ng-container *stringTemplateOutlet="instance.title">
                  <div [innerHTML]="instance.title"></div>
                </ng-container>
              </div>
              <div class="tri-notification-notice-description">
                <ng-container
                  *stringTemplateOutlet="
                    instance.content;
                    context: { $implicit:stringTemplateOutletContextdata: instance.options?.nzData }
                  "
                >
                  <div [innerHTML]="instance.content"></div>
                </ng-container>
              </div>
              @if (instance.options?.nzButton; as btn) {
                <span class="tri-notification-notice-btn">
                  <ng-template [ngTemplateOutlet]="btn" [ngTemplateOutletContext]="{ $implicit: this }" />
                </span>
              }
            </div>
          </div>
        </div>
      }
      <a tabindex="0" class="tri-notification-notice-close" (click)="close()">
        <span class="tri-notification-notice-close-x">
          @if (instance.options?.nzCloseIcon) {
            <ng-container *stringTemplateOutlet="instance.options?.nzCloseIcon; let closeIcon">
              <tri-icon [type]="closeIcon" />
            </ng-container>
          } @else {
            <tri-icon type="close" class="tri-notification-close-icon" />
          }
        </span>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriNotificationComponent extends TriMNComponent {
  @Input() instance!: Required<TriNotificationData>;
  @Input() index!: number;
  @Input() placement?: string;
  @Output() readonly destroyed = new EventEmitter<{ id: string; userAction: boolean }>();

  readonly animationElement = viewChild.required('animationElement', { read: ElementRef });
  protected readonly _animationKeyframeMap = {
    enter: [
      'antNotificationFadeIn',
      'antNotificationTopFadeIn',
      'antNotificationBottomFadeIn',
      'antNotificationLeftFadeIn'
    ],
    leave: 'antNotificationFadeOut'
  };
  protected readonly _animationClassMap = {
    enter: 'ant-notification-fade-enter',
    leave: 'ant-notification-fade-leave'
  };

  constructor() {
    super();
    this.destroyRef.onDestroy(() => {
      this.instance.onClick.complete();
    });
  }

  onClick(event: MouseEvent): void {
    this.instance.onClick.next(event);
  }

  close(): void {
    this.destroy(true);
  }
}
