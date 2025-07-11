import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'tri-demo-result-fof',
  imports: [TriButtonModule, TriResultModule],
  template: `
    <tri-result status="404" title="404" subTitle="Sorry, the page you visited does not exist.">
      <div tri-result-extra>
        <button tri-button type="primary">Back Home</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultFofComponent {}
