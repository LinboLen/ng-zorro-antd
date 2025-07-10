import { Component } from '@angular/core';

import { TriBackTopModule } from 'ng-zorro-antd/back-top';

@Component({
  selector: '',
  imports: [TriBackTopModule],
  template: `
    <tri-back-top></tri-back-top>
    Scroll down to see the bottom-right
    <strong>gray</strong>
    button.
  `,
  styles: [
    `
      strong {
        color: rgba(64, 64, 64, 0.6);
      }
    `
  ]
})
export class TriDemoBackTopBasicComponent {}
