import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'tri-demo-result-info',
  imports: [TriButtonModule, TriResultModule],
  template: `
    <tri-result status="info" title="Your operation has been executed">
      <div tri-result-extra>
        <button tri-button type="primary">Go Console</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultInfoComponent {}
