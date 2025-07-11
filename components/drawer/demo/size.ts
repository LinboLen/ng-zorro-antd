import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-drawer-size',
  imports: [TriButtonModule, TriDrawerModule, TriSpaceModule],
  template: `
    <tri-space>
      <button *spaceItem tri-button type="primary" (click)="showDefault()">Open Default Size (378px)</button>
      <button *spaceItem tri-button type="primary" (click)="showLarge()">Open Large Size (736px)</button>
    </tri-space>
    <tri-drawer
      [size]="size"
      [visible]="visible"
      placement="right"
      [title]="title"
      [extra]="extra"
      (onClose)="close()"
    >
      <ng-container *drawerContent>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </ng-container>
    </tri-drawer>
    <ng-template #extra>
      <button tri-button type="default" (click)="close()">Cancel</button>
      &nbsp;
      <button tri-button type="primary" (click)="close()">OK</button>
    </ng-template>
  `
})
export class TriDemoDrawerSizeComponent {
  visible = false;
  size: 'large' | 'default' = 'default';

  get title(): string {
    return `${this.size} Drawer`;
  }

  showDefault(): void {
    this.size = 'default';
    this.open();
  }

  showLarge(): void {
    this.size = 'large';
    this.open();
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
