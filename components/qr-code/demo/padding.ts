import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'tri-demo-qr-code-padding',
  imports: [TriQRCodeModule],
  template: `
    <tri-qrcode [padding]="2" value="https://ng.ant.design/"></tri-qrcode>
    <tri-qrcode type="svg" [padding]="2" value="https://ng.ant.design/"></tri-qrcode>
  `,
  styles: [
    `
      nz-qrcode {
        margin-right: 12px;
        padding: 0;
      }
    `
  ]
})
export class TriDemoQrCodePaddingComponent {}
