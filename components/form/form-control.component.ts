/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  AnimationCallbackEvent,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlDirective, FormControlName, NgControl, NgModel } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { filter, startWith, tap } from 'rxjs/operators';

import { isAnimationEnabled, TriNoAnimationDirective, withAnimationCheck } from 'ng-zorro-antd/core/animation';
import { TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { toBoolean } from 'ng-zorro-antd/core/util';
import { TriI18nService } from 'ng-zorro-antd/i18n';

import { TriFormControlStatusType, TriFormItemComponent } from './form-item.component';
import { TriFormDirective } from './form.directive';

@Component({
  selector: 'tri-form-control',
  exportAs: 'triFormControl',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tri-form-item-control-input">
      <div class="tri-form-item-control-input-content">
        <ng-content></ng-content>
      </div>
    </div>
    @if (innerTip) {
      <div
        [animate.enter]="validateAnimationEnter()"
        [animate.leave]="validateAnimationLeave()"
        (animate.leave)="onAnimationLeave($event)"
        class="tri-form-item-explain tri-form-item-explain-connected"
      >
        <div role="alert" [class]="['ant-form-item-explain-' + status]">
          <ng-container *stringTemplateOutlet="innerTip; stringTemplateOutletContext: { $implicit: validateControl }">{{
            innerTip
          }}</ng-container>
        </div>
      </div>
    }

    @if (extra) {
      <div class="tri-form-item-extra">
        <ng-container *stringTemplateOutlet="extra">{{ extra }}</ng-container>
      </div>
    }
  `,
  providers: [TriFormStatusService],
  host: {
    class: 'tri-form-item-control'
  },
  imports: [TriOutletModule]
})
export class TriFormControlComponent implements OnChanges, OnInit, AfterContentInit {
  private cdr = inject(ChangeDetectorRef);
  public i18n = inject(TriI18nService);
  private formStatusService = inject(TriFormStatusService);
  private destroyRef = inject(DestroyRef);

  private _hasFeedback = false;
  private validateChanges: Subscription = Subscription.EMPTY;
  private validateString: string | null = null;
  private localeId!: string;
  private autoErrorTip?: string;

  get #disableAutoTips(): boolean {
    return this.disableAutoTips !== undefined
      ? toBoolean(this.disableAutoTips)
      : !!this.formDirective?.disableAutoTips;
  }

  private readonly noAnimation = inject(TriNoAnimationDirective, { optional: true, host: true });
  private readonly animationEnabled = isAnimationEnabled(() => !this.noAnimation?.noAnimation());
  protected readonly validateAnimationEnter = withAnimationCheck(() => 'ant-form-validate_animation-enter');
  protected readonly validateAnimationLeave = withAnimationCheck(() => 'ant-form-validate_animation-leave');

  status: TriFormControlStatusType = '';
  validateControl: AbstractControl | NgModel | null = null;
  innerTip: string | TemplateRef<{ $implicit: AbstractControl | NgModel }> | null = null;

  @ContentChild(NgControl, { static: false }) defaultValidateControl?: FormControlName | FormControlDirective;
  @Input() successTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() warningTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() errorTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() validatingTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() extra?: string | TemplateRef<void>;
  @Input() autoTips: Record<string, Record<string, string>> = {};
  @Input({ transform: booleanAttribute }) disableAutoTips?: boolean;

  @Input({ transform: booleanAttribute })
  set hasFeedback(value: boolean) {
    this._hasFeedback = value;
    this.formStatusService.formStatusChanges.next({ status: this.status, hasFeedback: this._hasFeedback });
    if (this.formItemComponent) {
      this.formItemComponent.setHasFeedback(this._hasFeedback);
    }
  }

  get hasFeedback(): boolean {
    return this._hasFeedback;
  }

  @Input()
  set validateStatus(value: string | AbstractControl | FormControlName | NgModel) {
    if (value instanceof AbstractControl || value instanceof NgModel) {
      this.validateControl = value;
      this.validateString = null;
      this.watchControl();
    } else if (value instanceof FormControlName) {
      this.validateControl = value.control;
      this.validateString = null;
      this.watchControl();
    } else {
      this.validateString = value;
      this.validateControl = null;
      this.setStatus();
    }
  }

  private watchControl(): void {
    this.validateChanges.unsubscribe();
    /** miss detect https://github.com/angular/angular/issues/10887 **/
    if (this.validateControl && this.validateControl.statusChanges) {
      this.validateChanges = (this.validateControl.statusChanges as Observable<TriSafeAny>)
        .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          if (!this.#disableAutoTips) {
            this.updateAutoErrorTip();
          }
          this.setStatus();
          this.cdr.markForCheck();
        });
    }
  }

  private setStatus(): void {
    this.status = this.getControlStatus(this.validateString);
    this.innerTip = this.getInnerTip(this.status);
    this.formStatusService.formStatusChanges.next({ status: this.status, hasFeedback: this.hasFeedback });
    if (this.formItemComponent) {
      this.formItemComponent.setWithHelpViaTips(!!this.innerTip);
      this.formItemComponent.setStatus(this.status);
    }
  }

  private getControlStatus(validateString: string | null): TriFormControlStatusType {
    let status: TriFormControlStatusType;

    if (validateString === 'warning' || this.validateControlStatus('INVALID', 'warning')) {
      status = 'warning';
    } else if (validateString === 'error' || this.validateControlStatus('INVALID')) {
      status = 'error';
    } else if (
      validateString === 'validating' ||
      validateString === 'pending' ||
      this.validateControlStatus('PENDING')
    ) {
      status = 'validating';
    } else if (validateString === 'success' || this.validateControlStatus('VALID')) {
      status = 'success';
    } else {
      status = '';
    }

    return status;
  }

  private validateControlStatus(validStatus: string, statusType?: TriFormControlStatusType): boolean {
    if (!this.validateControl) {
      return false;
    } else {
      const { dirty, touched, status } = this.validateControl;
      return (
        (!!dirty || !!touched) && (statusType ? this.validateControl.hasError(statusType) : status === validStatus)
      );
    }
  }

  private getInnerTip(
    status: TriFormControlStatusType
  ): string | TemplateRef<{ $implicit: AbstractControl | NgModel }> | null {
    switch (status) {
      case 'error':
        return (!this.#disableAutoTips && this.autoErrorTip) || this.errorTip || null;
      case 'validating':
        return this.validatingTip || null;
      case 'success':
        return this.successTip || null;
      case 'warning':
        return this.warningTip || null;
      default:
        return null;
    }
  }

  private updateAutoErrorTip(): void {
    if (this.validateControl) {
      const errors = this.validateControl.errors || {};
      let autoErrorTip = '';
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          autoErrorTip =
            errors[key]?.[this.localeId] ??
            this.autoTips?.[this.localeId]?.[key] ??
            this.autoTips.default?.[key] ??
            this.formDirective?.autoTips?.[this.localeId]?.[key] ??
            this.formDirective?.autoTips.default?.[key];
        }
        if (autoErrorTip) {
          break;
        }
      }
      this.autoErrorTip = autoErrorTip;
    }
  }

  private subscribeAutoTips(observable?: Observable<TriSafeAny>): void {
    observable?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.#disableAutoTips) {
        this.updateAutoErrorTip();
        this.setStatus();
        this.cdr.markForCheck();
      }
    });
  }

  private formItemComponent = inject(TriFormItemComponent, { host: true, optional: true });
  private formDirective = inject(TriFormDirective, { optional: true });

  constructor() {
    this.subscribeAutoTips(this.i18n.localeChange.pipe(tap(locale => (this.localeId = locale.locale))));
    this.subscribeAutoTips(this.formDirective?.getInputObservable('nzAutoTips'));
    this.subscribeAutoTips(
      this.formDirective
        ?.getInputObservable('nzDisableAutoTips')
        .pipe(filter(() => this.disableAutoTips === undefined))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzDisableAutoTips, nzAutoTips, nzSuccessTip, nzWarningTip, nzErrorTip, nzValidatingTip } = changes;

    if (nzDisableAutoTips || nzAutoTips) {
      this.updateAutoErrorTip();
      this.setStatus();
    } else if (nzSuccessTip || nzWarningTip || nzErrorTip || nzValidatingTip) {
      this.setStatus();
    }
  }

  ngOnInit(): void {
    this.setStatus();
  }

  ngAfterContentInit(): void {
    if (!this.validateControl && !this.validateString) {
      if (this.defaultValidateControl instanceof FormControlDirective) {
        this.validateStatus = this.defaultValidateControl.control;
      } else {
        this.validateStatus = this.defaultValidateControl!;
      }
    }
  }

  protected onAnimationLeave(event: AnimationCallbackEvent): void {
    if (!this.animationEnabled()) {
      return event.animationComplete();
    }

    const element = event.target as HTMLElement;
    const onTransitionEnd = (): void => {
      element.removeEventListener('transitionend', onTransitionEnd);
      event.animationComplete();
    };
    element.addEventListener('transitionend', onTransitionEnd);
  }
}
