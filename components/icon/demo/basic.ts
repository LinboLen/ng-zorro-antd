import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-icon-basic',
  imports: [TriIconModule],
  template: `
    <div class="icons-list">
      <tri-icon type="home" />
      <tri-icon type="setting" theme="fill" />
      <tri-icon type="smile" theme="outline" />
      <tri-icon type="sync" [spin]="true" />
      <tri-icon type="smile" theme="outline" [rotate]="180" />
      <!-- Loading with new API would spin automatically! -->
      <tri-icon type="loading" />
    </div>
  `,
  styles: `
    nz-icon {
      margin-right: 6px;
      font-size: 24px;
    }
  `
})
export class TriDemoIconBasicComponent {}
