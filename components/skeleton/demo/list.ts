import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriListModule } from 'ng-zorro-antd/list';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-skeleton-list',
  imports: [FormsModule, TriIconModule, TriListModule, TriSkeletonModule, TriSwitchModule],
  template: `
    <tri-switch [(ngModel)]="loading"></tri-switch>
    <tri-list [dataSource]="listData" [renderItem]="item" itemLayout="vertical">
      <ng-template #item let-item>
        <tri-list-item
          [content]="loading ? ' ' : item.content"
          [actions]="loading ? [] : [starAction, likeAction, msgAction]"
          [extra]="loading ? null : extra"
        >
          <tri-skeleton [loading]="loading" [active]="true" [avatar]="true">
            <ng-template #starAction>
              <tri-icon type="star-o" style="margin-right: 8px;" />
              156
            </ng-template>
            <ng-template #likeAction>
              <tri-icon type="like-o" style="margin-right: 8px;" />
              156
            </ng-template>
            <ng-template #msgAction>
              <tri-icon type="message" style="margin-right: 8px;" />
              2
            </ng-template>
            <tri-list-item-meta [avatar]="item.avatar" [title]="title" [description]="item.description">
              <ng-template #nzTitle>
                <a href="{{ item.href }}">{{ item.title }}</a>
              </ng-template>
            </tri-list-item-meta>
            <ng-template #extra>
              <img width="272" alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
            </ng-template>
          </tri-skeleton>
        </tri-list-item>
      </ng-template>
    </tri-list>
  `
})
export class TriDemoSkeletonListComponent {
  loading = true;
  listData = new Array(3).fill({}).map((_i, index) => ({
    href: 'https://ng.ant.design',
    title: `ant design part ${index}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
  }));
}
