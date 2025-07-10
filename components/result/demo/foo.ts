import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: '',
  imports: [TriButtonModule, TriResultModule],
  template: `
    <tri-result status="500" title="500" subTitle="Sorry, there is an error on server.">
      <div tri-result-extra>
        <button tri-button type="primary">Back Home</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultFooComponent {}
