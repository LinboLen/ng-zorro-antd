/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { TriI18nService, TriQRCodeI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSpinModule } from 'ng-zorro-antd/spin';

import { drawCanvas, ERROR_LEVEL_MAP, plotQRCodeData } from './qrcode';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-qrcode',
  exportAs: 'triQRCode',
  template: `
    @if (!!statusRender) {
      <div class="tri-qrcode-mask">
        <ng-container *stringTemplateOutlet="statusRender">{{ statusRender }}</ng-container>
      </div>
    } @else if (status !== 'active') {
      <div class="tri-qrcode-mask">
        @switch (status) {
          @case ('loading') {
            <tri-spin />
          }
          @case ('expired') {
            <div>
              <p class="tri-qrcode-expired">{{ locale.expired }}</p>
              <button tri-button type="link" (click)="reloadQRCode()">
                <tri-icon type="reload" theme="outline" />
                <span>{{ locale.refresh }}</span>
              </button>
            </div>
          }
          @case ('scanned') {
            <div>
              <p class="tri-qrcode-expired">{{ locale.scanned }}</p>
            </div>
          }
        }
      </div>
    }

    @if (isBrowser) {
      <canvas #canvas></canvas>
    }
  `,
  host: {
    class: 'tri-qrcode',
    '[class.tri-qrcode-border]': `bordered`
  },
  imports: [TriSpinModule, TriButtonModule, TriIconModule, TriStringTemplateOutletDirective]
})
export class TriQRCodeComponent implements OnInit, AfterViewInit, OnChanges {
  private i18n = inject(TriI18nService);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  // https://github.com/angular/universal-starter/issues/538#issuecomment-365518693
  // canvas is not supported by the SSR DOM
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input() value: string = '';
  @Input() padding: number | number[] = 0;
  @Input() color: string = '#000000';
  @Input() bgColor: string = '#FFFFFF';
  @Input({ transform: numberAttribute }) size: number = 160;
  @Input() icon: string = '';
  @Input({ transform: numberAttribute }) iconSize: number = 40;
  @Input({ transform: booleanAttribute }) bordered: boolean = true;
  @Input() status: 'active' | 'expired' | 'loading' | 'scanned' = 'active';
  @Input() level: keyof typeof ERROR_LEVEL_MAP = 'M';
  @Input() statusRender?: TemplateRef<void> | string | null = null;

  @Output() readonly refresh = new EventEmitter<string>();

  locale!: TriQRCodeI18nInterface;

  ngOnInit(): void {
    this.el.nativeElement.style.backgroundColor = this.bgColor;
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('QRCode');
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzValue, nzIcon, nzLevel, nzSize, nzIconSize, nzColor, nzPadding, nzBgColor } = changes;
    if ((nzValue || nzIcon || nzLevel || nzSize || nzIconSize || nzColor || nzPadding || nzBgColor) && this.canvas) {
      this.drawCanvasQRCode();
    }

    if (nzBgColor) {
      this.el.nativeElement.style.backgroundColor = this.bgColor;
    }
  }

  ngAfterViewInit(): void {
    this.drawCanvasQRCode();
  }

  reloadQRCode(): void {
    this.drawCanvasQRCode();
    this.refresh.emit('refresh');
  }

  drawCanvasQRCode(): void {
    if (this.canvas) {
      drawCanvas(
        this.canvas.nativeElement,
        plotQRCodeData(this.value, this.level),
        this.size,
        10,
        this.padding,
        this.color,
        this.bgColor,
        this.iconSize,
        this.icon
      );
    }
  }
}
