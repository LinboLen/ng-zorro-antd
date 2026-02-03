/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriQRCodeComponent } from './qrcode.component';
import { TriQRCodeModule } from './qrcode.module';

describe('qrcode', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriTestQrCodeBasicComponent>;
    let testComponent: TriTestQrCodeBasicComponent;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestQrCodeBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriQRCodeComponent));
    });

    it('qr code bordered', () => {
      testComponent.bordered = false;
      fixture.detectChanges();
      expect(resultEl.nativeElement.classList).not.toContain('ant-qrcode-border');
    });

    it('qr code width', () => {
      testComponent.size = 200;
      fixture.detectChanges();
      const widthView = resultEl.nativeElement.querySelector('.ant-qrcode > nz-qrcode-canvas > canvas');
      expect(widthView.style.width).toBe('200px');
    });

    it('qr code type', () => {
      testComponent.type = 'svg';
      fixture.detectChanges();
      const widthView = resultEl.nativeElement.querySelector('.ant-qrcode > nz-qrcode-svg > svg');
      expect(widthView.nodeName).toBe('svg');
    });

    it('qr code custom status', () => {
      testComponent.statusRender = 'custom status';
      fixture.detectChanges();
      const statusView = resultEl.nativeElement.querySelector('.ant-qrcode-mask');
      expect(statusView.innerText).toBe('custom status');
    });

    it('qr code status', () => {
      const statusList: Array<'active' | 'expired' | 'loading' | 'scanned'> = ['expired', 'loading', 'scanned'];

      for (let i = 0; i < statusList.length; i++) {
        testComponent.status = statusList[i];
        fixture.detectChanges();
        const statusView = resultEl.nativeElement.querySelector('.ant-qrcode-mask');
        if (i === 1) {
          expect(statusView.firstElementChild.tagName).toBe('NZ-SPIN');
        } else {
          expect(statusView.firstElementChild.tagName).toBe('DIV');
        }
      }
    });
  });
});

@Component({
  imports: [TriQRCodeModule],
  template: `<tri-qrcode
    [value]="value"
    [size]="size"
    [type]="type"
    [bordered]="bordered"
    [status]="status"
    [statusRender]="statusRender"
  />`
})
export class TriTestQrCodeBasicComponent {
  value: string = 'https://ng.ant.design/';
  type: 'svg' | 'canvas' = 'canvas';
  size: number = 160;
  bordered: boolean = true;
  statusRender: string | null = null;
  status: 'active' | 'expired' | 'loading' | 'scanned' = 'active';
}
