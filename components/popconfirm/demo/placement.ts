import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'tri-demo-popconfirm-placement',
  imports: [TriButtonModule, TriPopconfirmModule],
  template: `
    <div style="margin-left: 60px">
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="topLeft"
        tri-button
      >
        TL
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="top"
        tri-button
      >
        Top
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="topRight"
        tri-button
      >
        TR
      </button>
    </div>
    <div style="width: 60px; float: left;">
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="leftTop"
        tri-button
      >
        LT
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="left"
        tri-button
      >
        Left
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="leftBottom"
        tri-button
      >
        LB
      </button>
    </div>
    <div style="width: 60px; margin-left: 252px;">
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="rightTop"
        tri-button
      >
        RT
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="right"
        tri-button
      >
        Right
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="rightBottom"
        tri-button
      >
        RB
      </button>
    </div>
    <div style="margin-left: 60px; clear: both;">
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="bottomLeft"
        tri-button
      >
        BL
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="bottom"
        tri-button
      >
        Bottom
      </button>
      <button
        tri-popconfirm
        popconfirmTitle="Are you sure delete this task?"
        (onConfirm)="confirm()"
        (onCancel)="cancel()"
        popconfirmPlacement="bottomRight"
        tri-button
      >
        BR
      </button>
    </div>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
        margin-bottom: 8px;
        width: 70px;
        text-align: center;
        padding: 0;
      }
    `
  ]
})
export class TriDemoPopconfirmPlacementComponent {
  constructor(private nzMessageService: TriMessageService) {}

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }
}
