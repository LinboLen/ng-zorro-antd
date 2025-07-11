import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'tri-demo-result-fot',
  imports: [TriButtonModule, TriResultModule],
  template: `
    <tri-result status="403" title="403" subTitle="Sorry, you are not authorized to access this page.">
      <div tri-result-extra>
        <button tri-button type="primary">Back Home</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultFotComponent {}
