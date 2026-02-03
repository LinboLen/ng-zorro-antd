import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-float-button-open',
  imports: [FormsModule, TriFloatButtonModule, TriSwitchModule],
  template: `
    <div class="open">
      <tri-float-button-group
        icon="customer-service"
        [open]="isOpen"
        type="primary"
        trigger="hover"
        style="right: 24px"
      >
        <tri-float-button />
        <tri-float-button icon="comment" />
      </tri-float-button-group>
      <tri-switch [(ngModel)]="isOpen" />
    </div>
  `,
  styles: `
    .open {
      height: 300px;
      position: relative;
    }
    nz-float-button-group,
    nz-float-button {
      position: absolute;
    }
  `
})
export class TriDemoFloatButtonOpenComponent {
  isOpen: boolean = true;
}
