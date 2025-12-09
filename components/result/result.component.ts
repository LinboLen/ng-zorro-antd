/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriResultNotFoundComponent } from './partial/not-found';
import { TriResultServerErrorComponent } from './partial/server-error.component';
import { TriResultUnauthorizedComponent } from './partial/unauthorized';

export type TriResultIconType = 'success' | 'error' | 'info' | 'warning';
export type TriExceptionStatusType = '404' | '500' | '403';
export type TriResultStatusType = TriExceptionStatusType | TriResultIconType;

const IconMap: Record<TriResultIconType, string> = {
  success: 'check-circle',
  error: 'close-circle',
  info: 'exclamation-circle',
  warning: 'warning'
};
const ExceptionStatus = ['404', '500', '403'];

@Component({
  selector: 'tri-result',
  exportAs: 'triResult',
  template: `
    <div class="tri-result-icon">
      @if (!isException()) {
        @if (icon()) {
          <ng-container *stringTemplateOutlet="icon(); let icon">
            <tri-icon [type]="icon" theme="fill" />
          </ng-container>
        } @else {
          <ng-content select="[nz-result-icon]">
            <tri-icon [type]="defaultIcon()" theme="fill" />
          </ng-content>
        }
      } @else {
        @switch (status()) {
          @case ('404') {
            <tri-result-not-found />
          }
          @case ('500') {
            <tri-result-server-error />
          }
          @case ('403') {
            <tri-result-unauthorized />
          }
        }
      }
    </div>
    @if (title()) {
      <div class="tri-result-title" *stringTemplateOutlet="title()">
        {{ title() }}
      </div>
    } @else {
      <ng-content select="div[nz-result-title]"></ng-content>
    }

    @if (subTitle()) {
      <div class="tri-result-subtitle" *stringTemplateOutlet="subTitle()">
        {{ subTitle() }}
      </div>
    } @else {
      <ng-content select="div[nz-result-subtitle]"></ng-content>
    }
    <ng-content select="nz-result-content, [nz-result-content]"></ng-content>
    @if (extra()) {
      <div class="tri-result-extra" *stringTemplateOutlet="extra()">
        {{ extra() }}
      </div>
    } @else {
      <ng-content select="div[nz-result-extra]"></ng-content>
    }
  `,
  host: {
    '[class]': 'class()'
  },
  imports: [
    TriOutletModule,
    TriIconModule,
    TriResultNotFoundComponent,
    TriResultServerErrorComponent,
    TriResultUnauthorizedComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriResultComponent {
  private readonly dir = inject(Directionality).valueSignal;

  readonly icon = input<string | TemplateRef<void>>();
  readonly title = input<string | TemplateRef<void>>();
  readonly subTitle = input<string | TemplateRef<void>>();
  readonly extra = input<string | TemplateRef<void>>();
  readonly status = input<TriResultStatusType>('info');

  protected readonly class = computed(() => {
    return {
      'ant-result': true,
      [`ant-result-${this.status()}`]: true,
      'ant-result-rtl': this.dir() === 'rtl'
    };
  });

  readonly isException = computed(() => ExceptionStatus.indexOf(this.status()) !== -1);
  readonly _icon = computed(() => {
    const icon = this.icon();
    return typeof icon === 'string' ? IconMap[icon as TriResultIconType] || icon : icon;
  });
  readonly defaultIcon = computed(() => IconMap[this.status() as TriResultIconType]);
}
