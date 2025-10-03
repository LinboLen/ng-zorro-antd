/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
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
        @if (addonBefore()) {
          <span class="tri-input-group-addon">
            <ng-content select="[nzInputAddonBefore]" />
          </span>
        }

        @if (hasAffix()) {
          <ng-template [ngTemplateOutlet]="inputWithAffix" />
        } @else {
          <ng-template [ngTemplateOutlet]="input" />
        }

        @if (addonAfter()) {
          <span class="tri-input-group-addon">
            <ng-content select="[nzInputAddonAfter]" />
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
      @if (prefix()) {
        <span class="tri-input-prefix">
          <ng-content select="[nzInputPrefix]" />
        </span>
      }
      <ng-template [ngTemplateOutlet]="input" />
      @if (suffix() || hasFeedback()) {
        <span class="tri-input-suffix">
          <ng-content select="[nzInputSuffix]" />
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
    '[class.tri-input-disabled]': 'disabled()'
  }
})
export class TriInputWrapperComponent {
  private readonly focusMonitor = inject(FocusMonitor);

  private readonly inputDir = contentChild.required(TriInputDirective);
  private readonly inputRef = contentChild.required(TriInputDirective, { read: ElementRef });
  protected readonly prefix = contentChild(TriInputPrefixDirective);
  protected readonly suffix = contentChild(TriInputSuffixDirective);
  protected readonly addonBefore = contentChild(TriInputAddonBeforeDirective);
  protected readonly addonAfter = contentChild(TriInputAddonAfterDirective);

  readonly size = computed(() => this.inputDir().size());
  readonly variant = computed(() => this.inputDir().variant());
  readonly disabled = computed(() => this.inputDir().finalDisabled());
  readonly readOnly = computed(() => this.inputDir().readonly());
  readonly status = computed(() => this.inputDir()._status());
  readonly hasFeedback = computed(() => this.inputDir().hasFeedback());

  protected readonly hasAffix = computed(() => !!this.prefix() || !!this.suffix() || this.hasFeedback());
  protected readonly hasAddon = computed(() => !!this.addonBefore() || !!this.addonAfter());

  private readonly compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  protected readonly dir = inject(Directionality).valueSignal;
  protected readonly focused = signal(false);

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
}
