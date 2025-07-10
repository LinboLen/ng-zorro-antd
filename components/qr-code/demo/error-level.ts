import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: '',
  imports: [TriQRCodeModule, TriSegmentedModule, FormsModule],
  template: `
    <tri-qrcode value="https://github.com/NG-ZORRO/ng-zorro-antd/issues" [level]="errorLevel"></tri-qrcode>
    <tri-segmented [options]="options" [(ngModel)]="errorLevel"></tri-segmented>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
      }

      nz-qrcode {
        margin-bottom: 12px;
      }
    `
  ]
})
export class TriDemoQrCodeErrorLevelComponent {
  options: Array<'L' | 'M' | 'Q' | 'H'> = ['L', 'M', 'Q', 'H'];
  errorLevel: 'L' | 'M' | 'Q' | 'H' = 'L';
}
