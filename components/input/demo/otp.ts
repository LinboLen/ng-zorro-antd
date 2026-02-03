import { Component } from '@angular/core';

import { TriFlexDirective } from 'ng-zorro-antd/flex';
import { TriInputOtpComponent } from 'ng-zorro-antd/input';
import { TriTypographyComponent } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-input-otp',
  template: `
    <tri-flex vertical [gap]="16">
      <tri-flex vertical>
        <h5 tri-typography>With Formatter (Uppercase)</h5>
        <tri-input-otp [formatter]="formatter" />
      </tri-flex>

      <tri-flex vertical>
        <h5 tri-typography>With Disabled</h5>
        <tri-input-otp [disabled]="true" />
      </tri-flex>

      <tri-flex vertical>
        <h5 tri-typography>With Length (8)</h5>
        <tri-input-otp [length]="8" />
      </tri-flex>

      <tri-flex vertical>
        <h5 tri-typography>With custom display character</h5>
        <tri-input-otp mask="🔒" />
      </tri-flex>
    </tri-flex>
  `,
  imports: [TriFlexDirective, TriTypographyComponent, TriInputOtpComponent]
})
export class TriDemoInputOtpComponent {
  formatter: (value: string) => string = value => value.toUpperCase();
}
