/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, merge } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { BooleanInput, TriSizeDSType } from 'ng-zorro-antd/core/types';
import { toBoolean } from 'ng-zorro-antd/core/util';

import { TriStepComponent } from './step.component';

export type TriDirectionType = 'horizontal' | 'vertical';
export type TriStatusType = 'wait' | 'process' | 'finish' | 'error';
export type TriProgressDotTemplate = TemplateRef<{ $implicit: TemplateRef<void>; status: string; index: number }>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triSteps',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-steps',
    '[class.tri-steps-horizontal]': `direction === 'horizontal'`,
    '[class.tri-steps-vertical]': `direction === 'vertical'`,
    '[class.tri-steps-label-horizontal]': `direction === 'horizontal'`,
    '[class.tri-steps-label-vertical]': `(showProcessDot || labelPlacement === 'vertical') && direction === 'horizontal'`,
    '[class.tri-steps-dot]': 'showProcessDot',
    '[class.tri-steps-small]': `size === 'small'`,
    '[class.tri-steps-navigation]': `type === 'navigation'`,
    '[class.tri-steps-rtl]': `dir === 'rtl'`,
    '[class.tri-steps-with-progress]': 'showProgress'
  }
})
export class TriStepsComponent implements OnChanges, OnInit, AfterContentInit {
  static ngAcceptInputType_nzProgressDot: BooleanInput | TriProgressDotTemplate | undefined | null;

  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @ContentChildren(TriStepComponent) steps!: QueryList<TriStepComponent>;

  @Input() current = 0;
  @Input() direction: TriDirectionType = 'horizontal';
  @Input() labelPlacement: 'horizontal' | 'vertical' = 'horizontal';
  @Input() type: 'default' | 'navigation' = 'default';
  @Input() size: TriSizeDSType = 'default';
  @Input() startIndex = 0;
  @Input() status: TriStatusType = 'process';

  @Input()
  set progressDot(value: boolean | TriProgressDotTemplate | undefined | null) {
    if (value instanceof TemplateRef) {
      this.showProcessDot = true;
      this.customProcessDotTemplate = value;
    } else {
      this.showProcessDot = toBoolean(value);
    }
    this.updateChildrenSteps();
  }

  @Output() readonly indexChange = new EventEmitter<number>();

  private indexChangeSubscription = Subscription.EMPTY;

  showProcessDot = false;
  showProgress = false;
  customProcessDotTemplate?: TemplateRef<{ $implicit: TemplateRef<void>; status: string; index: number }>;
  dir: Direction = 'ltr';

  ngOnChanges(changes: SimpleChanges): void {
    const { nzStartIndex, nzDirection, nzStatus, nzCurrent, nzSize } = changes;
    if (nzStartIndex || nzDirection || nzStatus || nzCurrent || nzSize) {
      this.updateChildrenSteps();
    }
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
    this.updateChildrenSteps();
  }

  ngAfterContentInit(): void {
    if (this.steps) {
      this.steps.changes.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.updateHostProgressClass();
        this.updateChildrenSteps();
      });
    }
  }

  private updateHostProgressClass(): void {
    if (this.steps && !this.showProcessDot) {
      this.showProgress = !!this.steps.toArray().find(step => step.percentage !== null);
    }
  }

  private updateChildrenSteps(): void {
    if (this.steps) {
      const length = this.steps.length;
      this.steps.toArray().forEach((step, index) => {
        Promise.resolve().then(() => {
          step.size = this.size;
          step.outStatus = this.status;
          step.showProcessDot = this.showProcessDot;
          if (this.customProcessDotTemplate) {
            step.customProcessTemplate = this.customProcessDotTemplate;
          }
          step.clickable = this.indexChange.observers.length > 0;
          step.direction = this.direction;
          step.index = index + this.startIndex;
          step.currentIndex = this.current;
          step.last = length === index + 1;
          step.markForCheck();
        });
      });
      this.indexChangeSubscription.unsubscribe();
      this.indexChangeSubscription = merge(...this.steps.map(step => step.clickOutsideAngular$))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(index => {
          if (this.indexChange.observers.length) {
            this.ngZone.run(() => this.indexChange.emit(index));
          }
        });
    }
  }
}
