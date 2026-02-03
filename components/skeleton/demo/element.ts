import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import {
  TriSkeletonAvatarShape,
  TriSkeletonButtonShape,
  TriSkeletonInputSize,
  TriSkeletonModule
} from 'ng-zorro-antd/skeleton';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-skeleton-element',
  imports: [FormsModule, TriDividerModule, TriGridModule, TriSkeletonModule, TriRadioModule, TriSpaceModule, TriSwitchModule],
  template: `
    <tri-space size="middle">
      <tri-skeleton-element
        *spaceItem
        type="button"
        [active]="elementActive"
        [size]="elementSize"
        [shape]="buttonShape"
      />
      <tri-skeleton-element
        *spaceItem
        type="avatar"
        [active]="elementActive"
        [size]="elementSize"
        [shape]="avatarShape"
      />
      <tri-skeleton-element
        *spaceItem
        type="input"
        [active]="elementActive"
        [size]="elementSize"
        style="width:200px"
      />
    </tri-space>
    <br />
    <br />
    <tri-skeleton-element type="image" [active]="elementActive" />
    <tri-divider />
    <div tri-row align="middle" [gutter]="8">
      <div tri-col span="10">
        Size:
        <tri-radio-group [(ngModel)]="elementSize">
          <label tri-radio-button value="default">Default</label>
          <label tri-radio-button value="large">Large</label>
          <label tri-radio-button value="small">Small</label>
        </tri-radio-group>
      </div>
      <div tri-col span="5">
        Active:
        <tri-switch [(ngModel)]="elementActive" />
      </div>
    </div>
    <br />
    <br />
    <div tri-row align="middle" [gutter]="8">
      <div tri-col span="10">
        Button Shape:
        <tri-radio-group [(ngModel)]="buttonShape">
          <label tri-radio-button value="default">Default</label>
          <label tri-radio-button value="square">Square</label>
          <label tri-radio-button value="circle">Circle</label>
          <label tri-radio-button value="round">Round</label>
        </tri-radio-group>
      </div>
      <div tri-col span="10">
        Avatar Shape:
        <tri-radio-group [(ngModel)]="avatarShape">
          <label tri-radio-button value="circle">Circle</label>
          <label tri-radio-button value="square">Square</label>
        </tri-radio-group>
      </div>
    </div>
  `
})
export class TriDemoSkeletonElementComponent {
  elementActive = false;
  buttonShape: TriSkeletonButtonShape = 'default';
  avatarShape: TriSkeletonAvatarShape = 'circle';
  elementSize: TriSkeletonInputSize = 'default';
}
