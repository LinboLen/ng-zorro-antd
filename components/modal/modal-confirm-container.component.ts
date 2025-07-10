/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkScrollable } from '@angular/cdk/overlay';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriI18nService, TriModalI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriPipesModule } from 'ng-zorro-antd/pipes';

import { nzModalAnimations } from './modal-animations';
import { TriModalCloseComponent } from './modal-close.component';
import { BaseModalContainerComponent } from './modal-container.directive';

@Component({
  selector: '',
  exportAs: 'triModalConfirmContainer',
  template: `
    <div
      #modalElement
      role="document"
      class="tri-modal"
      [class]="className!"
      [style]="style!"
      [style.width]="config?.nzWidth! | nzToCssUnit"
    >
      <div class="tri-modal-content">
        @if (closable) {
          <button tri-modal-close (click)="onCloseClick()"></button>
        }

        <div class="tri-modal-body" [style]="bodyStyle!">
          <div class="tri-modal-confirm-body-wrapper">
            <div class="tri-modal-confirm-body">
              <tri-icon [type]="iconType!" />
              <span class="tri-modal-confirm-title">
                <ng-container *stringTemplateOutlet="title">
                  <span [innerHTML]="title"></span>
                </ng-container>
              </span>
              <div class="tri-modal-confirm-content">
                <ng-template cdkPortalOutlet></ng-template>
                @if (isStringContent) {
                  <div [innerHTML]="content"></div>
                }
              </div>
            </div>
            <div class="tri-modal-confirm-btns">
              @if (cancelText !== null) {
                <button
                  [attr.cdkFocusInitial]="autofocus === 'cancel' || null"
                  tri-button
                  (click)="onCancel()"
                  [loading]="cancelLoading"
                  [disabled]="cancelDisabled"
                >
                  {{ config.nzCancelText || locale.cancelText }}
                </button>
              }
              @if (okText !== null) {
                <button
                  [attr.cdkFocusInitial]="autofocus === 'ok' || null"
                  tri-button
                  [type]="okType!"
                  (click)="onOk()"
                  [loading]="okLoading"
                  [disabled]="okDisabled"
                  [danger]="okDanger"
                >
                  {{ config.nzOkText || locale.okText }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  hostDirectives: [CdkScrollable],
  animations: [nzModalAnimations.modalContainer],
  // Using OnPush for modal caused footer can not to detect changes. we can fix it when 8.x.
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    tabindex: '-1',
    role: 'dialog',
    '[class]': 'config.nzWrapClassName ? "ant-modal-wrap " + config.nzWrapClassName : "ant-modal-wrap"',
    '[class.tri-modal-wrap-rtl]': `dir === 'rtl'`,
    '[class.tri-modal-centered]': 'centered',
    '[style.zIndex]': 'config.nzZIndex',
    '[@.disabled]': 'config.nzNoAnimation',
    '[@modalContainer]': 'state',
    '(@modalContainer.start)': 'onAnimationStart($event)',
    '(@modalContainer.done)': 'onAnimationDone($event)',
    '(click)': 'onContainerClick($event)'
  },
  imports: [TriPipesModule, TriIconModule, TriModalCloseComponent, TriOutletModule, PortalModule, TriButtonModule]
})
export class TriModalConfirmContainerComponent extends BaseModalContainerComponent implements OnInit {
  private i18n = inject(TriI18nService);

  @ViewChild(CdkPortalOutlet, { static: true }) set _portalOutlet(portalOutlet: CdkPortalOutlet) {
    this.portalOutlet = portalOutlet;
  }
  @ViewChild('modalElement', { static: true }) set _modalElementRef(elementRef: ElementRef<HTMLDivElement>) {
    this.modalElementRef = elementRef;
  }
  @Output() override readonly cancelTriggered = new EventEmitter<void>();
  @Output() override readonly okTriggered = new EventEmitter<void>();
  locale!: TriModalI18nInterface;

  constructor() {
    super();

    this.i18n.localeChange.pipe(takeUntilDestroyed()).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Modal');
    });
  }

  ngOnInit(): void {
    this.setupMouseListeners(this.modalElementRef);
  }

  onCancel(): void {
    this.cancelTriggered.emit();
  }

  onOk(): void {
    this.okTriggered.emit();
  }
}
