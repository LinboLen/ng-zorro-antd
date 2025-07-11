import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'tri-demo-qr-code-background',
  imports: [TriQRCodeModule],
  template: `
    <tri-qrcode bgColor="#f6f6f6" color="#ff6600" value="https://ng.ant.design/"></tri-qrcode>
    <tri-qrcode bgColor="#f6f6f6" color="#1677ff" value="https://ng.ant.design/"></tri-qrcode>
  `,
  styles: [
    `
      nz-qrcode {
        margin-right: 12px;
      }
    `
  ]
})
export class TriDemoQrCodeBackgroundComponent {}
