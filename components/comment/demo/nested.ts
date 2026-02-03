import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriCommentModule } from 'ng-zorro-antd/comment';

@Component({
  selector: 'tri-demo-comment-nested',
  imports: [NgTemplateOutlet, TriAvatarModule, TriCommentModule],
  template: `
    <ng-template #commentTemplateRef let-comment="comment">
      <tri-comment [author]="comment.author">
        <tri-avatar tri-comment-avatar icon="user" [src]="comment.avatar" />
        <tri-comment-content>
          <p>{{ comment.content }}</p>
        </tri-comment-content>
        <tri-comment-action>Reply to</tri-comment-action>
        @if (comment.children && comment.children.length) {
          @for (child of comment.children; track child) {
            <ng-template [ngTemplateOutlet]="commentTemplateRef" [ngTemplateOutletContext]="{ comment: child }" />
          }
        }
      </tri-comment>
    </ng-template>

    <ng-template [ngTemplateOutlet]="commentTemplateRef" [ngTemplateOutletContext]="{ comment: data }" />
  `
})
export class TriDemoCommentNestedComponent {
  data = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    children: [
      {
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources' +
          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        children: [
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
          },
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
          }
        ]
      }
    ]
  };
}
