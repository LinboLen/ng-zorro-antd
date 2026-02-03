/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  Signal,
  TemplateRef
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { TriI18nService, TriQRCodeI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSpinModule } from 'ng-zorro-antd/spin';

import { TriQrcodeCanvasComponent } from './qrcode-canvas.component';
import { createQRCodeData } from './qrcode-data';
import { TriQrcodeSvgComponent } from './qrcode-svg.component';
import { CrossOrigin, ErrorCorrectionLevel, Excavation, ImageSettings, Modules } from './typing';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_FRONT_COLOR, DEFAULT_MINVERSION } from './utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-qrcode',
  exportAs: 'triQRCode',
  template: `
    @if (!!statusRender()) {
      <div class="tri-qrcode-mask">
        <ng-container *stringTemplateOutlet="statusRender()">{{ statusRender() }}</ng-container>
      </div>
    } @else if (status() !== 'active') {
      <div class="tri-qrcode-mask">
        @switch (status()) {
          @case ('loading') {
            <tri-spin />
          }
          @case ('expired') {
            <div>
              <p class="tri-qrcode-expired">{{ locale().expired }}</p>
              <button tri-button type="link" (click)="reloadQRCode()">
                <tri-icon type="reload" theme="outline" />
                <span>{{ locale().refresh }}</span>
              </button>
            </div>
          }
          @case ('scanned') {
            <div>
              <p class="tri-qrcode-expired">{{ locale().scanned }}</p>
            </div>
          }
        }
      </div>
    }

    @if (isBrowser) {
      @switch (type()) {
        @case ('canvas') {
          <tri-qrcode-canvas
            [icon]="icon()"
            [margin]="margin()"
            [cells]="cells()"
            [numCells]="numCells()"
            [calculatedImageSettings]="calculatedImageSettings()"
            [size]="size()"
            [color]="color()"
            [bgColor]="bgColor()"
          />
        }
        @case ('svg') {
          <tri-qrcode-svg
            [color]="color()"
            [bgColor]="bgColor()"
            [icon]="icon()"
            [margin]="margin()"
            [cells]="cells()"
            [numCells]="numCells()"
            [imageSettings]="imageSettings()"
            [calculatedImageSettings]="
              calculatedImageSettings() || { x: 0, y: 0, h: 0, w: 0, excavation: null, opacity: 1, crossOrigin: '' }
            "
            [size]="size()"
          />
        }
      }
    }
  `,
  host: {
    class: 'tri-qrcode',
    '[class.tri-qrcode-border]': `bordered()`,
    '[style.background-color]': `nzBgColor()`
  },
  imports: [
    TriSpinModule,
    TriButtonModule,
    TriIconModule,
    TriStringTemplateOutletDirective,
    TriQrcodeSvgComponent,
    TriQrcodeCanvasComponent
  ]
})
export class TriQRCodeComponent {
  private i18n = inject(TriI18nService);
  locale = toSignal<TriQRCodeI18nInterface>(this.i18n.localeChange.pipe(map(() => this.i18n.getLocaleData('QRCode'))), {
    requireSync: true
  });
  // https://github.com/angular/universal-starter/issues/538#issuecomment-365518693
  // canvas is not supported by the SSR DOM
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly value = input<string | string[]>('');
  readonly type = input<'svg' | 'canvas'>('canvas');
  readonly color = input<string>(DEFAULT_FRONT_COLOR);
  readonly bgColor = input<string>(DEFAULT_BACKGROUND_COLOR);
  readonly size = input<number>(160);
  readonly icon = input<string>('');
  readonly iconSize = input<number>(40);
  readonly bordered = input<boolean>(true);
  readonly status = input<'active' | 'expired' | 'loading' | 'scanned'>('active');
  readonly level = input<ErrorCorrectionLevel>('M');
  readonly statusRender = input<TemplateRef<void> | string | null>(null);
  readonly boostLevel = input<boolean>(true);
  readonly padding = input<number>(0);

  readonly refresh = output<string>();

  margin = signal<number>(0);
  cells = signal<Modules>([]);
  numCells = signal<number>(0);
  calculatedImageSettings = signal<null | {
    x: number;
    y: number;
    h: number;
    w: number;
    excavation: Excavation | null;
    opacity: number;
    crossOrigin: CrossOrigin;
  }>(null);

  protected imageSettings: Signal<ImageSettings> = computed(() => {
    return {
      src: this.icon(),
      x: undefined,
      y: undefined,
      height: this.iconSize() ?? 40,
      width: this.iconSize() ?? 40,
      excavate: true,
      crossOrigin: 'anonymous'
    };
  });

  constructor() {
    effect(() => {
      this.updateQRCodeData();
    });
  }

  reloadQRCode(): void {
    this.updateQRCodeData();
    this.refresh.emit('refresh');
  }

  updateQRCodeData(): void {
    const { margin, cells, numCells, calculatedImageSettings } = createQRCodeData(
      this.value(),
      this.level(),
      DEFAULT_MINVERSION,
      this.size(),
      this.boostLevel(),
      this.padding(),
      this.imageSettings()
    );
    this.margin.set(margin);
    this.cells.set(cells);
    this.numCells.set(numCells);
    this.calculatedImageSettings.set(calculatedImageSettings);
  }
}
