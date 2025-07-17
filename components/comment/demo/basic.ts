import { Component } from '@angular/core';

import { formatDistance } from 'date-fns';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriCommentModule } from 'ng-zorro-antd/comment';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-comment-basic',
  imports: [TriAvatarModule, TriCommentModule, TriIconModule, TriTooltipModule],
  template: `
    <tri-comment author="Han Solo" [datetime]="time">
      <tri-avatar
        tri-comment-avatar
        icon="user"
        src="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      ></tri-avatar>
      <tri-comment-content>
        <p>
          We supply a series of design principles, practical patterns and high quality design resources(Sketch and
          Axure), to help people create their product prototypes beautifully and efficiently.
        </p>
      </tri-comment-content>
      <tri-comment-action>
        <tri-icon
          tri-tooltip
          tooltipTitle="Like"
          type="like"
          [theme]="likes > 0 ? 'twotone' : 'outline'"
          (click)="like()"
        />
        <span class="count like">{{ likes }}</span>
      </tri-comment-action>
      <tri-comment-action>
        <tri-icon
          tri-tooltip
          tooltipTitle="Dislike"
          type="dislike"
          [theme]="dislikes > 0 ? 'twotone' : 'outline'"
          (click)="dislike()"
        />
        <span class="count dislike">{{ dislikes }}</span>
      </tri-comment-action>
      <tri-comment-action>Reply to</tri-comment-action>
    </tri-comment>
  `,
  styles: [
    `
      .count {
        padding-left: 8px;
        cursor: auto;
      }
      .ant-comment-rtl .count {
        padding-right: 8px;
        padding-left: 0;
      }
    `
  ]
})
export class TriDemoCommentBasicComponent {
  likes = 0;
  dislikes = 0;
  time = formatDistance(new Date(), new Date());

  like(): void {
    this.likes = 1;
    this.dislikes = 0;
  }

  dislike(): void {
    this.likes = 0;
    this.dislikes = 1;
  }
}
