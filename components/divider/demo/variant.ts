import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'tri-demo-divider-variant',
  imports: [TriDividerModule],
  template: `
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider plain text="Solid" variant="solid" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider plain text="Dotted" variant="dotted" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider plain text="Dashed" variant="dashed" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
    </div>
  `,
  styles: `
    nz-divider::after,
    nz-divider::before {
      border-color: #7cb305 !important;
    }
  `
})
export class TriDemoDividerVariantComponent {}
