import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-divider-size',
  imports: [TriDividerModule, TriIconModule],
  template: `
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider size="small" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider size="middle" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider size="large" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
    </div>
  `
})
export class TriDemoDividerSizeComponent {}
