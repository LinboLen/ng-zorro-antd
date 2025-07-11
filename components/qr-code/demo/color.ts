import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'tri-demo-qr-code-color',
  imports: [TriQRCodeModule],
  template: `
    <tri-qrcode value="https://ng.ant.design/" color="#ff6600"></tri-qrcode>
    <tri-qrcode value="https://ng.ant.design/" color="#1677ff"></tri-qrcode>
  `,
  styles: [
    `
      nz-qrcode {
        margin-right: 12px;
      }
    `
  ]
})
export class TriDemoQrCodeColorComponent {}
