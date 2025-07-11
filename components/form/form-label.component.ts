/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { ThemeType } from '@ant-design/icons-angular';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriTSType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTooltipDirective } from 'ng-zorro-antd/tooltip';

import { DefaultTooltipIcon, TriFormDirective, TriLabelAlignType } from './form.directive';

export interface TriFormTooltipIcon {
  type: TriTSType;
  theme: ThemeType;
}

function toTooltipIcon(value: string | TriFormTooltipIcon): Required<TriFormTooltipIcon> {
  const icon = typeof value === 'string' ? { type: value } : value;
  return { ...DefaultTooltipIcon, ...icon };
}

@Component({
  selector: 'tri-form-label',
  exportAs: 'triFormLabel',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [attr.for]="for" [class.tri-form-item-no-colon]="noColon" [class.tri-form-item-required]="required">
      <ng-content></ng-content>
      @if (tooltipTitle) {
        <span class="tri-form-item-tooltip" tri-tooltip [tooltipTitle]="tooltipTitle">
          <ng-container *stringTemplateOutlet="tooltipIcon.type; let tooltipIconType">
            <tri-icon [type]="tooltipIconType" [theme]="tooltipIcon.theme" />
          </ng-container>
        </span>
      }
    </label>
  `,
  host: {
    class: 'tri-form-item-label',
    '[class.tri-form-item-label-left]': `labelAlign === 'left'`,
    '[class.tri-form-item-label-wrap]': `labelWrap`
  },
  imports: [TriOutletModule, TriTooltipDirective, TriIconModule]
})
export class TriFormLabelComponent {
  private cdr = inject(ChangeDetectorRef);

  @Input() for?: string;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute })
  set noColon(value: boolean) {
    this.#noColon = value;
  }
  get noColon(): boolean {
    return this.#noColon !== 'default' ? this.#noColon : !!this.formDirective?.noColon;
  }

  #noColon: boolean | 'default' = 'default';

  @Input() tooltipTitle?: TriTSType;
  @Input()
  set tooltipIcon(value: string | TriFormTooltipIcon) {
    this._tooltipIcon = toTooltipIcon(value);
  }
  // due to 'get' and 'set' accessor must have the same type, so it was renamed to `tooltipIcon`
  get _tooltipIcon(): TriFormTooltipIcon {
    return this._tooltipIcon !== 'default'
      ? this._tooltipIcon
      : toTooltipIcon(this.formDirective?.tooltipIcon || DefaultTooltipIcon);
  }
  private _tooltipIcon: TriFormTooltipIcon | 'default' = 'default';

  @Input()
  set labelAlign(value: TriLabelAlignType) {
    this.#labelAlign = value;
  }

  get labelAlign(): TriLabelAlignType {
    return this.#labelAlign !== 'default' ? this.#labelAlign : this.formDirective?.labelAlign || 'right';
  }

  #labelAlign: TriLabelAlignType | 'default' = 'default';

  @Input({ transform: booleanAttribute })
  set labelWrap(value: boolean) {
    this.#labelWrap = value;
  }

  get labelWrap(): boolean {
    return this.#labelWrap !== 'default' ? this.#labelWrap : !!this.formDirective?.labelWrap;
  }

  #labelWrap: boolean | 'default' = 'default';

  private formDirective = inject(TriFormDirective, { skipSelf: true, optional: true });

  constructor() {
    if (this.formDirective) {
      this.formDirective
        .getInputObservable('nzNoColon')
        .pipe(
          filter(() => this.#noColon === 'default'),
          takeUntilDestroyed()
        )
        .subscribe(() => this.cdr.markForCheck());

      this.formDirective
        .getInputObservable('nzTooltipIcon')
        .pipe(
          filter(() => this._tooltipIcon === 'default'),
          takeUntilDestroyed()
        )
        .subscribe(() => this.cdr.markForCheck());

      this.formDirective
        .getInputObservable('nzLabelAlign')
        .pipe(
          filter(() => this.#labelAlign === 'default'),
          takeUntilDestroyed()
        )
        .subscribe(() => this.cdr.markForCheck());

      this.formDirective
        .getInputObservable('nzLabelWrap')
        .pipe(
          filter(() => this.#labelWrap === 'default'),
          takeUntilDestroyed()
        )
        .subscribe(() => this.cdr.markForCheck());
    }
  }
}
