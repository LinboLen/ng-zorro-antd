/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSizeDSType, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriWaveModule } from 'ng-zorro-antd/core/wave';
import { TriIconModule } from 'ng-zorro-antd/icon';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'switch';

@Component({
  selector: '',
  exportAs: 'triSwitch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriSwitchComponent),
      multi: true
    }
  ],
  template: `
    <button
      tri-wave
      type="button"
      class="tri-switch"
      #switchElement
      [attr.id]="id"
      [disabled]="disabled"
      [class.tri-switch-checked]="isChecked"
      [class.tri-switch-loading]="loading"
      [class.tri-switch-disabled]="disabled"
      [class.tri-switch-small]="size === 'small'"
      [class.tri-switch-rtl]="dir === 'rtl'"
      [waveExtraNode]="true"
    >
      <span class="tri-switch-handle">
        @if (loading) {
          <tri-icon type="loading" class="tri-switch-loading-icon" />
        }
      </span>
      <span class="tri-switch-inner">
        @if (isChecked) {
          <ng-container *stringTemplateOutlet="checkedChildren">{{ checkedChildren }}</ng-container>
        } @else {
          <ng-container *stringTemplateOutlet="unCheckedChildren">{{ unCheckedChildren }}</ng-container>
        }
      </span>
      <div class="tri-click-animating-node"></div>
    </button>
  `,
  imports: [TriWaveModule, TriIconModule, TriOutletModule]
})
export class TriSwitchComponent implements ControlValueAccessor, AfterViewInit, OnInit {
  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  configService = inject(TriConfigService);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private focusMonitor = inject(FocusMonitor);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  isChecked = false;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @ViewChild('switchElement', { static: true }) switchElement!: ElementRef<HTMLElement>;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) control = false;
  @Input() checkedChildren: string | TemplateRef<void> | null = null;
  @Input() unCheckedChildren: string | TemplateRef<void> | null = null;
  @Input() @WithConfig() size: TriSizeDSType = 'default';
  @Input() id: string | null = null;

  dir: Direction = 'ltr';

  private isNzDisableFirstChange = true;

  updateValue(value: boolean): void {
    if (this.isChecked !== value) {
      this.isChecked = value;
      this.onChange(this.isChecked);
    }
  }

  focus(): void {
    this.focusMonitor.focusVia(this.switchElement.nativeElement, 'keyboard');
  }

  blur(): void {
    this.switchElement.nativeElement.blur();
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.switchElement!.nativeElement);
    });
  }

  ngOnInit(): void {
    this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;

    fromEventOutsideAngular(this.el, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        event.preventDefault();

        if (this.control || this.disabled || this.loading) {
          return;
        }

        this.ngZone.run(() => {
          this.updateValue(!this.isChecked);
          this.cdr.markForCheck();
        });
      });

    fromEventOutsideAngular<KeyboardEvent>(this.switchElement.nativeElement, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (this.control || this.disabled || this.loading) {
          return;
        }

        const { keyCode } = event;
        if (keyCode !== LEFT_ARROW && keyCode !== RIGHT_ARROW && keyCode !== SPACE && keyCode !== ENTER) {
          return;
        }

        event.preventDefault();

        this.ngZone.run(() => {
          if (keyCode === LEFT_ARROW) {
            this.updateValue(false);
          } else if (keyCode === RIGHT_ARROW) {
            this.updateValue(true);
          } else if (keyCode === SPACE || keyCode === ENTER) {
            this.updateValue(!this.isChecked);
          }

          this.cdr.markForCheck();
        });
      });
  }

  ngAfterViewInit(): void {
    this.focusMonitor
      .monitor(this.switchElement!.nativeElement, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          /** https://github.com/angular/angular/issues/17793 **/
          Promise.resolve().then(() => this.onTouched());
        }
      });
  }

  writeValue(value: boolean): void {
    this.isChecked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || disabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }
}
