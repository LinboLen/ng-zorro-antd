/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ApplicationRef, Component, DebugElement, destroyPlatform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { bootstrapApplication, By } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { vi } from 'vitest';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { FontType } from './typings';
import { TriWatermarkComponent } from './watermark.component';
import { TriWatermarkModule } from './watermark.module';

describe('watermark', () => {
  let fixture: ComponentFixture<TriTestWatermarkBasicComponent>;
  let testComponent: TriTestWatermarkBasicComponent;
  let resultEl: DebugElement;
  let mockSrcSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Keep the Image.prototype.src spy per spec. A beforeAll spy leaks into
    // later browser specs and can call a destroyed watermark instance.
    mockSrcSpy = vi.spyOn(Image.prototype, 'src', 'set');
    fixture = TestBed.createComponent(TriTestWatermarkBasicComponent);
    testComponent = fixture.debugElement.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriWatermarkComponent));
    mockSrcSpy.mockImplementation(() => {
      resultEl.componentInstance['onImageLoad']?.();
    });
  });

  afterEach(() => {
    mockSrcSpy.mockRestore();
  });

  it('basic', async () => {
    testComponent.content.set('NG Ant Design');
    fixture.detectChanges();
    await fixture.whenStable();
    const view = resultEl.nativeElement.querySelector('.watermark > div');
    expect(view).toBeTruthy();
    expect(view.tagName).toBe('DIV');
  });

  it('image', async () => {
    testComponent.image.set(
      'https://img.alicdn.com/imgextra/i3/O1CN01UR3Zkq1va9fnZsZcr_!!6000000006188-55-tps-424-64.svg'
    );
    fixture.detectChanges();
    await fixture.whenStable();
    const view = resultEl.nativeElement.querySelector('.watermark > div');
    expect(view).toBeTruthy();
    expect(view.tagName).toBe('DIV');
  });

  it('invalid image', async () => {
    mockSrcSpy.mockImplementation(() => {
      resultEl.componentInstance['onImageError']?.();
    });
    testComponent.image.set('https://img.alicdn.com/test.svg');
    fixture.detectChanges();
    await fixture.whenStable();
    const view = resultEl.nativeElement.querySelector('.watermark > div');
    expect(view).toBeTruthy();
    expect(view.tagName).toBe('DIV');
  });

  it('should offset work', async () => {
    testComponent.content.set(['Angular', 'NG Ant Design']);
    testComponent.offset.set([200, 200]);
    fixture.detectChanges();
    await fixture.whenStable();

    const view = resultEl.nativeElement.querySelector('.watermark > div');
    expect(view?.style.left).toBe('150px');
    expect(view?.style.top).toBe('150px');
    expect(view?.style.width).toBe('calc(100% - 150px)');
    expect(view?.style.height).toBe('calc(100% - 150px)');
  });

  it('should backgroundSize work', async () => {
    testComponent.content.set('NG Ant Design');
    testComponent.gap.set([100, 100]);
    testComponent.width.set(200);
    testComponent.height.set(200);
    fixture.detectChanges();
    await fixture.whenStable();

    const view = resultEl.nativeElement.querySelector('.watermark > div');
    expect(view?.style.backgroundSize).toBe('600px');
  });

  it('should MutationObserver work', async () => {
    testComponent.content.set('NG Ant Design');
    fixture.detectChanges();
    await fixture.whenStable();

    const view = resultEl.nativeElement.querySelector('.watermark > div');
    view?.remove();
    await fixture.whenStable();

    expect(view).toBeTruthy();
  });

  it('should observe the modification of style', async () => {
    testComponent.content.set('NG Ant Design');
    fixture.detectChanges();
    await fixture.whenStable();

    const view = resultEl.nativeElement.querySelector('.watermark > div');
    view?.setAttribute('style', '');
    await fixture.whenStable();

    expect(view.style).toBeTruthy();
  });
});

describe('watermark (SSR)', () => {
  // TODO: Move this SSR assertion to a Node-based Vitest environment. The browser runner cannot create
  // the server platform required by `renderApplication`.
  it.skip('should render water mark on server', async () => {
    // `as any` because `ngDevMode` is not exposed on the global namespace typings.
    const ngDevMode = (globalThis as TriSafeAny)['ngDevMode'];

    try {
      // Disable development-mode checks for these tests (we don't care).
      (globalThis as TriSafeAny)['ngDevMode'] = false;
      // Enter server mode for the duration of this function.
      globalThis['ngServerMode'] = true;

      const bootstrap = (): Promise<ApplicationRef> => bootstrapApplication(TriTestWatermarkBasicComponent);
      const html = await renderApplication(bootstrap, {
        document: '<html><head></head><body><nz-test-watermark-basic></nz-test-watermark-basic></body></html>'
      });

      expect(html).toContain('<nz-watermark class="watermark"');
    } finally {
      // Restore the original value.
      (globalThis as TriSafeAny)['ngDevMode'] = ngDevMode;
      // Leave server mode so the remaining test is back in "client mode".
      globalThis['ngServerMode'] = undefined;
    }

    destroyPlatform();
  });
});

@Component({
  selector: 'tri-test-watermark-basic',
  imports: [TriWatermarkModule],
  template: `
    <tri-watermark
      [content]="content()"
      [width]="width()"
      [height]="height()"
      [rotate]="rotate()"
      [zIndex]="zIndex()"
      [image]="image()"
      [font]="font()"
      [gap]="gap()"
      [offset]="offset()"
      class="watermark"
    />
  `
})
export class TriTestWatermarkBasicComponent {
  readonly content = signal<string | string[]>('NG Ant Design');
  readonly width = signal(120);
  readonly height = signal(64);
  readonly rotate = signal(-22);
  readonly zIndex = signal(9);
  readonly image = signal('');
  readonly font = signal<FontType>({});
  readonly gap = signal<[number, number]>([100, 100]);
  readonly offset = signal<[number, number]>([50, 50]);
}
