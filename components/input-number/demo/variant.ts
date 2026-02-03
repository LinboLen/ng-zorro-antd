import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-input-number-variant',
  imports: [FormsModule, TriInputNumberModule, TriSpaceModule],
  template: ` <tri-space direction="vertical" style="width: 100%">
    <tri-input-number *spaceItem [ngModel]="3" />
    <tri-input-number *spaceItem variant="filled" [ngModel]="3" />
    <tri-input-number *spaceItem variant="borderless" [ngModel]="3" />
    <tri-input-number *spaceItem variant="underlined" [ngModel]="3" />
  </tri-space>`
})
export class TriDemoInputNumberVariantComponent {}
