/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector } from '@angular/core';

import { ImageConfig, TriConfigService } from 'ng-zorro-antd/core/config';

import { NZ_CONFIG_MODULE_NAME } from './image-config';
import { TriImage, TriImagePreviewOptions } from './image-preview-options';
import { TriImagePreviewRef } from './image-preview-ref';
import { TriImagePreviewComponent } from './image-preview.component';
import { TriImageScaleStep, TriImageUrl } from './image.directive';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface TriImageService {
  preview(images: TriImage[], option?: TriImagePreviewOptions): TriImagePreviewRef;
}

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class TriImageService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private configService = inject(TriConfigService);
  private directionality = inject(Directionality);

  preview(
    images: TriImage[],
    options?: TriImagePreviewOptions,
    zoomMap?: Map<TriImageUrl, TriImageScaleStep>
  ): TriImagePreviewRef {
    return this.display(images, options, zoomMap);
  }

  private display(
    images: TriImage[],
    config?: TriImagePreviewOptions,
    scaleStepMap?: Map<TriImageUrl, TriImageScaleStep>
  ): TriImagePreviewRef {
    const configMerged = { ...new TriImagePreviewOptions(), ...(config ?? {}) };
    const overlayRef = this.createOverlay(configMerged);
    const previewComponent = this.attachPreviewComponent(overlayRef, configMerged);
    previewComponent.setImages(images, scaleStepMap);
    const previewRef = new TriImagePreviewRef(previewComponent, configMerged, overlayRef);

    previewComponent.previewRef = previewRef;
    return previewRef;
  }

  private attachPreviewComponent(overlayRef: OverlayRef, config: TriImagePreviewOptions): TriImagePreviewComponent {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: TriImagePreviewOptions, useValue: config }
      ]
    });

    const containerPortal = new ComponentPortal(TriImagePreviewComponent, null, injector);
    const containerRef = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createOverlay(config: TriImagePreviewOptions): OverlayRef {
    const globalConfig = (this.configService.getConfigForComponent(NZ_CONFIG_MODULE_NAME) as ImageConfig) || {};
    const overLayConfig = new OverlayConfig({
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global(),
      disposeOnNavigation: config.closeOnNavigation ?? globalConfig.nzCloseOnNavigation ?? true,
      direction: config.direction || globalConfig.nzDirection || this.directionality.value
    });

    return this.overlay.create(overLayConfig);
  }
}
