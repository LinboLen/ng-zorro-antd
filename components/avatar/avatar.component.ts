/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  afterEveryRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  numberAttribute,
  OnChanges,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriConfigKey, WithConfig } from 'ng-zorro-antd/core/config';
import { TriShapeSCType, TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { toCssPixel } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'avatar';

/** https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-loading */
type TriAvatarLoading = 'eager' | 'lazy';

/** https://wicg.github.io/priority-hints/#idl-index */
type TriAvatarFetchPriority = 'high' | 'low' | 'auto';

@Component({
  selector: 'tri-avatar',
  exportAs: 'triAvatar',
  imports: [TriIconModule],
  template: `
    @if (icon && hasIcon) {
      <tri-icon [type]="icon" />
    } @else if (src && hasSrc) {
      <img
        [src]="src"
        [attr.srcset]="srcSet"
        [attr.alt]="alt"
        [attr.loading]="loading() || 'eager'"
        [attr.fetchpriority]="fetchPriority() || 'auto'"
        (error)="imgError($event)"
      />
    } @else if (text && hasText) {
      <span class="tri-avatar-string" #textEl>{{ text }}</span>
    }
    <ng-content />
  `,
  host: {
    class: 'tri-avatar',
    '[class.tri-avatar-lg]': `size === 'large'`,
    '[class.tri-avatar-sm]': `size === 'small'`,
    '[class.tri-avatar-square]': `shape === 'square'`,
    '[class.tri-avatar-circle]': `shape === 'circle'`,
    '[class.tri-avatar-icon]': `icon`,
    '[class.tri-avatar-image]': `hasSrc`,
    '[style.width]': 'customSize',
    '[style.height]': 'customSize',
    '[style.line-height]': 'customSize',
    // nzSize type is number when customSize is true
    '[style.font-size.px]': '(hasIcon && customSize) ? $any(nzSize) / 2 : null'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriAvatarComponent implements OnChanges {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;
  @Input() @WithConfig() shape: TriShapeSCType = 'circle';
  @Input() @WithConfig() size: TriSizeLDSType | number = 'default';
  @Input({ transform: numberAttribute }) @WithConfig() gap = 4;
  @Input() text?: string;
  @Input() src?: string;
  @Input() srcSet?: string;
  @Input() alt?: string;
  @Input() icon?: string;
  readonly loading = input<TriAvatarLoading>();
  readonly fetchPriority = input<TriAvatarFetchPriority>();
  @Output() readonly error = new EventEmitter<Event>();

  hasText: boolean = false;
  hasSrc: boolean = true;
  hasIcon: boolean = false;
  customSize: string | null = null;

  @ViewChild('textEl', { static: false }) textEl?: ElementRef<HTMLSpanElement>;

  private el: HTMLElement = inject(ElementRef).nativeElement;
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    afterEveryRender(() => this.calcStringSize());
  }

  imgError(event: Event): void {
    this.error.emit(event);
    if (!event.defaultPrevented) {
      this.hasSrc = false;
      this.hasIcon = false;
      this.hasText = false;
      if (this.icon) {
        this.hasIcon = true;
      } else if (this.text) {
        this.hasText = true;
      }
      this.cdr.detectChanges();
      this.setSizeStyle();
      this.calcStringSize();
    }
  }

  ngOnChanges(): void {
    this.hasText = !this.src && !!this.text;
    this.hasIcon = !this.src && !!this.icon;
    this.hasSrc = !!this.src;

    this.setSizeStyle();
    this.calcStringSize();
  }

  private calcStringSize(): void {
    if (!this.hasText || !this.textEl) {
      return;
    }

    const textEl = this.textEl.nativeElement;
    const childrenWidth = textEl.offsetWidth;
    const avatarWidth = this.el.getBoundingClientRect?.().width ?? 0;
    const offset = this.gap * 2 < avatarWidth ? this.gap * 2 : 8;
    const scale = avatarWidth - offset < childrenWidth ? (avatarWidth - offset) / childrenWidth : 1;

    textEl.style.transform = `scale(${scale}) translateX(-50%)`;
    textEl.style.lineHeight = this.customSize || '';
  }

  private setSizeStyle(): void {
    if (typeof this.size === 'number') {
      this.customSize = toCssPixel(this.size);
    } else {
      this.customSize = null;
    }

    this.cdr.markForCheck();
  }
}
