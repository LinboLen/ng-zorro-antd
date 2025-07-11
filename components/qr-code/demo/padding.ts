import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'tri-demo-qr-code-padding',
  imports: [TriQRCodeModule],
  template: `
    <tri-qrcode [padding]="12" value="https://ng.ant.design/"></tri-qrcode>
    <tri-qrcode [padding]="[12, 24]" value="https://ng.ant.design/"></tri-qrcode>
  `,
  styles: [
    `
      nz-qrcode {
        margin-right: 12px;
      }
    `
  ]
})
export class TriDemoQrCodePaddingComponent {}
