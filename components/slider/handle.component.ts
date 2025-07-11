/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';

import { NgStyleInterface, TriTSType } from 'ng-zorro-antd/core/types';
import { numberAttributeWithZeroFallback } from 'ng-zorro-antd/core/util';
import { TriToolTipModule, TriTooltipDirective } from 'ng-zorro-antd/tooltip';

import { TriSliderShowTooltip } from './typings';

@Component({
  selector: 'tri-slider-handle',
  exportAs: 'triSliderHandle',
  template: `
    <div
      #handle
      class="tri-slider-handle"
      tabindex="0"
      tri-tooltip
      [style]="style"
      [tooltipTitle]="tooltipFormatter === null || tooltipVisible === 'never' ? null : tooltipTitle"
      [tooltipTitleContext]="{ $implicit: value }"
      [tooltipTrigger]="null"
      [tooltipPlacement]="tooltipPlacement"
    ></div>
  `,
  host: {
    '(mouseenter)': 'enterHandle()',
    '(mouseleave)': 'leaveHandle()'
  },
  imports: [TriToolTipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriSliderHandleComponent implements OnChanges {
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('handle', { static: false }) handleEl?: ElementRef;
  @ViewChild(TriTooltipDirective, { static: false }) tooltip?: TriTooltipDirective;

  @Input({ transform: booleanAttribute }) vertical?: boolean;
  @Input({ transform: booleanAttribute }) reverse?: boolean;
  @Input({ transform: numberAttributeWithZeroFallback }) offset?: number;
  @Input({ transform: numberAttributeWithZeroFallback }) value?: number;
  @Input() tooltipVisible: TriSliderShowTooltip = 'default';
  @Input() tooltipPlacement?: string;
  @Input() tooltipFormatter?: null | ((value: number) => string) | TemplateRef<void>;
  @Input({ transform: booleanAttribute }) active = false;
  @Input() dir: Direction = 'ltr';
  @Input() dragging?: boolean;

  tooltipTitle?: TriTSType;
  style: NgStyleInterface = {};

  ngOnChanges(changes: SimpleChanges): void {
    const { offset, value, active, tooltipVisible, reverse, dir } = changes;

    if (offset || reverse || dir) {
      this.updateStyle();
    }

    if (value) {
      this.updateTooltipTitle();
      this.updateTooltipPosition();
    }

    if (active) {
      if (active.currentValue) {
        this.toggleTooltip(true);
      } else {
        this.toggleTooltip(false);
      }
    }

    if (tooltipVisible?.currentValue === 'always') {
      Promise.resolve().then(() => this.toggleTooltip(true, true));
    }
  }

  enterHandle = (): void => {
    if (!this.dragging) {
      this.toggleTooltip(true);
      this.updateTooltipPosition();
      this.cdr.detectChanges();
    }
  };

  leaveHandle = (): void => {
    if (!this.dragging) {
      this.toggleTooltip(false);
      this.cdr.detectChanges();
    }
  };

  focus(): void {
    this.handleEl?.nativeElement.focus();
  }

  private toggleTooltip(show: boolean, force: boolean = false): void {
    if (!force && (this.tooltipVisible !== 'default' || !this.tooltip)) {
      return;
    }

    if (show) {
      this.tooltip?.show();
    } else {
      this.tooltip?.hide();
    }
  }

  private updateTooltipTitle(): void {
    if (this.tooltipFormatter) {
      this.tooltipTitle =
        typeof this.tooltipFormatter === 'function' ? this.tooltipFormatter(this.value!) : this.tooltipFormatter;
    } else {
      this.tooltipTitle = `${this.value}`;
    }
  }

  private updateTooltipPosition(): void {
    if (this.tooltip) {
      Promise.resolve().then(() => this.tooltip?.updatePosition());
    }
  }

  private updateStyle(): void {
    if (this.vertical) {
      this.style = {
        [this.reverse ? 'top' : 'bottom']: `${this.offset}%`,
        [this.reverse ? 'bottom' : 'top']: 'auto',
        transform: this.reverse ? null : `translateY(+50%)`
      };
    } else {
      this.style = {
        ...this.getHorizontalStylePosition(),
        transform: `translateX(${this.reverse ? (this.dir === 'rtl' ? '-' : '+') : this.dir === 'rtl' ? '+' : '-'}50%)`
      };
    }
    this.cdr.markForCheck();
  }

  private getHorizontalStylePosition(): { left: string; right: string } {
    let left = this.reverse ? 'auto' : `${this.offset}%`;
    let right = this.reverse ? `${this.offset}%` : 'auto';
    if (this.dir === 'rtl') {
      [left, right] = [right, left];
    }
    return { left, right };
  }
}
