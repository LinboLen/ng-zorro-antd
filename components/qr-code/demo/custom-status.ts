import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: '',
  imports: [TriQRCodeModule, TriIconModule],
  template: `
    <tri-qrcode value="https://ng.ant.design/" statusRender="NgZorro"></tri-qrcode>
    <tri-qrcode value="https://ng.ant.design/" [statusRender]="customTemplate"></tri-qrcode>
    <ng-template #customTemplate>
      <div>
        <tri-icon type="check-circle" theme="outline" style="color: red" />
        success
      </div>
    </ng-template>
  `,
  styles: [
    `
      nz-qrcode {
        margin-right: 12px;
      }
    `
  ]
})
export class TriDemoQrCodeCustomStatusComponent {}
