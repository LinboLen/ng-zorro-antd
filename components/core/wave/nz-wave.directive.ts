/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import {
  CSP_NONCE,
  Directive,
  ElementRef,
  EnvironmentProviders,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  makeEnvironmentProviders
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

import { TriWaveRenderer } from './nz-wave-renderer';

export interface TriWaveConfig {
  disabled?: boolean;
}

export const TRI_WAVE_GLOBAL_DEFAULT_CONFIG: TriWaveConfig = {
  disabled: false
};

export const TRI_WAVE_GLOBAL_CONFIG = new InjectionToken<TriWaveConfig>('nz-wave-global-options');

export function provideNzWave(config: TriWaveConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: TRI_WAVE_GLOBAL_CONFIG, useValue: config }]);
}

@Directive({
  selector: '[tri-wave],button[nz-button]:not([nzType="link"]):not([nzType="text"])',
  exportAs: 'triWave'
})
export class TriWaveDirective implements OnInit, OnDestroy {
  @Input() waveExtraNode = false;

  private waveRenderer?: TriWaveRenderer;
  private waveDisabled: boolean = false;

  get disabled(): boolean {
    return this.waveDisabled;
  }

  get rendererRef(): TriWaveRenderer | undefined {
    return this.waveRenderer;
  }

  private cspNonce = inject(CSP_NONCE, { optional: true });
  private platform = inject(Platform);
  private config = inject(TRI_WAVE_GLOBAL_CONFIG, { optional: true });
  private animationType = inject(ANIMATION_MODULE_TYPE, { optional: true });
  private ngZone = inject(NgZone);
  private elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    this.waveDisabled = this.isConfigDisabled();
  }

  isConfigDisabled(): boolean {
    let disabled = false;
    if (this.config && typeof this.config.disabled === 'boolean') {
      disabled = this.config.disabled;
    }
    if (this.animationType === 'NoopAnimations') {
      disabled = true;
    }
    return disabled;
  }

  ngOnDestroy(): void {
    if (this.waveRenderer) {
      this.waveRenderer.destroy();
    }
  }

  ngOnInit(): void {
    this.renderWaveIfEnabled();
  }

  renderWaveIfEnabled(): void {
    if (!this.waveDisabled && this.elementRef.nativeElement) {
      this.waveRenderer = new TriWaveRenderer(
        this.elementRef.nativeElement,
        this.ngZone,
        this.waveExtraNode,
        this.platform,
        this.cspNonce
      );
    }
  }

  disable(): void {
    this.waveDisabled = true;
    if (this.waveRenderer) {
      this.waveRenderer.removeTriggerEvent();
      this.waveRenderer.removeStyleAndExtraNode();
    }
  }

  enable(): void {
    // config priority
    this.waveDisabled = this.isConfigDisabled() || false;
    if (this.waveRenderer) {
      this.waveRenderer.bindTriggerEvent();
    }
  }
}
