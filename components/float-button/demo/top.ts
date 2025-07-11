import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-top',
  imports: [TriFloatButtonModule],
  template: `
    <tri-float-button-top></tri-float-button-top>
    Scroll down to see the back to top button on the bottom right
  `
})
export class TriDemoFloatButtonTopComponent {}
