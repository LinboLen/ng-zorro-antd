/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  Directive,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  booleanAttribute,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ThemeType } from '@ant-design/icons-angular';

import { TriConfigKey, WithConfig } from 'ng-zorro-antd/core/config';
import { InputObservable } from 'ng-zorro-antd/core/types';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'form';

export type TriFormLayoutType = 'horizontal' | 'vertical' | 'inline';

export type TriLabelAlignType = 'left' | 'right';

export const DefaultTooltipIcon = {
  type: 'question-circle',
  theme: 'outline'
} as const;

@Directive({
  selector: '',
  exportAs: 'triForm',
  host: {
    class: 'tri-form',
    '[class.tri-form-horizontal]': `layout === 'horizontal'`,
    '[class.tri-form-vertical]': `layout === 'vertical'`,
    '[class.tri-form-inline]': `layout === 'inline'`,
    '[class.tri-form-rtl]': `dir === 'rtl'`
  }
})
export class TriFormDirective implements OnChanges, InputObservable {
  private destroyRef = inject(DestroyRef);
  private directionality = inject(Directionality);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input() layout: TriFormLayoutType = 'horizontal';
  @Input({ transform: booleanAttribute }) @WithConfig() noColon: boolean = false;
  @Input() @WithConfig() autoTips: Record<string, Record<string, string>> = {};
  @Input({ transform: booleanAttribute }) disableAutoTips = false;
  @Input() @WithConfig() tooltipIcon: string | { type: string; theme: ThemeType } = DefaultTooltipIcon;
  @Input() labelAlign: TriLabelAlignType = 'right';
  @Input({ transform: booleanAttribute }) @WithConfig() labelWrap: boolean = false;

  dir: Direction = 'ltr';
  private inputChanges$ = new Subject<SimpleChanges>();

  getInputObservable<K extends keyof this>(changeType: K): Observable<SimpleChange> {
    return this.inputChanges$.pipe(
      filter(changes => changeType in changes),
      map(value => value[changeType as string])
    );
  }

  constructor() {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed()).subscribe(direction => {
      this.dir = direction;
    });
    this.destroyRef.onDestroy(() => {
      this.inputChanges$.complete();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inputChanges$.next(changes);
  }
}
