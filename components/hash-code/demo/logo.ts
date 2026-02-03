import { Component } from '@angular/core';

import { TriHashCodeModule } from 'ng-zorro-antd/hash-code';

@Component({
  selector: 'tri-demo-hash-code-logo',
  imports: [TriHashCodeModule],
  template: `<tri-hash-code [value]="value" logo="Antd" />`
})
export class TriDemoHashCodeLogoComponent {
  value = 'dfb5fe9ef7b99b2b1db102114a6d7d445d992f40a5d575f801c148990199a068';
}
