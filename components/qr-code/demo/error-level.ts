import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriQRCodeModule } from 'ng-zorro-antd/qr-code';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

type Level = 'L' | 'M' | 'Q' | 'H';

@Component({
  selector: 'tri-demo-qr-code-error-level',
  imports: [TriQRCodeModule, TriSegmentedModule, FormsModule],
  template: `
    <tri-qrcode value="https://github.com/NG-ZORRO/ng-zorro-antd/issues" [level]="errorLevel()" />
    <tri-segmented [options]="options" [(ngModel)]="errorLevel" />
  `,
  styles: `
    :host {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }

    nz-qrcode {
      margin-bottom: 12px;
    }
  `
})
export class TriDemoQrCodeErrorLevelComponent {
  readonly options: Level[] = ['L', 'M', 'Q', 'H'];
  readonly errorLevel = signal<Level>('L');
}
