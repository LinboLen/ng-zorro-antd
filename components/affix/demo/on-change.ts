import { Component } from '@angular/core';

import { TriAffixModule } from 'ng-zorro-antd/affix';
import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'tri-demo-affix-on-change',
  imports: [TriAffixModule, TriButtonModule],
  template: `
    <tri-affix [offsetTop]="120" (change)="onChange($event)">
      <button tri-button>
        <span>120px to affix top</span>
      </button>
    </tri-affix>
  `
})
export class TriDemoAffixOnChangeComponent {
  onChange(status: boolean): void {
    console.log(status);
  }
}
