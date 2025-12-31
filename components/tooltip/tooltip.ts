/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { TriNoAnimationDirective, withAnimationCheck } from 'ng-zorro-antd/core/animation';
import { isPresetColor, TriPresetColor } from 'ng-zorro-antd/core/color';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriOverlayModule } from 'ng-zorro-antd/core/overlay';
import { NgStyleInterface, TriTSType } from 'ng-zorro-antd/core/types';

import {
  isTooltipEmpty,
  TriTooltipBaseComponent,
  TriTooltipBaseDirective,
  TriTooltipTrigger,
  PropertyMapping
} from './base';

@Directive({
  selector: '[tri-tooltip]',
  exportAs: 'triTooltip',
  host: {
    '[class.tri-tooltip-open]': 'visible'
  }
})
export class TriTooltipDirective extends TriTooltipBaseDirective {
  /* eslint-disable @angular-eslint/no-input-rename, @angular-eslint/no-output-rename */
  @Input('nzTooltipTitle') override title?: TriTSType | null;
  @Input('nzTooltipTitleContext') titleContext?: object | null = null;
  @Input('nz-tooltip') override directiveTitle?: TriTSType | null;
  @Input('nzTooltipTrigger') override trigger?: TriTooltipTrigger = 'hover';
  @Input('nzTooltipPlacement') override placement?: string | string[] = 'top';
  @Input('nzTooltipOrigin') override origin?: ElementRef<HTMLElement>;
  @Input('nzTooltipVisible') override visible?: boolean;
  @Input('nzTooltipMouseEnterDelay') override mouseEnterDelay?: number;
  @Input('nzTooltipMouseLeaveDelay') override mouseLeaveDelay?: number;
  @Input('nzTooltipOverlayClassName') override overlayClassName?: string;
  @Input('nzTooltipOverlayStyle') override overlayStyle?: NgStyleInterface;
  @Input({ alias: 'nzTooltipArrowPointAtCenter', transform: booleanAttribute }) override arrowPointAtCenter?: boolean;
  /** @deprecated Default is false, and customization is no longer supported. This will be removed in v22.0.0. */
  @Input({ transform: booleanAttribute }) override cdkConnectedOverlayPush?: boolean = false;
  @Input() tooltipColor?: string;

  override directiveContent?: TriTSType | null = null;
  override content?: TriTSType | null = null;
  override overlayClickable?: boolean;

  @Output('nzTooltipVisibleChange') override readonly visibleChange = new EventEmitter<boolean>();

  constructor() {
    super(TriTooltipComponent);
  }

  protected override getProxyPropertyMap(): PropertyMapping {
    return {
      ...super.getProxyPropertyMap(),
      nzTooltipColor: ['nzColor', () => this.tooltipColor],
      titleContext: ['nzTitleContext', () => this.titleContext]
    };
  }
}

@Component({
  selector: 'tri-tooltip',
  exportAs: 'triTooltipComponent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayPush]="cdkConnectedOverlayPush"
      [arrowPointAtCenter]="arrowPointAtCenter"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        class="tri-tooltip"
        [class.tri-tooltip-rtl]="dir() === 'rtl'"
        [class]="_classMap"
        [style]="overlayStyle"
        [noAnimation]="!!noAnimation?.nzNoAnimation?.()"
        [animate.enter]="zoomAnimationEnter()"
        [animate.leave]="zoomAnimationLeave()"
      >
        <div class="tri-tooltip-arrow" [style]="_arrowStyleMap"></div>
        <div class="tri-tooltip-content">
          <div class="tri-tooltip-inner" [style]="_contentStyleMap">
            <ng-container *stringTemplateOutlet="title; stringTemplateOutletContext: titleContext">{{ title }}</ng-container>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  imports: [OverlayModule, TriNoAnimationDirective, TriOutletModule, TriOverlayModule]
})
export class TriTooltipComponent extends TriTooltipBaseComponent {
  protected _animationPrefix = 'ant-zoom-big-fast';
  override title: TriTSType | null = null;
  titleContext: object | null = null;
  color?: string | TriPresetColor;

  protected _arrowStyleMap: NgStyleInterface = {};
  protected _contentStyleMap: NgStyleInterface = {};

  protected readonly zoomAnimationEnter = withAnimationCheck(
    () => `${this._animationPrefix}-enter ${this._animationPrefix}-enter-active`
  );
  protected readonly zoomAnimationLeave = withAnimationCheck(
    () => `${this._animationPrefix}-leave ${this._animationPrefix}-leave-active`
  );

  protected isEmpty(): boolean {
    return isTooltipEmpty(this.title);
  }

  protected override updateStyles(): void {
    const isColorPreset = this.color && isPresetColor(this.color);

    this._classMap = {
      ...this.transformClassListToMap(this.overlayClassName),
      [`${this._prefix}-placement-${this.preferredPlacement}`]: true,
      [`${this._prefix}-${this.color}`]: isColorPreset
    };

    this._contentStyleMap = {
      backgroundColor: !!this.color && !isColorPreset ? this.color : null
    };

    this._arrowStyleMap = {
      '--antd-arrow-background-color': !!this.color && !isColorPreset ? this.color : null
    };
  }
}

/**
 * @deprecated Use {@link TriTooltipComponent} instead.
 * This will be removed in v21.0.0.
 */
export const TriToolTipComponent = TriTooltipComponent;
