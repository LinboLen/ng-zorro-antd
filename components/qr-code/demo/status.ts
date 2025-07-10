import { Component } from '@angular/core';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: '',
  imports: [TriQRCodeModule],
  template: `
    <tri-qrcode value="https://ng.ant.design/" status="loading"></tri-qrcode>
    <tri-qrcode value="https://ng.ant.design/" status="expired" (refresh)="refresh($event)"></tri-qrcode>
    <tri-qrcode value="https://ng.ant.design/" status="scanned"></tri-qrcode>
  `,
  styles: [
    `
      nz-qrcode {
        margin-right: 12px;
      }
    `
  ]
})
export class TriDemoQrCodeStatusComponent {
  refresh(val: string): void {
    console.log(val);
  }
}
