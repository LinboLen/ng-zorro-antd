import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'tri-demo-drawer-basic-right',
  imports: [TriButtonModule, TriDrawerModule],
  template: `
    <button tri-button type="primary" (click)="open()">Open</button>
    <tri-drawer
      [closable]="false"
      [visible]="visible"
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
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
