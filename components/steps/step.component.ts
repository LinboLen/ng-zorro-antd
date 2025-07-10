/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { NgClassType, TriSizeDSType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriProgressFormatter, TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triStep',
  template: `
    <div
      #itemContainer
      class="tri-steps-item-container"
      [attr.role]="clickable && !disabled ? 'button' : null"
      [tabindex]="clickable && !disabled ? 0 : null"
    >
      @if (!last) {
        <div class="tri-steps-item-tail"></div>
      }
      <div class="tri-steps-item-icon">
        @if (!showProcessDot) {
          @if (showProgress) {
            <div class="tri-steps-progress-icon">
              <tri-progress
                [percent]="percentage"
                type="circle"
                [width]="size === 'small' ? 32 : 40"
                [format]="nullProcessFormat"
                [strokeWidth]="4"
              ></tri-progress>
            </div>
          }
          @if (status === 'finish' && !icon) {
            <span class="tri-steps-icon"><tri-icon type="check" /></span>
          }
          @if (status === 'error') {
            <span class="tri-steps-icon"><tri-icon type="close" /></span>
          }
          @if ((status === 'process' || status === 'wait') && !icon) {
            <span class="tri-steps-icon">
              {{ index + 1 }}
            </span>
          }
          @if (icon) {
            <span class="tri-steps-icon">
              <ng-container *stringTemplateOutlet="icon; let icon">
                <tri-icon [type]="icon" />
              </ng-container>
            </span>
          }
        }
        @if (showProcessDot) {
          <span class="tri-steps-icon">
            <ng-template #processDotTemplate>
              <span class="tri-steps-icon-dot"></span>
            </ng-template>
            <ng-template
              [ngTemplateOutlet]="customProcessTemplate || processDotTemplate"
              [ngTemplateOutletContext]="{
                $implicit: processDotTemplate,
                status: status,
                index: index
              }"
            ></ng-template>
          </span>
        }
      </div>
      <div class="tri-steps-item-content">
        <div class="tri-steps-item-title">
          <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
          @if (subtitle) {
            <div class="tri-steps-item-subtitle">
              <ng-container *stringTemplateOutlet="subtitle">{{ subtitle }}</ng-container>
            </div>
          }
        </div>
        <div class="tri-steps-item-description">
          <ng-container *stringTemplateOutlet="description">{{ description }}</ng-container>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'tri-steps-item',
    '[class.tri-steps-item-wait]': 'status === "wait"',
    '[class.tri-steps-item-process]': 'status === "process"',
    '[class.tri-steps-item-finish]': 'status === "finish"',
    '[class.tri-steps-item-error]': 'status === "error"',
    '[class.tri-steps-item-active]': 'currentIndex === index',
    '[class.tri-steps-item-disabled]': 'disabled',
    '[class.tri-steps-item-custom]': '!!icon',
    '[class.tri-steps-next-error]': '(outStatus === "error") && (currentIndex === index + 1)'
  },
  imports: [TriProgressModule, TriIconModule, TriOutletModule, NgTemplateOutlet]
})
export class TriStepComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild('processDotTemplate', { static: false }) processDotTemplate?: TemplateRef<void>;
  @ViewChild('itemContainer', { static: true }) itemContainer!: ElementRef<HTMLElement>;

  @Input() title?: string | TemplateRef<void>;
  @Input() subtitle?: string | TemplateRef<void>;
  @Input() description?: string | TemplateRef<void>;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() percentage: number | null = null;
  @Input() size: TriSizeDSType = 'default';

  @Input()
  get status(): string {
    return this._status;
  }

  set status(status: string) {
    this._status = status;
    this.isCustomStatus = true;
  }

  isCustomStatus = false;
  private _status = 'wait';

  @Input()
  get icon(): NgClassType | TemplateRef<void> | undefined {
    return this._icon;
  }

  set icon(value: NgClassType | TemplateRef<void> | undefined) {
    if (!(value instanceof TemplateRef)) {
      this.oldAPIIcon = typeof value === 'string' && value.indexOf('anticon') > -1;
    }
    this._icon = value;
  }

  oldAPIIcon = true;
  private _icon?: NgClassType | TemplateRef<void>;

  customProcessTemplate?: TemplateRef<{ $implicit: TemplateRef<void>; status: string; index: number }>; // Set by parent.
  direction = 'horizontal';
  index = 0;
  last = false;
  outStatus = 'process';
  showProcessDot = false;
  clickable = false;

  clickOutsideAngular$ = new Subject<number>();

  readonly nullProcessFormat: TriProgressFormatter = () => null;

  get showProgress(): boolean {
    return (
      this.percentage !== null &&
      !this.icon &&
      this.status === 'process' &&
      this.percentage >= 0 &&
      this.percentage <= 100
    );
  }

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(current: number) {
    this._currentIndex = current;
    if (!this.isCustomStatus) {
      this._status = current > this.index ? 'finish' : current === this.index ? this.outStatus || '' : 'wait';
    }
  }

  private _currentIndex = 0;

  ngOnInit(): void {
    fromEventOutsideAngular(this.itemContainer.nativeElement, 'click')
      .pipe(
        filter(() => this.clickable && this.currentIndex !== this.index && !this.disabled),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.clickOutsideAngular$.next(this.index);
      });
  }

  enable(): void {
    this.disabled = false;
    this.cdr.markForCheck();
  }

  disable(): void {
    this.disabled = true;
    this.cdr.markForCheck();
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
