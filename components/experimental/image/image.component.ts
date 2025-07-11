/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { warn } from 'ng-zorro-antd/core/logger';
import { ImagePreloadService, PreloadDisposeHandle } from 'ng-zorro-antd/core/services';
import { TriImageDirective } from 'ng-zorro-antd/image';

import { defaultImageSrcLoader } from './image-loader';
import { TriImageSrcLoader } from './typings';
import { isFixedSize } from './utils';

export const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'imageExperimental';
const sizeBreakpoints = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

@Component({
  selector: 'tri-image',
  exportAs: 'triImage',
  template: `
    <img
      #imageRef
      tri-image
      [src]="src"
      [srcset]="srcset"
      [disablePreview]="disablePreview"
      [fallback]="fallback"
      [placeholder]="placeholder"
      [attr.width]="width"
      [attr.height]="height"
      [attr.srcset]="srcset"
      [attr.alt]="alt || null"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TriImageDirective]
})
export class TriImageViewComponent implements OnInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);
  private imagePreloadService = inject(ImagePreloadService);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() width: string | number = 'auto';
  @Input() height: string | number = 'auto';
  @Input() @WithConfig() srcLoader: TriImageSrcLoader = defaultImageSrcLoader;
  @Input({ transform: booleanAttribute }) @WithConfig() autoSrcset: boolean = false;
  @Input({ transform: booleanAttribute }) priority: boolean = false;
  @Input() @WithConfig() fallback: string | null = null;
  @Input() @WithConfig() placeholder: string | null = null;
  @Input({ transform: booleanAttribute }) @WithConfig() disablePreview: boolean = false;
  @ViewChild('imageRef') imageRef!: ElementRef<HTMLImageElement>;

  _src = '';

  _width: string | number = 'auto';
  _height: string | number = 'auto';
  srcset = '';

  private reloadDisposeHandler: PreloadDisposeHandle = () => void 0;

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => {
      this.composeImageAttrs();
      this.cdr.markForCheck();
    });

    this.destroyRef.onDestroy(() => {
      this.reloadDisposeHandler();
    });
  }

  ngOnInit(): void {
    if (this.priority) {
      this.preload();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzLoader, nzSrc, nzOptimize } = changes;

    if (nzSrc || nzLoader || nzOptimize) {
      this.composeImageAttrs();
    }
  }

  private preload(): void {
    this.reloadDisposeHandler = this.imagePreloadService.addPreload({
      src: this._src,
      srcset: this.srcset
    });
  }

  private optimizable(): boolean {
    if (this.autoSrcset) {
      if (!isFixedSize(this.width) || !isFixedSize(this.height)) {
        warn(
          `When using "nzAutoSrcset" you should use a fixed size width and height, for more information please refer to CLS (https://web.dev/cls/) performance metrics`
        );
        return false;
      }
      if (this.src.endsWith('.svg')) {
        warn(`SVG does not need to be optimized`);
        return false;
      }
      if (this.src.startsWith('data:')) {
        warn(`Data URLs cannot be optimized`);
        return false;
      }
      return true;
    }
    return false;
  }

  private composeImageAttrs(): void {
    const loader = this.getLoader();
    if (!this.optimizable()) {
      this._src = loader({ src: this.src });
      this._width = this.width;
      this._height = this.height;
      return;
    }
    this._width = typeof this.width === 'number' ? this.width : parseInt(this.width, 10);
    this._height = typeof this.height === 'number' ? this.height : parseInt(this.height, 10);
    const widths = this.convertWidths(this._width, sizeBreakpoints);
    this._src = loader({ src: this.src, width: widths[0] });
    this.srcset = widths
      .map(
        (w, i) =>
          `${loader({
            src: this.src,
            width: w
          })} ${i + 1}x`
      )
      .join(', ');
  }

  private getLoader(): TriImageSrcLoader {
    return this.srcLoader || defaultImageSrcLoader;
  }

  private convertWidths(width: number, optimizeSizes: number[]): number[] {
    const allSizes = [...optimizeSizes].sort((a, b) => a - b);
    return [
      ...new Set(
        // 2x scale is sufficient
        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
        [width, width * 2].map(w => allSizes.find(p => p >= w) || w)
      )
    ];
  }
}
