import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriResultModule } from 'ng-zorro-antd/result';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-result-error',
  imports: [TriButtonModule, TriIconModule, TriResultModule, TriTypographyModule],
  template: `
    <tri-result
      title="Submission Failed"
      status="error"
      subTitle="Please check and modify the following information before resubmitting."
    >
      <div tri-result-content>
        <div class="desc">
          <h4 tri-title>The content you submitted has the following error:</h4>
          <p tri-paragraph>
            <tri-icon type="close-circle" />
            Your account has been frozen
            <a>Thaw immediately &gt;</a>
          </p>
          <p tri-paragraph>
            <tri-icon type="close-circle" />
            Your account is not yet eligible to apply
            <a>Apply immediately &gt;</a>
          </p>
        </div>
      </div>
      <div tri-result-extra>
        <button tri-button type="primary">Go Console</button>
        <button tri-button>Buy Again</button>
      </div>
    </tri-result>
  `
})
export class TriDemoResultErrorComponent {}
