import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: '',
  imports: [TriFloatButtonModule],
  template: `
    <div class="basic">
      <tri-float-button></tri-float-button>
    </div>
  `,
  styles: [
    `
      .basic {
        height: 300px;
        position: relative;
      }
      nz-float-button {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonBasicComponent {}
