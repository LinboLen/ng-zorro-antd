/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { slideAlertMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'alert';
export type TriAlertType = 'success' | 'info' | 'warning' | 'error';

@Component({
  selector: 'tri-alert',
  exportAs: 'triAlert',
  animations: [slideAlertMotion],
  imports: [TriIconModule, TriOutletModule],
  template: `
    @if (!closed) {
      <div
        class="tri-alert"
        [class.tri-alert-rtl]="dir === 'rtl'"
        [class.tri-alert-success]="type === 'success'"
        [class.tri-alert-info]="type === 'info'"
        [class.tri-alert-warning]="type === 'warning'"
        [class.tri-alert-error]="type === 'error'"
        [class.tri-alert-no-icon]="!showIcon"
        [class.tri-alert-banner]="banner"
        [class.tri-alert-closable]="closeable"
        [class.tri-alert-with-description]="!!description"
        [@.disabled]="noAnimation"
        [@slideAlertMotion]
        (@slideAlertMotion.done)="onFadeAnimationDone()"
      >
        @if (showIcon) {
          <div class="tri-alert-icon">
            @if (icon) {
              <ng-container *stringTemplateOutlet="icon"></ng-container>
            } @else {
              <tri-icon [type]="iconType || inferredIconType" [theme]="iconTheme" />
            }
          </div>
        }

        @if (message || description) {
          <div class="tri-alert-content">
            @if (message) {
              <span class="tri-alert-message">
                <ng-container *stringTemplateOutlet="message">{{ message }}</ng-container>
              </span>
            }
            @if (description) {
              <span class="tri-alert-description">
                <ng-container *stringTemplateOutlet="description">{{ description }}</ng-container>
              </span>
            }
          </div>
        }

        @if (action) {
          <div class="tri-alert-action">
            <ng-container *stringTemplateOutlet="action">{{ action }}</ng-container>
          </div>
        }

        @if (closeable || closeText) {
          <button type="button" tabindex="0" class="tri-alert-close-icon" (click)="closeAlert()">
            @if (closeText) {
              <ng-container *stringTemplateOutlet="closeText">
                <span class="tri-alert-close-text">{{ closeText }}</span>
              </ng-container>
            } @else {
              <tri-icon type="close" />
            }
          </button>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriAlertComponent implements OnChanges, OnInit {
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input() action: string | TemplateRef<void> | null = null;
  @Input() closeText: string | TemplateRef<void> | null = null;
  @Input() iconType: string | null = null;
  @Input() message: string | TemplateRef<void> | null = null;
  @Input() description: string | TemplateRef<void> | null = null;
  @Input() type: 'success' | 'info' | 'warning' | 'error' = 'info';
  @Input({ transform: booleanAttribute }) @WithConfig() closeable: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() showIcon: boolean = false;
  @Input({ transform: booleanAttribute }) banner = false;
  @Input({ transform: booleanAttribute }) noAnimation = false;
  @Input() icon: string | TemplateRef<void> | null = null;
  @Output() readonly onClose = new EventEmitter<boolean>();
  closed = false;
  iconTheme: 'outline' | 'fill' = 'fill';
  inferredIconType: string = 'info-circle';
  dir: Direction = 'ltr';
  private isTypeSet = false;
  private isShowIconSet = false;

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  closeAlert(): void {
    this.closed = true;
  }

  onFadeAnimationDone(): void {
    if (this.closed) {
      this.onClose.emit(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzShowIcon, nzDescription, nzType, nzBanner } = changes;
    if (nzShowIcon) {
      this.isShowIconSet = true;
    }
    if (nzType) {
      this.isTypeSet = true;
      switch (this.type) {
        case 'error':
          this.inferredIconType = 'close-circle';
          break;
        case 'success':
          this.inferredIconType = 'check-circle';
          break;
        case 'info':
          this.inferredIconType = 'info-circle';
          break;
        case 'warning':
          this.inferredIconType = 'exclamation-circle';
          break;
      }
    }
    if (nzDescription) {
      this.iconTheme = this.description ? 'outline' : 'fill';
    }
    if (nzBanner) {
      if (!this.isTypeSet) {
        this.type = 'warning';
      }
      if (!this.isShowIconSet) {
        this.showIcon = true;
      }
    }
  }
}
