import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriBadgeModule, TriButtonModule, TriFlexModule, TriIconModule, TriSwitchModule, TriSpaceModule],
  template: `
    <div tri-flex vertical gap="middle">
      <div tri-flex gap="large" align="center">
        <tri-badge [count]="count">
          <a class="head-example"></a>
        </tri-badge>
        <tri-space-compact>
          <button tri-button (click)="minusCount()"><tri-icon type="minus" /></button>
          <button tri-button (click)="addCount()"><tri-icon type="plus" /></button>
          <button tri-button (click)="random()"><tri-icon type="question" /></button>
        </tri-space-compact>
      </div>
      <div tri-flex gap="large" align="center">
        <tri-badge [dot]="dot">
          <a class="head-example"></a>
        </tri-badge>
        <tri-switch [(ngModel)]="dot"></tri-switch>
      </div>
    </div>
  `,
  styles: [
    `
      .head-example {
        width: 42px;
        height: 42px;
        border-radius: 4px;
        background: #eee;
        display: inline-block;
        vertical-align: middle;
      }
    `
  ]
})
export class TriDemoBadgeDynamicComponent {
  count = 5;
  dot = true;

  addCount(): void {
    this.count++;
  }

  minusCount(): void {
    this.count = Math.max(0, this.count - 1);
  }

  random(): void {
    this.count = Math.floor(Math.random() * 100);
  }
}
