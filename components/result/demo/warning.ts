import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'tri-demo-result-warning',
  imports: [TriButtonModule, TriResultModule],
  template: `
    <tri-result status="warning" title="There are some problems with your operation">
      <div tri-result-extra>
        <button tri-button type="primary">Go Console</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultWarningComponent {}
