/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
  numberAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { isNotNil, numberAttributeWithZeroFallback } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

import {
  TriProgressCirclePath,
  TriProgressColorGradient,
  TriProgressFormatter,
  TriProgressGapPositionType,
  TriProgressGradientProgress,
  TriProgressStatusType,
  TriProgressStepItem,
  TriProgressStrokeColorType,
  TriProgressStrokeLinecapType,
  TriProgressTypeType
} from './typings';
import { handleCircleGradient, handleLinearGradient } from './utils';

let gradientIdSeed = 0;

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'progress';
const statusIconNameMap = new Map([
  ['success', 'check'],
  ['exception', 'close']
]);
const statusColorMap = new Map([
  ['normal', '#108ee9'],
  ['exception', '#ff5500'],
  ['success', '#87d068']
]);
const defaultFormatter: TriProgressFormatter = (p: number): string => `${p}%`;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-progress',
  exportAs: 'triProgress',
  imports: [TriIconModule, TriOutletModule, NgTemplateOutlet],
  template: `
    <ng-template #progressInfoTemplate>
      @if (showInfo) {
        <span class="tri-progress-text">
          @if ((status === 'exception' || status === 'success') && !format) {
            <tri-icon [type]="icon" />
          } @else {
            <ng-container *stringTemplateOutlet="formatter; stringTemplateOutletContext: { $implicit: percent }; let formatter">
              {{ formatter(nzPercent) }}
            </ng-container>
          }
        </span>
      }
    </ng-template>

    <div
      [class]="'ant-progress ant-progress-status-' + status"
      [class.tri-progress-line]="type === 'line'"
      [class.tri-progress-small]="size === 'small'"
      [class.tri-progress-default]="size === 'default'"
      [class.tri-progress-show-info]="showInfo"
      [class.tri-progress-circle]="isCircleStyle"
      [class.tri-progress-steps]="isSteps"
      [class.tri-progress-rtl]="dir === 'rtl'"
    >
      @if (type === 'line') {
        <div>
          <!-- normal line style -->
          @if (isSteps) {
            <div class="tri-progress-steps-outer">
              @for (step of steps; track $index) {
                <div class="tri-progress-steps-item" [style]="step"></div>
              }
              <ng-template [ngTemplateOutlet]="progressInfoTemplate" />
            </div>
          } @else {
            <div class="tri-progress-outer">
              <div class="tri-progress-inner">
                <div
                  class="tri-progress-bg"
                  [style.width.%]="percent"
                  [style.border-radius]="strokeLinecap === 'round' ? '100px' : '0'"
                  [style.background]="!isGradient ? strokeColor : null"
                  [style.background-image]="isGradient ? lineGradient : null"
                  [style.height.px]="strokeWidth"
                ></div>
                @if (successPercent || successPercent === 0) {
                  <div
                    class="tri-progress-success-bg"
                    [style.width.%]="successPercent"
                    [style.border-radius]="strokeLinecap === 'round' ? '100px' : '0'"
                    [style.height.px]="strokeWidth"
                  ></div>
                }
              </div>
            </div>
            <ng-template [ngTemplateOutlet]="progressInfoTemplate" />
          }
        </div>
      }
      <!-- line progress -->

      <!-- circle / dashboard progress -->

      @if (isCircleStyle) {
        <div
          [style.width.px]="width"
          [style.height.px]="width"
          [style.fontSize.px]="width * 0.15 + 6"
          class="tri-progress-inner"
          [class.tri-progress-circle-gradient]="isGradient"
        >
          <svg class="tri-progress-circle " viewBox="0 0 100 100">
            @if (isGradient) {
              <defs>
                <linearGradient [id]="'gradient-' + gradientId" x1="100%" y1="0%" x2="0%" y2="0%">
                  @for (i of circleGradient; track $index) {
                    <stop [attr.offset]="i.offset" [attr.stop-color]="i.color"></stop>
                  }
                </linearGradient>
              </defs>
            }

            <path
              class="tri-progress-circle-trail"
              stroke="#f3f3f3"
              fill-opacity="0"
              [attr.stroke-width]="strokeWidth"
              [attr.d]="pathString"
              [style]="trailPathStyle"
            ></path>
            @for (p of progressCirclePath; track $index) {
              <path
                class="tri-progress-circle-path"
                fill-opacity="0"
                [attr.d]="pathString"
                [attr.stroke-linecap]="strokeLinecap"
                [attr.stroke]="p.stroke"
                [attr.stroke-width]="percent ? strokeWidth : 0"
                [style]="p.strokePathStyle"
              ></path>
            }
          </svg>
          <ng-template [ngTemplateOutlet]="progressInfoTemplate" />
        </div>
      }
    </div>
  `
})
export class TriProgressComponent implements OnChanges, OnInit {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  @Input() @WithConfig() showInfo: boolean = true;
  @Input() width = 132;
  @Input() @WithConfig() strokeColor?: TriProgressStrokeColorType = undefined;
  @Input() @WithConfig() size: 'default' | 'small' = 'default';
  @Input() format?: TriProgressFormatter;
  @Input({ transform: numberAttributeWithZeroFallback }) successPercent?: number;
  @Input({ transform: numberAttribute }) percent: number = 0;
  @Input({ transform: numberAttributeWithZeroFallback }) @WithConfig() strokeWidth?: number;
  @Input({ transform: numberAttributeWithZeroFallback }) @WithConfig() gapDegree?: number;
  @Input() status?: TriProgressStatusType;
  @Input() type: TriProgressTypeType = 'line';
  @Input() @WithConfig() gapPosition: TriProgressGapPositionType = 'top';
  @Input() @WithConfig() strokeLinecap: TriProgressStrokeLinecapType = 'round';

  @Input({ transform: numberAttribute }) steps: number = 0;

  _steps: TriProgressStepItem[] = [];

  /** Gradient style when `nzType` is `line`. */
  lineGradient: string | null = null;

  /** If user uses gradient color. */
  isGradient = false;

  /** If the linear progress is a step progress. */
  isSteps = false;

  /**
   * Each progress whose `nzType` is circle or dashboard should have unique id to
   * define `<linearGradient>`.
   */
  gradientId = gradientIdSeed++;

  /** Paths to rendered in the template. */
  progressCirclePath: TriProgressCirclePath[] = [];
  circleGradient?: Array<{ offset: string; color: string }>;
  trailPathStyle: NgStyleInterface | null = null;
  pathString?: string;
  icon!: string;

  dir: Direction = 'ltr';

  get formatter(): TriProgressFormatter {
    return this.format || defaultFormatter;
  }

  get _status(): TriProgressStatusType {
    return this.status || this.inferredStatus;
  }

  get _strokeWidth(): number {
    return this.strokeWidth || (this.type === 'line' && this.size !== 'small' ? 8 : 6);
  }

  get isCircleStyle(): boolean {
    return this.type === 'circle' || this.type === 'dashboard';
  }

  private cachedStatus: TriProgressStatusType = 'normal';
  private inferredStatus: TriProgressStatusType = 'normal';

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => {
      this.updateIcon();
      this.setStrokeColor();
      this.getCirclePaths();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      nzSteps,
      nzGapPosition,
      nzStrokeLinecap,
      nzStrokeColor,
      nzGapDegree,
      nzType,
      nzStatus,
      nzPercent,
      nzSuccessPercent,
      nzStrokeWidth
    } = changes;

    if (nzStatus) {
      this.cachedStatus = this.status || this.cachedStatus;
    }

    if (nzPercent || nzSuccessPercent) {
      const fillAll = parseInt(this.percent.toString(), 10) >= 100;
      if (fillAll) {
        if ((isNotNil(this.successPercent) && this.successPercent! >= 100) || this.successPercent === undefined) {
          this.inferredStatus = 'success';
        }
      } else {
        this.inferredStatus = this.cachedStatus;
      }
    }

    if (nzStatus || nzPercent || nzSuccessPercent || nzStrokeColor) {
      this.updateIcon();
    }

    if (nzStrokeColor) {
      this.setStrokeColor();
    }

    if (nzGapPosition || nzStrokeLinecap || nzGapDegree || nzType || nzPercent || nzStrokeColor || nzStrokeColor) {
      this.getCirclePaths();
    }

    if (nzPercent || nzSteps || nzStrokeWidth) {
      this.isSteps = this.steps > 0;
      if (this.isSteps) {
        this.getSteps();
      }
    }
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
  }

  private updateIcon(): void {
    const ret = statusIconNameMap.get(this._status);
    this.icon = ret ? ret + (this.isCircleStyle ? '-o' : '-circle-fill') : '';
  }

  /**
   * Calculate step render configs.
   */
  private getSteps(): void {
    const current = Math.floor(this.steps * (this.percent / 100));
    const stepWidth = this.size === 'small' ? 2 : 14;

    const steps = [];

    for (let i = 0; i < this.steps; i++) {
      let color;
      if (i <= current - 1) {
        color = this.strokeColor;
      }
      const stepStyle = {
        backgroundColor: `${color}`,
        width: `${stepWidth}px`,
        height: `${this._strokeWidth}px`
      };
      steps.push(stepStyle);
    }

    this._steps = steps;
  }

  /**
   * Calculate paths when the type is circle or dashboard.
   */
  private getCirclePaths(): void {
    if (!this.isCircleStyle) {
      return;
    }

    const values = isNotNil(this.successPercent) ? [this.successPercent!, this.percent] : [this.percent];

    // Calculate shared styles.
    const radius = 50 - this._strokeWidth / 2;
    const gapPosition = this.gapPosition || (this.type === 'circle' ? 'top' : 'bottom');
    const len = Math.PI * 2 * radius;
    const gapDegree = this.gapDegree || (this.type === 'circle' ? 0 : 75);

    let beginPositionX = 0;
    let beginPositionY = -radius;
    let endPositionX = 0;
    let endPositionY = radius * -2;

    switch (gapPosition) {
      case 'left':
        beginPositionX = -radius;
        beginPositionY = 0;
        endPositionX = radius * 2;
        endPositionY = 0;
        break;
      case 'right':
        beginPositionX = radius;
        beginPositionY = 0;
        endPositionX = radius * -2;
        endPositionY = 0;
        break;
      case 'bottom':
        beginPositionY = radius;
        endPositionY = radius * 2;
        break;
      default:
    }

    this.pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
       a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
       a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;

    this.trailPathStyle = {
      strokeDasharray: `${len - gapDegree}px ${len}px`,
      strokeDashoffset: `-${gapDegree / 2}px`,
      transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'
    };

    // Calculate styles for each path.
    this.progressCirclePath = values
      .map((value, index) => {
        const isSuccessPercent = values.length === 2 && index === 0;
        return {
          stroke: this.isGradient && !isSuccessPercent ? `url(#gradient-${this.gradientId})` : null,
          strokePathStyle: {
            stroke: !this.isGradient
              ? isSuccessPercent
                ? statusColorMap.get('success')
                : (this.strokeColor as string)
              : null,
            transition:
              'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s',
            strokeDasharray: `${((value || 0) / 100) * (len - gapDegree)}px ${len}px`,
            strokeDashoffset: `-${gapDegree / 2}px`
          }
        };
      })
      .reverse();
  }

  private setStrokeColor(): void {
    const color = this.strokeColor;
    const isGradient = (this.isGradient = !!color && typeof color !== 'string');
    if (isGradient && !this.isCircleStyle) {
      this.lineGradient = handleLinearGradient(color as TriProgressColorGradient);
    } else if (isGradient && this.isCircleStyle) {
      this.circleGradient = handleCircleGradient(this.strokeColor as TriProgressGradientProgress);
    } else {
      this.lineGradient = null;
      this.circleGradient = [];
    }
  }
}
