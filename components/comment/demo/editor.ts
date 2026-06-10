import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { formatDistance } from 'date-fns';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCommentModule } from 'ng-zorro-antd/comment';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriListModule } from 'ng-zorro-antd/list';

interface User {
  author: string;
  avatar: string;
}

interface Data extends User {
  content: string;
  datetime: Date;
  displayTime: string;
}

@Component({
  selector: 'tri-demo-comment-editor',
  imports: [FormsModule, TriAvatarModule, TriButtonModule, TriCommentModule, TriFormModule, TriInputModule, TriListModule],
  template: `
    @if (data().length) {
      <tri-list [dataSource]="data()" [renderItem]="item" itemLayout="horizontal">
        <ng-template #item let-item>
          <tri-comment [author]="item.author" [datetime]="item.displayTime">
            <tri-avatar tri-comment-avatar icon="user" [src]="item.avatar" />
            <tri-comment-content>
              <p>{{ item.content }}</p>
            </tri-comment-content>
          </tri-comment>
        </ng-template>
      </tri-list>
    }

    <tri-comment>
      <tri-avatar tri-comment-avatar icon="user" [src]="user.avatar" />
      <tri-comment-content>
        <tri-form-item>
          <textarea [(ngModel)]="value" tri-input rows="4"></textarea>
        </tri-form-item>
        <tri-form-item>
          <button tri-button type="primary" [loading]="submitting()" [disabled]="!value()" (click)="handleSubmit()">
            Add Comment
          </button>
        </tri-form-item>
      </tri-comment-content>
    </tri-comment>
  `
})
export class TriDemoCommentEditorComponent {
  readonly data = signal<Data[]>([]);
  readonly submitting = signal(false);
  readonly user: User = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  };
  readonly value = signal('');

  handleSubmit(): void {
    this.submitting.set(true);
    const content = this.value();
    this.value.set('');
    setTimeout(() => {
      this.submitting.set(false);
      this.data.update(data =>
        [
          ...data,
          {
            ...this.user,
            content,
            datetime: new Date(),
            displayTime: formatDistance(new Date(), new Date())
          }
        ].map(e => ({
          ...e,
          displayTime: formatDistance(new Date(), e.datetime)
        }))
      );
    }, 800);
  }
}
