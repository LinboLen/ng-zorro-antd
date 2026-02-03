import { Component, ViewChild, ElementRef } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'tri-demo-qr-code-download',
  imports: [TriButtonModule, TriQRCodeModule],
  template: `
    <div id="download">
      <tri-qrcode value="https://ng.ant.design/" />
      <a #download></a>
      <button tri-button type="primary" (click)="downloadImg()">Download</button>
    </div>
  `,
  styles: `
    div {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }

    nz-qrcode {
      margin-bottom: 12px;
    }
  `
})
export class TriDemoQrCodeDownloadComponent {
  @ViewChild('download', { static: false }) download!: ElementRef;

  downloadImg(): void {
    const canvas = document.getElementById('download')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      this.download.nativeElement.href = canvas.toDataURL('image/png');
      this.download.nativeElement.download = 'ng-zorro-antd';
      const event = new MouseEvent('click');
      this.download.nativeElement.dispatchEvent(event);
    }
  }
}
