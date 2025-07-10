import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <div class="description">
      <tri-float-button
        [icon]="icon"
        [description]="description"
        shape="square"
        style="right: 24px"
      ></tri-float-button>
      <tri-float-button [description]="description" shape="square" style="right: 94px"></tri-float-button>
    </div>
    <ng-template #description>HELP</ng-template>

    <ng-template #icon>
      <tri-icon type="file-text" theme="outline"></tri-icon>
    </ng-template>
  `,
  styles: [
    `
      .description {
        height: 300px;
        position: relative;
      }
      nz-float-button {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonDescriptionComponent {}
