/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriFormItemFeedbackIconComponent } from 'ng-zorro-antd/core/form';
import { getStatusClassNames, getVariantClassNames } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriInputAddonAfterDirective, TriInputAddonBeforeDirective } from './input-addon.directive';
import { TriInputPrefixDirective, TriInputSuffixDirective } from './input-affix.directive';
import { TriInputDirective } from './input.directive';
import { TRI_INPUT_WRAPPER } from './tokens';

@Component({
  selector: 'tri-input-wrapper',
  exportAs: 'triInputWrapper',
  imports: [TriIconModule, TriFormItemFeedbackIconComponent, NgTemplateOutlet],
  template: `
    @if (hasAddon()) {
      <ng-template [ngTemplateOutlet]="inputWithAddonInner" />
    } @else if (hasAffix()) {
      <ng-template [ngTemplateOutlet]="inputWithAffixInner" />
    } @else {
      <ng-template [ngTemplateOutlet]="input" />
    }

    <ng-template #inputWithAddonInner>
      <span class="tri-input-wrapper tri-input-group">
        @if (hasAddonBefore()) {
          <span class="tri-input-group-addon">
            <ng-content select="[nzInputAddonBefore]">{{ addonBefore() }}</ng-content>
          </span>
        }

        @if (hasAffix()) {
          <ng-template [ngTemplateOutlet]="inputWithAffix" />
        } @else {
          <ng-template [ngTemplateOutlet]="input" />
        }

        @if (hasAddonAfter()) {
          <span class="tri-input-group-addon">
            <ng-content select="[nzInputAddonAfter]">{{ addonAfter() }}</ng-content>
          </span>
        }
      </span>
    </ng-template>

    <ng-template #inputWithAffix>
      <span [class]="affixWrapperClass()">
        <ng-template [ngTemplateOutlet]="inputWithAffixInner" />
      </span>
    </ng-template>

    <ng-template #inputWithAffixInner>
      @if (hasPrefix()) {
        <span class="tri-input-prefix">
          <ng-content select="[nzInputPrefix]">{{ prefix() }}</ng-content>
        </span>
      }
      <ng-template [ngTemplateOutlet]="input" />
      @if (hasSuffix()) {
        <span class="tri-input-suffix">
          @if (allowClear()) {
            <span
              class="tri-input-clear-icon"
              [class.tri-input-clear-icon-has-suffix]="suffix() || suffix() || hasFeedback()"
              [class.tri-input-clear-icon-hidden]="!inputDir().value() || disabled() || readOnly()"
              role="button"
              tabindex="-1"
              (click)="clear()"
            >
              <ng-content select="[nzInputClearIcon]">
                <tri-icon type="close-circle" theme="fill" />
              </ng-content>
            </span>
          }
          <ng-content select="[nzInputSuffix]">{{ suffix() }}</ng-content>
          @if (hasFeedback() && status()) {
            <tri-form-item-feedback-icon [status]="status()" />
          }
        </span>
      }
    </ng-template>

    <ng-template #input>
      <ng-content select="[nz-input]" />
    </ng-template>
  `,
  providers: [
    { provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'input' },
    { provide: TRI_INPUT_WRAPPER, useExisting: forwardRef(() => TriInputWrapperComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [TriSpaceCompactItemDirective],
  host: {
    '[class]': 'class()',
    '[class.tri-input-disabled]': 'disabled()',
    '[class.tri-input-affix-wrapper-textarea-with-clear-btn]': 'allowClear() && isTextarea()'
  }
})
export class TriInputWrapperComponent {
  private readonly focusMonitor = inject(FocusMonitor);

  protected readonly inputRef = contentChild.required(TriInputDirective, { read: ElementRef });
  protected readonly inputDir = contentChild.required(TriInputDirective);

  protected readonly _prefix = contentChild(TriInputPrefixDirective);
  protected readonly _suffix = contentChild(TriInputSuffixDirective);
  protected readonly _addonBefore = contentChild(TriInputAddonBeforeDirective);
  protected readonly _addonAfter = contentChild(TriInputAddonAfterDirective);

  readonly allowClear = input(false, { transform: booleanAttribute });
  readonly prefix = input<string>();
  readonly suffix = input<string>();
  readonly addonBefore = input<string>();
  readonly addonAfter = input<string>();

  readonly clear = output<void>();

  readonly size = computed(() => this.inputDir().size());
  readonly variant = computed(() => this.inputDir().variant());
  readonly disabled = computed(() => this.inputDir().finalDisabled());
  readonly readOnly = computed(() => this.inputDir().readonly());
  readonly status = computed(() => this.inputDir()._status());
  readonly hasFeedback = computed(() => this.inputDir().hasFeedback());

  protected readonly hasPrefix = computed(() => !!this.prefix() || !!this._prefix());
  protected readonly hasSuffix = computed(
    () => !!this.suffix() || !!this._suffix() || this.allowClear() || this.hasFeedback()
  );
  protected readonly hasAffix = computed(() => this.hasPrefix() || this.hasSuffix());
  protected readonly hasAddonBefore = computed(() => !!this.addonBefore() || !!this._addonBefore());
  protected readonly hasAddonAfter = computed(() => !!this.addonAfter() || !!this._addonAfter());
  protected readonly hasAddon = computed(() => this.hasAddonBefore() || this.hasAddonAfter());

  private readonly compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  protected readonly dir = inject(Directionality).valueSignal;
  protected readonly focused = signal(false);
  protected readonly isTextarea = computed(() => this.inputRef().nativeElement instanceof HTMLTextAreaElement);

  protected readonly finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.size();
  });

  protected readonly class = computed(() => {
    if (this.hasAddon()) {
      return this.groupWrapperClass();
    }
    if (this.hasAffix()) {
      return this.affixWrapperClass();
    }
    return null;
  });
  protected readonly affixWrapperClass = computed(() => {
    return {
      'ant-input-affix-wrapper': true,
      'ant-input-affix-wrapper-lg': this.finalSize() === 'large',
      'ant-input-affix-wrapper-sm': this.finalSize() === 'small',
      'ant-input-affix-wrapper-disabled': this.disabled(),
      'ant-input-affix-wrapper-readonly': this.readOnly(),
      'ant-input-affix-wrapper-focused': this.focused(),
      'ant-input-affix-wrapper-rtl': this.dir() === 'rtl',
      ...getStatusClassNames('ant-input-affix-wrapper', this.status(), this.hasFeedback()),
      ...getVariantClassNames('ant-input-affix-wrapper', this.variant())
    };
  });
  protected readonly groupWrapperClass = computed(() => {
    return {
      'ant-input-group-wrapper': true,
      'ant-input-group-wrapper-sm': this.finalSize() === 'small',
      'ant-input-group-wrapper-lg': this.finalSize() === 'large',
      'ant-input-group-wrapper-rtl': this.dir() === 'rtl',
      ...getStatusClassNames('ant-input-group-wrapper', this.status(), this.hasFeedback()),
      ...getVariantClassNames('ant-input-group-wrapper', this.variant())
    };
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const element = this.inputRef();
      this.focusMonitor
        .monitor(element)
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(origin => {
          this.focused.set(!!origin);
        });

      destroyRef.onDestroy(() => {
        this.focusMonitor.stopMonitoring(element);
      });
    });
  }

  _clear(): void {
    this.inputDir().ngControl?.control?.setValue('');
    this.clear.emit();
  }
}
