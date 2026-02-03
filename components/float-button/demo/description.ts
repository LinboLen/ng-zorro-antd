import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-description',
  imports: [TriFloatButtonModule],
  template: `
    <div class="description">
      <tri-float-button icon="file-text" description="HELP" shape="square" style="right: 24px" />
      <tri-float-button description="HELP" shape="square" style="right: 94px" />
    </div>
  `,
  styles: `
    .description {
      height: 300px;
      position: relative;
    }
    nz-float-button {
      position: absolute;
    }
  `
})
export class TriDemoFloatButtonDescriptionComponent {}
