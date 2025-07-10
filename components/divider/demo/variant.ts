import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: '',
  imports: [TriDividerModule],
  template: `
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider plain text="Solid" variant="solid"></tri-divider>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider plain text="Dotted" variant="dotted"></tri-divider>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
      <tri-divider plain text="Dashed" variant="dashed"></tri-divider>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae
        sunt a te dicta? Refert tamen, quo modo.
      </p>
    </div>
  `,
  styles: [
    `
      nz-divider::after,
      nz-divider::before {
        border-color: #7cb305 !important;
      }
    `
  ]
})
export class TriDemoDividerVariantComponent {}
