import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriFloatButtonModule, TriIconModule, TriSwitchModule],
  template: `
    <div class="open">
      <tri-float-button-group [icon]="icon" [open]="isOpen" type="primary" trigger="hover" style="right: 24px">
        <tri-float-button></tri-float-button>
        <tri-float-button [icon]="inner"></tri-float-button>
      </tri-float-button-group>
      <tri-switch [(ngModel)]="isOpen"></tri-switch>
      <ng-template #icon>
        <tri-icon type="customer-service" theme="outline"></tri-icon>
      </ng-template>
      <ng-template #inner>
        <tri-icon type="comment" theme="outline"></tri-icon>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .open {
        height: 300px;
        position: relative;
      }
      nz-float-button-group,
      nz-float-button {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonOpenComponent {
  isOpen: boolean = true;
}
