/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { AnimationEvent } from '@angular/animations';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  effect,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  viewChildren,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { bufferCount } from 'rxjs/operators';

import { ThumbAnimationProps, thumbMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSizeLDSType, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriSegmentedItemComponent } from './segmented-item.component';
import { TriSegmentedService } from './segmented.service';
import { normalizeOptions, TriSegmentedOption, TriSegmentedOptions } from './types';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'segmented';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triSegmented',
  template: `
    <!-- thumb motion div -->
    <div class="tri-segmented-group">
      @if (animationState) {
        <div
          class="tri-segmented-thumb tri-segmented-thumb-motion"
          [@thumbMotion]="animationState"
          (@thumbMotion.done)="handleThumbAnimationDone($event)"
        ></div>
      }

      <ng-content>
        @for (item of normalizedOptions; track item.value) {
          <label tri-segmented-item [icon]="item.icon" [value]="item.value" [disabled]="item.disabled">
            {{ item.label }}
          </label>
        }
      </ng-content>
    </div>
  `,
  host: {
    class: 'tri-segmented',
    '[class.tri-segmented-disabled]': 'disabled',
    '[class.tri-segmented-rtl]': `dir === 'rtl'`,
    '[class.tri-segmented-lg]': `size === 'large'`,
    '[class.tri-segmented-sm]': `size === 'small'`,
    '[class.tri-segmented-block]': `block`
  },
  providers: [
    TriSegmentedService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriSegmentedComponent),
      multi: true
    }
  ],
  animations: [thumbMotion],
  imports: [TriIconModule, TriOutletModule, TriSegmentedItemComponent]
})
export class TriSegmentedComponent implements OnChanges, ControlValueAccessor {
  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  public readonly configService = inject(TriConfigService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly directionality = inject(Directionality);
  private readonly service = inject(TriSegmentedService);

  @Input({ transform: booleanAttribute }) block: boolean = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() options: TriSegmentedOptions = [];
  @Input() @WithConfig() size: TriSizeLDSType = 'default';

  @Output() readonly valueChange = new EventEmitter<number | string>();

  private viewItemCmps = viewChildren(TriSegmentedItemComponent);
  private contentItemCmps = contentChildren(TriSegmentedItemComponent);
  private isDisabledFirstChange = true;

  protected dir: Direction = 'ltr';
  protected value?: number | string;
  protected animationState: null | { value: string; params: ThumbAnimationProps } = {
    value: 'to',
    params: thumbAnimationParamsOf()
  };
  protected normalizedOptions: TriSegmentedOption[] = [];
  protected onChange: OnChangeType = () => {};
  protected onTouched: OnTouchedType = () => {};

  constructor() {
    this.directionality.change.pipe(takeUntilDestroyed()).subscribe(direction => {
      this.dir = direction;
      this.cdr.markForCheck();
    });

    this.service.selected$.pipe(takeUntilDestroyed()).subscribe(value => {
      this.value = value;
    });

    this.service.change$.pipe(takeUntilDestroyed()).subscribe(value => {
      this.valueChange.emit(value);
      this.onChange(value);
    });

    this.service.activated$.pipe(bufferCount(2, 1), takeUntilDestroyed()).subscribe(elements => {
      this.animationState = {
        value: 'from',
        params: thumbAnimationParamsOf(elements[0])
      };
      this.cdr.detectChanges();

      this.animationState = {
        value: 'to',
        params: thumbAnimationParamsOf(elements[1])
      };
      this.cdr.detectChanges();
    });

    effect(() => {
      const itemCmps = this.viewItemCmps().concat(this.contentItemCmps());

      if (!itemCmps.length) {
        return;
      }

      if (
        this.value === undefined || // If no value is set, select the first item
        !itemCmps.some(item => item.value === this.value) // handle value not in options
      ) {
        this.service.selected$.next(itemCmps[0].value);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOptions, nzDisabled } = changes;
    if (nzOptions) {
      this.normalizedOptions = normalizeOptions(nzOptions.currentValue);
    }
    if (nzDisabled) {
      this.service.disabled$.next(nzDisabled.currentValue);
    }
  }

  handleThumbAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'to') {
      this.animationState = null;
    }
    this.service.animationDone$.next(event);
  }

  writeValue(value: number | string): void {
    this.service.selected$.next(value);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = (this.isDisabledFirstChange && this.disabled) || disabled;
    this.isDisabledFirstChange = false;
  }
}

function thumbAnimationParamsOf(element?: HTMLElement): ThumbAnimationProps {
  return {
    transform: element?.offsetLeft ?? 0,
    width: element?.clientWidth ?? 0
  };
}
