/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { notificationMotion } from 'ng-zorro-antd/core/animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMNComponent } from 'ng-zorro-antd/message';

import { TriNotificationData } from './typings';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-notification',
  exportAs: 'triNotification',
  animations: [notificationMotion],
  template: `
    <div
      class="tri-notification-notice tri-notification-notice-closable"
      [style]="instance.options?.nzStyle || null"
      [class]="instance.options?.nzClass || ''"
      [@notificationMotion]="state"
      (@notificationMotion.done)="animationStateChanged.next($event)"
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
  imports: [TriIconModule, TriOutletModule, NgTemplateOutlet]
})
export class TriNotificationComponent extends TriMNComponent {
  @Input() instance!: Required<TriNotificationData>;
  @Input() index!: number;
  @Input() placement?: string;
  @Output() readonly destroyed = new EventEmitter<{ id: string; userAction: boolean }>();

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

  get state(): string | undefined {
    if (this.instance.state === 'enter') {
      switch (this.placement) {
        case 'topLeft':
        case 'bottomLeft':
          return 'enterLeft';
        case 'topRight':
        case 'bottomRight':
          return 'enterRight';
        case 'top':
          return 'enterTop';
        case 'bottom':
          return 'enterBottom';
        default:
          return 'enterRight';
      }
    } else {
      return this.instance.state;
    }
  }
}
