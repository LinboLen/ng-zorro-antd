import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDrawerModule, TriDrawerPlacement } from 'ng-zorro-antd/drawer';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-drawer-placement',
  imports: [FormsModule, TriButtonModule, TriDrawerModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="placement">
      <label tri-radio value="top">top</label>
      <label tri-radio value="right">right</label>
      <label tri-radio value="bottom">bottom</label>
      <label tri-radio value="left">left</label>
    </tri-radio-group>
    <button tri-button type="primary" (click)="open()">Open</button>
    <tri-drawer
      [closable]="false"
      [visible]="visible"
      [placement]="placement"
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
export class TriDemoDrawerPlacementComponent {
  visible = false;
  placement: TriDrawerPlacement = 'left';
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
