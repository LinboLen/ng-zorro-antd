import { Component } from '@angular/core';

import { TriAffixModule } from 'ng-zorro-antd/affix';
import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'tri-demo-affix-basic',
  imports: [TriAffixModule, TriButtonModule],
  template: `
    <tri-affix [offsetTop]="offsetTop">
      <button tri-button type="primary" (click)="setOffsetTop()">
        <span>Affix top</span>
      </button>
    </tri-affix>
    <br />
    <tri-affix [offsetBottom]="offsetBottom" (click)="setOffsetBottom()">
      <button tri-button type="primary">
        <span>Affix bottom</span>
      </button>
    </tri-affix>
  `
})
export class TriDemoAffixBasicComponent {
  offsetTop = 10;
  offsetBottom = 10;

  setOffsetTop(): void {
    this.offsetTop += 10;
  }

  setOffsetBottom(): void {
    this.offsetBottom += 10;
  }
}
