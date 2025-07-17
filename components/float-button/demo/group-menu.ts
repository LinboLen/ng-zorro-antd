import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-float-button-group-menu',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <div class="menu">
      <tri-float-button-group
        [icon]="icon"
        type="primary"
        trigger="click"
        style="right: 24px"
        (onOpenChange)="openChange($event)"
      >
        <tri-float-button></tri-float-button>
        <tri-float-button [icon]="inner"></tri-float-button>
      </tri-float-button-group>
      <tri-float-button-group
        [icon]="icon"
        type="primary"
        trigger="hover"
        style="right: 94px"
        (onOpenChange)="openChange($event)"
      >
        <tri-float-button></tri-float-button>
        <tri-float-button [icon]="inner"></tri-float-button>
      </tri-float-button-group>
    </div>
    <ng-template #icon>
      <tri-icon type="customer-service" theme="outline"></tri-icon>
    </ng-template>
    <ng-template #inner>
      <tri-icon type="comment" theme="outline"></tri-icon>
    </ng-template>
  `,
  styles: [
    `
      .menu {
        height: 300px;
        position: relative;
      }
      nz-float-button-group {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonGroupMenuComponent {
  openChange(status: boolean): void {
    console.log(status);
  }
}
