/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  DestroyRef,
  Directive,
  inject,
  Input,
  input,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ThemeType } from '@ant-design/icons-angular';

import { TriConfigKey, WithConfig } from 'ng-zorro-antd/core/config';
import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import { InputObservable, type TriSizeLDSType } from 'ng-zorro-antd/core/types';

import type { TriRequiredMark } from './types';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'form';

export type TriFormLayoutType = 'horizontal' | 'vertical' | 'inline';

export type TriLabelAlignType = 'left' | 'right';

export const DefaultTooltipIcon = {
  type: 'question-circle',
  theme: 'outline'
} as const;

@Directive({
  selector: '[tri-form]',
  exportAs: 'triForm',
  host: {
    class: 'tri-form',
    '[class.tri-form-horizontal]': `layout === 'horizontal'`,
    '[class.tri-form-vertical]': `layout === 'vertical'`,
    '[class.tri-form-inline]': `layout === 'inline'`,
    '[class.tri-form-rtl]': `dir() === 'rtl'`,
    '[class.tri-form-small]': `size() === 'small'`,
    '[class.tri-form-large]': `size() === 'large'`
  },
  providers: [{ provide: TRI_FORM_SIZE, useFactory: () => inject(TriFormDirective).size }]
})
export class TriFormDirective implements OnChanges, InputObservable {
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input() layout: TriFormLayoutType = 'horizontal';
  @Input({ transform: booleanAttribute }) @WithConfig() noColon: boolean = false;
  @Input() @WithConfig() autoTips: Record<string, Record<string, string>> = {};
  @Input({ transform: booleanAttribute }) disableAutoTips = false;
  @Input() @WithConfig() tooltipIcon: string | { type: string; theme: ThemeType } = DefaultTooltipIcon;
  @Input() labelAlign: TriLabelAlignType = 'right';
  @Input({ transform: booleanAttribute }) @WithConfig() labelWrap: boolean = false;

  readonly size = input<TriSizeLDSType>();

  readonly requiredMark = input<TriRequiredMark>(true);

  dir = inject(Directionality).valueSignal;
  private inputChanges$ = new Subject<SimpleChanges>();

  getInputObservable<K extends keyof this>(changeType: K): Observable<SimpleChange> {
    return this.inputChanges$.pipe(
      filter(changes => changeType in changes),
      map(value => value[changeType as string])
    );
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.inputChanges$.complete();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inputChanges$.next(changes);
  }
}
