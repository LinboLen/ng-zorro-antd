import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-alert-action',
  imports: [TriAlertModule, TriButtonModule, TriSpaceModule],
  template: `
    <tri-alert showIcon type="success" message="Success Text" [action]="actionTemplate1" />
    <ng-template #actionTemplate1>
      <button tri-button size="small" type="text" (click)="doAction('undo')">Undo</button></ng-template
    >
    <br />
    <tri-alert
      showIcon
      type="error"
      message="Error Text"
      [description]="descriptionTemplate1"
      [action]="actionTemplate2"
    />
    <ng-template #descriptionTemplate1>
      <p>Error Description Error Description Error Description Error Description</p>
    </ng-template>
    <ng-template #actionTemplate2>
      <button tri-button size="small" type="default" danger (click)="doAction('detail')">Detail</button>
    </ng-template>
    <br />
    <tri-alert closeable type="warning" message="Warning Text" [action]="actionTemplate3" />
    <ng-template #actionTemplate3>
      <button tri-button size="small" type="primary" ghost (click)="doAction('ignore')">Ignore</button>
    </ng-template>
    <br />
    <tri-alert
      showIcon
      type="info"
      message="Info Text"
      [description]="descriptionTemplate2"
      [action]="actionTemplate4"
    />
    <ng-template #descriptionTemplate2>
      <p>Info Description Info Description Info Description Info Description</p>
    </ng-template>
    <ng-template #actionTemplate4>
      <tri-space direction="vertical">
        <button *spaceItem tri-button size="small" type="primary" (click)="doAction('accept')">Accept</button>
        <button *spaceItem tri-button size="small" type="default" danger (click)="doAction('decline')"
          >Decline</button
        >
      </tri-space>
    </ng-template>
  `
})
export class TriDemoAlertActionComponent {
  doAction(action: string): void {
    console.log(`Do alert's action: ${action}`);
  }
}
