/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriResultNotFoundComponent } from './partial/not-found';
import { TriResultServerErrorComponent } from './partial/server-error.component';
import { TriResultUnauthorizedComponent } from './partial/unauthorized';

export type TriResultIconType = 'success' | 'error' | 'info' | 'warning';
export type TriExceptionStatusType = '404' | '500' | '403';
export type TriResultStatusType = TriExceptionStatusType | TriResultIconType;

const IconMap = {
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
      @if (!isException) {
        @if (icon) {
          <ng-container *stringTemplateOutlet="icon; let icon">
            <tri-icon [type]="icon" theme="fill" />
          </ng-container>
        } @else {
          <ng-content select="[nz-result-icon]"></ng-content>
        }
      } @else {
        @switch (status) {
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
    @if (title) {
      <div class="tri-result-title" *stringTemplateOutlet="title">
        {{ title }}
      </div>
    } @else {
      <ng-content select="div[nz-result-title]"></ng-content>
    }

    @if (subTitle) {
      <div class="tri-result-subtitle" *stringTemplateOutlet="subTitle">
        {{ subTitle }}
      </div>
    } @else {
      <ng-content select="div[nz-result-subtitle]"></ng-content>
    }
    <ng-content select="nz-result-content, [nz-result-content]"></ng-content>
    @if (extra) {
      <div class="tri-result-extra" *stringTemplateOutlet="extra">
        {{ extra }}
      </div>
    } @else {
      <ng-content select="div[nz-result-extra]"></ng-content>
    }
  `,
  host: {
    class: 'tri-result',
    '[class.tri-result-success]': `status === 'success'`,
    '[class.tri-result-error]': `status === 'error'`,
    '[class.tri-result-info]': `status === 'info'`,
    '[class.tri-result-warning]': `status === 'warning'`,
    '[class.tri-result-rtl]': `dir === 'rtl'`
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
export class TriResultComponent implements OnChanges, OnInit {
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @Input() icon?: string | TemplateRef<void>;
  @Input() title?: string | TemplateRef<void>;
  @Input() status: TriResultStatusType = 'info';
  @Input() subTitle?: string | TemplateRef<void>;
  @Input() extra?: string | TemplateRef<void>;

  _icon?: string | TemplateRef<void>;
  isException = false;
  dir: Direction = 'ltr';

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngOnChanges(): void {
    this.setStatusIcon();
  }

  private setStatusIcon(): void {
    const icon = this.icon;

    this.isException = ExceptionStatus.indexOf(this.status) !== -1;
    this._icon = icon
      ? typeof icon === 'string'
        ? IconMap[icon as TriResultIconType] || icon
        : icon
      : this.isException
        ? undefined
        : IconMap[this.status as TriResultIconType];
  }
}
