import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'tri-demo-drawer-basic-right',
  imports: [TriButtonModule, TriDrawerModule],
  template: `
    <button tri-button type="primary" (click)="open()">Open</button>
    <tri-drawer
      [closable]="false"
      [visible]="visible()"
      placement="right"
      title="Basic Drawer"
      (onClose)="close()"
    >
      <ng-container *drawerContent>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </ng-container>
    </tri-drawer>
  `
})
export class TriDemoDrawerBasicRightComponent {
  readonly visible = signal(false);

  open(): void {
    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }
}
