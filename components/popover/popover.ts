/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  booleanAttribute
} from '@angular/core';

import { zoomBigMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, WithConfig } from 'ng-zorro-antd/core/config';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriOverlayModule } from 'ng-zorro-antd/core/overlay';
import { NgStyleInterface, TriSafeAny, TriTSType } from 'ng-zorro-antd/core/types';
import {
  TriTooltipBaseDirective,
  TriTooltipComponent,
  TriTooltipTrigger,
  PropertyMapping,
  isTooltipEmpty
} from 'ng-zorro-antd/tooltip';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'popover';

@Directive({
  selector: '[tri-popover]',
  exportAs: 'triPopover',
  host: {
    '[class.tri-popover-open]': 'visible'
  }
})
export class TriPopoverDirective extends TriTooltipBaseDirective {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  /* eslint-disable @angular-eslint/no-input-rename, @angular-eslint/no-output-rename */
  @Input({ alias: 'nzPopoverArrowPointAtCenter', transform: booleanAttribute }) override arrowPointAtCenter?: boolean;
  @Input('nzPopoverTitle') override title?: TriTSType;
  @Input('nzPopoverTitleContext') titleContext?: TriSafeAny | null = null;
  @Input('nzPopoverContent') override content?: TriTSType;
  @Input('nzPopoverContentContext') contentContext?: TriSafeAny | null = null;
  @Input('nz-popover') override directiveTitle?: TriTSType | null;
  @Input('nzPopoverTrigger') override trigger?: TriTooltipTrigger = 'hover';
  @Input('nzPopoverPlacement') override placement?: string | string[] = 'top';
  @Input('nzPopoverOrigin') override origin?: ElementRef<HTMLElement>;
  @Input('nzPopoverVisible') override visible?: boolean;
  @Input('nzPopoverMouseEnterDelay') override mouseEnterDelay?: number;
  @Input('nzPopoverMouseLeaveDelay') override mouseLeaveDelay?: number;
  @Input('nzPopoverOverlayClassName') override overlayClassName?: string;
  @Input('nzPopoverOverlayStyle') override overlayStyle?: NgStyleInterface;
  @Input('nzPopoverOverlayClickable') override overlayClickable?: boolean;

  override directiveContent?: TriTSType | null = null;

  @Input() @WithConfig() popoverBackdrop?: boolean = false;

  @Output('nzPopoverVisibleChange') override readonly visibleChange = new EventEmitter<boolean>();

  protected override getProxyPropertyMap(): PropertyMapping {
    return {
      nzPopoverBackdrop: ['nzBackdrop', () => this.popoverBackdrop],
      titleContext: ['nzTitleContext', () => this.titleContext],
      contentContext: ['nzContentContext', () => this.contentContext],
      ...super.getProxyPropertyMap()
    };
  }

  constructor() {
    super(TriPopoverComponent);
  }
}

@Component({
  selector: 'tri-popover',
  exportAs: 'triPopoverComponent',
  animations: [zoomBigMotion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayHasBackdrop]="hasBackdrop"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayPush]="cdkConnectedOverlayPush"
      [arrowPointAtCenter]="arrowPointAtCenter"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        class="tri-popover"
        [class.tri-popover-rtl]="dir === 'rtl'"
        [class]="_classMap"
        [style]="overlayStyle"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [noAnimation]="noAnimation?.nzNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        <div class="tri-popover-content">
          <div class="tri-popover-arrow">
            <span class="tri-popover-arrow-content"></span>
          </div>
          <div class="tri-popover-inner" role="tooltip">
            <div>
              @if (title) {
                <div class="tri-popover-title">
                  <ng-container *stringTemplateOutlet="title; stringTemplateOutletContext: { $implicit: titleContext }">
                    {{ title }}
                  </ng-container>
                </div>
              }
              <div class="tri-popover-inner-content">
                <ng-container *stringTemplateOutlet="content; stringTemplateOutletContext: { $implicit: contentContext }">
                  {{ content }}
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  imports: [OverlayModule, TriOverlayModule, TriNoAnimationDirective, TriOutletModule]
})
export class TriPopoverComponent extends TriTooltipComponent {
  override _prefix = 'ant-popover';
  contentContext: object | null = null;

  get hasBackdrop(): boolean {
    return this.trigger === 'click' ? this.backdrop : false;
  }

  protected override isEmpty(): boolean {
    return isTooltipEmpty(this.title) && isTooltipEmpty(this.content);
  }
}
