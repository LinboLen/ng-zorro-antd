import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: '',
  imports: [TriQRCodeModule],
  template: `
    <tri-qrcode
      value="https://ng.ant.design/"
      icon="https://img.alicdn.com/imgextra/i2/O1CN01TBIkzL1Nk3IBB0DLA_!!6000000001607-2-tps-106-120.png"
      level="H"
    ></tri-qrcode>
  `
})
export class TriDemoQrCodeIconComponent {}
