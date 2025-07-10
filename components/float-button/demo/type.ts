import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <div class="type">
      <tri-float-button type="primary" style="right: 24px" [icon]="icon"></tri-float-button>
      <tri-float-button type="default" style="right: 94px" [icon]="icon"></tri-float-button>
    </div>
    <ng-template #icon>
      <tri-icon type="question-circle" theme="outline"></tri-icon>
    </ng-template>
  `,
  styles: [
    `
      .type {
        height: 300px;
        position: relative;
      }
      nz-float-button {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonTypeComponent {}
