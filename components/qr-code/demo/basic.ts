import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'tri-demo-qr-code-basic',
  imports: [TriQRCodeModule],
  template: `<tri-qrcode value="https://ng.ant.design/"></tri-qrcode>`
})
export class TriDemoQrCodeBasicComponent {}
