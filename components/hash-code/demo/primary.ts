import { Component } from '@angular/core';

import { TriHashCodeModule } from 'ng-zorro-antd/hash-code';

@Component({
  selector: 'tri-demo-hash-code-primary',
  imports: [TriHashCodeModule],
  template: `<tri-hash-code [value]="value" type="primary" />`
})
export class TriDemoHashCodePrimaryComponent {
  value = 'dfb5fe9ef7b99b2b1db102114a6d7d445d992f40a5d575f801c148990199a068';
}
