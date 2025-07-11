/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  AsyncValidator,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, of } from 'rxjs';

import { CronExpression, parseExpression } from 'cron-parser';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriCronExpressionI18nInterface, TriI18nService } from 'ng-zorro-antd/i18n';

import { TriCronExpressionInputComponent } from './cron-expression-input.component';
import { TriCronExpressionLabelComponent } from './cron-expression-label.component';
import { TriCronExpressionPreviewComponent } from './cron-expression-preview.component';
import { Cron, CronChangeType, CronValue, TriCronExpressionSize, TriCronExpressionType, TimeType } from './typings';

function labelsOfType(type: TriCronExpressionType): TimeType[] {
  if (type === 'spring') {
    return ['second', 'minute', 'hour', 'day', 'month', 'week'];
  }
  return ['minute', 'hour', 'day', 'month', 'week'];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-cron-expression',
  exportAs: 'triCronExpression',
  template: `
    <div class="tri-cron-expression">
      <div class="tri-cron-expression-content">
        <div
          class="tri-input tri-cron-expression-input-group"
          [class.tri-input-lg]="size === 'large'"
          [class.tri-input-sm]="size === 'small'"
          [class.tri-input-borderless]="borderless"
          [class.tri-cron-expression-input-group-focus]="focus && !borderless"
          [class.tri-input-status-error]="!validateForm.valid && !borderless"
          [class.tri-cron-expression-input-group-error-focus]="!validateForm.valid && focus && !borderless"
          [class.tri-input-disabled]="disabled"
        >
          @for (label of labels; track label) {
            <tri-cron-expression-input
              [value]="this.validateForm.controls[label].value"
              [label]="label"
              [disabled]="disabled"
              (focusEffect)="focusEffect($event)"
              (blurEffect)="blurEffect()"
              (getValue)="getValue($event)"
            />
          }
        </div>
        <div
          class="tri-cron-expression-label-group"
          [class.tri-input-lg]="size === 'large'"
          [class.tri-cron-expression-label-group-default]="size === 'default'"
          [class.tri-input-sm]="size === 'small'"
        >
          @for (label of labels; track label) {
            <tri-cron-expression-label [type]="label" [labelFocus]="labelFocus" [locale]="locale" />
          }
        </div>
        @if (!collapseDisable) {
          <tri-cron-expression-preview
            [TimeList]="nextTimeList"
            [visible]="validateForm.valid"
            [locale]="locale"
            [semantic]="semantic"
            (loadMorePreview)="loadMorePreview()"
          />
        }
      </div>
      @if (extra) {
        <div class="tri-cron-expression-map">
          <ng-template [ngTemplateOutlet]="extra" />
        </div>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => TriCronExpressionComponent),
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriCronExpressionComponent),
      multi: true
    }
  ],
  imports: [
    TriCronExpressionInputComponent,
    TriCronExpressionLabelComponent,
    TriCronExpressionPreviewComponent,
    NgTemplateOutlet
  ]
})
export class TriCronExpressionComponent implements OnInit, OnChanges, ControlValueAccessor, AsyncValidator {
  private formBuilder = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private i18n = inject(TriI18nService);
  private destroyRef = inject(DestroyRef);

  @Input() size: TriCronExpressionSize = 'default';
  @Input() type: TriCronExpressionType = 'linux';
  @Input({ transform: booleanAttribute }) collapseDisable: boolean = false;
  @Input() extra?: TemplateRef<void> | null = null;
  @Input() semantic: TemplateRef<void> | null = null;
  @Input({ transform: booleanAttribute }) borderless = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  locale!: TriCronExpressionI18nInterface;
  focus: boolean = false;
  labelFocus: TimeType | null = null;
  labels: TimeType[] = labelsOfType(this.type);
  interval!: CronExpression<false>;
  nextTimeList: Date[] = [];
  private isNzDisableFirstChange: boolean = true;

  validateForm: FormGroup<Record<TimeType, FormControl<CronValue>>>;

  onChange: TriSafeAny = () => {};
  onTouch: () => void = () => null;

  convertFormat(value: string): void {
    const values = value.split(' ');
    const valueObject = this.labels.reduce((obj, label, idx) => {
      obj[label] = values[idx];
      return obj;
    }, {} as Cron);
    this.validateForm.patchValue(valueObject);
  }

  writeValue(value: string | null): void {
    if (value) {
      this.convertFormat(value);
    }
  }

  registerOnChange(fn: TriSafeAny): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: TriSafeAny): void {
    this.onTouch = fn;
  }

  validate(): Observable<ValidationErrors | null> {
    if (this.validateForm.valid) {
      return of(null);
    } else {
      return of({ error: true });
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }

  constructor() {
    this.validateForm = this.formBuilder.nonNullable.group(
      {
        second: ['0', Validators.required],
        minute: ['*', Validators.required],
        hour: ['*', Validators.required],
        day: ['*', Validators.required],
        month: ['*', Validators.required],
        week: ['*', Validators.required]
      },
      { validators: this.checkValid }
    );
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('CronExpression');
      this.cdr.markForCheck();
    });
    this.cronFormType();
    this.previewDate(this.validateForm.value);

    this.validateForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.onChange(Object.values(value).join(' '));
      this.previewDate(value);
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzType } = changes;

    if (nzType) {
      this.labels = labelsOfType(this.type);
      this.cronFormType();
    }
  }

  cronFormType(): void {
    if (this.type === 'spring') {
      this.validateForm.controls.second.enable();
    } else {
      this.validateForm.controls.second.disable();
    }
  }

  previewDate(value: Cron): void {
    try {
      this.interval = parseExpression(Object.values(value).join(' '));
      this.nextTimeList = [
        this.interval.next().toDate(),
        this.interval.next().toDate(),
        this.interval.next().toDate(),
        this.interval.next().toDate(),
        this.interval.next().toDate()
      ];
    } catch {
      return;
    }
  }

  loadMorePreview(): void {
    this.nextTimeList = [
      ...this.nextTimeList,
      this.interval.next().toDate(),
      this.interval.next().toDate(),
      this.interval.next().toDate(),
      this.interval.next().toDate(),
      this.interval.next().toDate()
    ];
    this.cdr.markForCheck();
  }

  focusEffect(value: TimeType): void {
    this.focus = true;
    this.labelFocus = value;
    this.cdr.markForCheck();
  }

  blurEffect(): void {
    this.focus = false;
    this.labelFocus = null;
    this.cdr.markForCheck();
  }

  getValue(item: CronChangeType): void {
    this.validateForm.controls[item.label].patchValue(item.value);
    this.cdr.markForCheck();
  }

  checkValid: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      try {
        const cron: string[] = [];
        this.labels.forEach(label => cron.push(control.value[label]));
        parseExpression(cron.join(' '));
      } catch {
        return { error: true };
      }
    }
    return null;
  };
}
