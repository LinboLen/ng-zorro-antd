import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: '',
  imports: [TriButtonModule, TriEmptyModule],
  template: `
    <tri-empty
      notFoundImage="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      [notFoundContent]="contentTpl"
      [notFoundFooter]="footerTpl"
    >
      <ng-template #contentTpl>
        <span>
          Customize
          <a href="#API">Description</a>
        </span>
      </ng-template>
      <ng-template #footerTpl>
        <button tri-button type="primary" (click)="onClick()">Create Now</button>
      </ng-template>
    </tri-empty>
  `
})
export class TriDemoEmptyCustomizeComponent {
  onClick(): void {
    console.log('clicked');
  }
}
