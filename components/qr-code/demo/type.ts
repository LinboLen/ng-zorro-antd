import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'tri-demo-qr-code-type',
  imports: [TriQRCodeModule],
  template: `
    <tri-qrcode value="https://ng.ant.design/" />
    <tri-qrcode value="https://ng.ant.design/" type="svg" />
  `,
  styles: `
    nz-qrcode {
      margin-right: 12px;
    }
  `
})
export class TriDemoQrCodeTypeComponent {}
