import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';
import { TriListModule } from 'ng-zorro-antd/list';

@Component({
  selector: '',
  imports: [TriButtonModule, TriDescriptionsModule, TriDividerModule, TriDrawerModule, TriListModule],
  template: `
    <tri-list [dataSource]="data" [renderItem]="item" [itemLayout]="'horizontal'">
      <ng-template #item let-item>
        <tri-list-item [actions]="[viewAction]">
          <ng-template #viewAction>
            <a (click)="open()">View Profile</a>
          </ng-template>
          <tri-list-item-meta
            [title]="title"
            avatar="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
            description="Progresser AFX"
          >
            <ng-template #nzTitle>
              <a href="https://ng.ant.design">{{ item.name }}</a>
            </ng-template>
          </tri-list-item-meta>
        </tri-list-item>
      </ng-template>
    </tri-list>
    <tri-drawer [visible]="visible" [width]="640" [closable]="false" (onClose)="close()">
      <ng-container *drawerContent>
        <p class="title">User Profile</p>
        <tri-descriptions [column]="2" title="Personal">
          <tri-descriptions-item title="Full Name" [span]="1">Lily</tri-descriptions-item>
          <tri-descriptions-item title="Account" [span]="1">AntDesign&#64;example.com</tri-descriptions-item>
          <tri-descriptions-item title="City" [span]="1">HangZhou</tri-descriptions-item>
          <tri-descriptions-item title="Country" [span]="1">China🇨🇳</tri-descriptions-item>
          <tri-descriptions-item title="Birthday" [span]="1">February 2,1900</tri-descriptions-item>
          <tri-descriptions-item title="Website" [span]="1">-</tri-descriptions-item>
          <tri-descriptions-item title="Message" [span]="2">
            Make things as simple as possible but no simpler.
          </tri-descriptions-item>
        </tri-descriptions>
        <tri-divider></tri-divider>
        <tri-descriptions [column]="2" title="Company">
          <tri-descriptions-item title="Position" [span]="1">Programmer</tri-descriptions-item>
          <tri-descriptions-item title="Responsibilities" [span]="1">Coding</tri-descriptions-item>
          <tri-descriptions-item title="Department" [span]="1">AFX</tri-descriptions-item>
          <tri-descriptions-item title="Supervisor" [span]="1">Lin</tri-descriptions-item>
          <tri-descriptions-item title="Skills" [span]="2">
            C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler
            theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java,
            ASP, etc.
          </tri-descriptions-item>
        </tri-descriptions>
        <tri-divider></tri-divider>
        <tri-descriptions [column]="2" title="Contacts">
          <tri-descriptions-item title="Email" [span]="1">AntDesign&#64;example.com</tri-descriptions-item>
          <tri-descriptions-item title="Phone Number" [span]="1">+86 181 0000 0000</tri-descriptions-item>
          <tri-descriptions-item title="Github" [span]="2">
            <a href="https://github.com/NG-ZORRO/ng-zorro-antd" target="_blank">github.com/NG-ZORRO/ng-zorro-antd</a>
          </tri-descriptions-item>
        </tri-descriptions>
      </ng-container>
    </tri-drawer>
  `,
  styles: [
    `
      .title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        display: block;
        margin-bottom: 24px;
      }
    `
  ]
})
export class TriDemoDrawerUserProfileComponent {
  data = [
    {
      name: 'Lily'
    },
    {
      name: 'Lily'
    }
  ];

  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
