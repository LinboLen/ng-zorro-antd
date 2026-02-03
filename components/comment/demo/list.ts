import { Component } from '@angular/core';

import { addDays, formatDistance } from 'date-fns';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriCommentModule } from 'ng-zorro-antd/comment';
import { TriListModule } from 'ng-zorro-antd/list';

@Component({
  selector: 'tri-demo-comment-list',
  imports: [TriAvatarModule, TriCommentModule, TriListModule],
  template: `
    <tri-list [dataSource]="data" [renderItem]="item" itemLayout="horizontal">
      <ng-template #item let-item>
        <tri-comment [author]="item.author" [datetime]="item.datetime">
          <tri-avatar tri-comment-avatar icon="user" [src]="item.avatar" />
          <tri-comment-content>
            <p>{{ item.content }}</p>
          </tri-comment-content>
          <tri-comment-action>Reply to</tri-comment-action>
        </tri-comment>
      </ng-template>
    </tri-list>
  `
})
export class TriDemoCommentListComponent {
  data = [
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: formatDistance(new Date(), addDays(new Date(), 1))
    },
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: formatDistance(new Date(), addDays(new Date(), 2))
    }
  ];
}
