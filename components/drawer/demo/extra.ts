import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';
import { TriFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'tri-demo-drawer-extra',
  imports: [TriButtonModule, TriDrawerModule, TriFlexModule],
  template: `
    <button tri-button type="primary" (click)="open()">Open</button>
    <tri-drawer
      [closable]="false"
      placement="right"
      title="Basic Drawer"
      (onClose)="close()"
      [visible]="visible()"
      [extra]="extra"
    >
      <ng-container *drawerContent>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </ng-container>

      <ng-template #extra>
        <div tri-flex gap="small">
          <button tri-button type="primary" (click)="close()">OK</button>
          <button tri-button type="default" (click)="close()">Cancel</button>
        </div>
      </ng-template>
    </tri-drawer>
  `
})
export class TriDemoDrawerExtraComponent {
  readonly visible = signal(false);

  open(): void {
    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }
}
