/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ApplicationRef, Component, DebugElement, destroyPlatform } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { bootstrapApplication, By } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { FontType } from './typings';
import { TriWaterMarkComponent } from './water-mark.component';
import { TriWaterMarkModule } from './water-mark.module';

describe('water-mark', () => {
  let fixture: ComponentFixture<TriTestWaterMarkBasicComponent>;
  let testComponent: TriTestWaterMarkBasicComponent;
  let resultEl: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestWaterMarkBasicComponent);
    fixture.detectChanges();
    testComponent = fixture.debugElement.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriWaterMarkComponent));
  });

  it('basic', () => {
    testComponent.content = 'NG Ant Design';
    fixture.detectChanges();
    const view = resultEl.nativeElement.querySelector('.water-mark > div');
    expect(view.tagName).toBe('DIV');
  });

  it('image', () => {
    testComponent.image =
      'https://img.alicdn.com/imgextra/i3/O1CN01UR3Zkq1va9fnZsZcr_!!6000000006188-55-tps-424-64.svg';
    fixture.detectChanges();
    const view = resultEl.nativeElement.querySelector('.water-mark > div');
    expect(view.tagName).toBe('DIV');
  });

  it('invalid image', () => {
    testComponent.image = 'https://img.alicdn.com/test.svg';
    fixture.detectChanges();
    const view = resultEl.nativeElement.querySelector('.water-mark > div');
    expect(view.tagName).toBe('DIV');
  });

  it('should offset work', () => {
    testComponent.content = ['Angular', 'NG Ant Design'];
    testComponent.offset = [200, 200];
    fixture.detectChanges();
    const view = resultEl.nativeElement.querySelector('.water-mark > div');
    expect(view?.style.left).toBe('150px');
    expect(view?.style.top).toBe('150px');
    expect(view?.style.width).toBe('calc(100% - 150px)');
    expect(view?.style.height).toBe('calc(100% - 150px)');
  });

  it('should backgroundSize work', () => {
    testComponent.content = 'NG Ant Design';
    testComponent.gap = [100, 100];
    testComponent.width = 200;
    testComponent.height = 200;
    fixture.detectChanges();
    const view = resultEl.nativeElement.querySelector('.water-mark > div');
    expect(view?.style.backgroundSize).toBe('600px');
  });

  it('should MutationObserver work', fakeAsync(() => {
    testComponent.content = 'NG Ant Design';
    fixture.detectChanges();
    const view = resultEl.nativeElement.querySelector('.water-mark > div');
    view?.remove();
    tick(100);
    expect(view).toBeTruthy();
  }));

  it('should observe the modification of style', fakeAsync(() => {
    testComponent.content = 'NG Ant Design';
    fixture.detectChanges();
    const view = resultEl.nativeElement.querySelector('.water-mark > div');
    view?.setAttribute('style', '');
    tick(100);
    expect(view.style).toBeTruthy();
  }));
});

describe('water-mark (SSR)', () => {
  it('should render water mark on server', async () => {
    destroyPlatform();

    // `as any` because `ngDevMode` is not exposed on the global namespace typings.
    const ngDevMode = (globalThis as TriSafeAny)['ngDevMode'];

    try {
      // Disable development-mode checks for these tests (we don't care).
      (globalThis as TriSafeAny)['ngDevMode'] = false;
      // Enter server mode for the duration of this function.
      globalThis['ngServerMode'] = true;

      const bootstrap = (): Promise<ApplicationRef> =>
        bootstrapApplication(TriTestWaterMarkBasicComponent, { providers: [] });
      const html = await renderApplication(bootstrap, {
        document: '<html><head></head><body><nz-app></nz-app></body></html>'
      });

      expect(html).toContain('<nz-water-mark class="ant-water-mark water-mark">');
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
  selector: 'tri-app',
  imports: [TriWaterMarkModule],
  template: `
    <tri-water-mark
      [content]="content"
      [width]="width"
      [height]="height"
      [rotate]="rotate"
      [zIndex]="zIndex"
      [image]="image"
      [font]="font"
      [gap]="gap"
      [offset]="offset"
      class="water-mark"
    >
    </tri-water-mark>
  `
})
export class TriTestWaterMarkBasicComponent {
  content: string | string[] = 'NG Ant Design';
  width: number = 120;
  height: number = 64;
  rotate: number = -22;
  zIndex: number = 9;
  image: string = '';
  font: FontType = {};
  gap: [number, number] = [100, 100];
  offset: [number, number] = [50, 50];
}
