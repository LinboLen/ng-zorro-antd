import { Component } from '@angular/core';

import { TriAffixModule } from 'ng-zorro-antd/affix';
import { TriButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'tri-demo-affix-target',
  imports: [TriAffixModule, TriButtonModule],
  template: `
    <div class="scrollable-container" #target>
      <div class="background">
        <tri-affix [target]="target" id="affix-container-target">
          <button tri-button type="primary">
            <span>Fixed at the top of container</span>
          </button>
        </tri-affix>
      </div>
    </div>
  `,
  styles: `
    .scrollable-container {
      height: 100px;
      overflow-y: scroll;
    }

    .background {
      padding-top: 60px;
      height: 300px;
      background-image: url(//zos.alipayobjects.com/rmsportal/RmjwQiJorKyobvI.jpg);
    }
  `
})
export class TriDemoAffixTargetComponent {}
