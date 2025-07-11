import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'tri-demo-result-custom',
  imports: [TriButtonModule, TriResultModule],
  template: `
    <tri-result icon="smile-twotone" title="Great, we have done all the operators!">
      <div tri-result-extra>
        <button tri-button type="primary">Next</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultCustomComponent {}
