import { Component } from '@angular/core';
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
  selector: '',
  imports: [FormsModule, TriAvatarModule, TriButtonModule, TriCommentModule, TriFormModule, TriInputModule, TriListModule],
  template: `
    @if (data.length) {
      <tri-list [dataSource]="data" [renderItem]="item" itemLayout="horizontal">
        <ng-template #item let-item>
          <tri-comment [author]="item.author" [datetime]="item.displayTime">
            <tri-avatar tri-comment-avatar icon="user" [src]="item.avatar"></tri-avatar>
            <tri-comment-content>
              <p>{{ item.content }}</p>
            </tri-comment-content>
          </tri-comment>
        </ng-template>
      </tri-list>
    }

    <tri-comment>
      <tri-avatar tri-comment-avatar icon="user" [src]="user.avatar"></tri-avatar>
      <tri-comment-content>
        <tri-form-item>
          <textarea [(ngModel)]="inputValue" tri-input rows="4"></textarea>
        </tri-form-item>
        <tri-form-item>
          <button tri-button type="primary" [loading]="submitting" [disabled]="!inputValue" (click)="handleSubmit()">
            Add Comment
          </button>
        </tri-form-item>
      </tri-comment-content>
    </tri-comment>
  `
})
export class TriDemoCommentEditorComponent {
  data: Data[] = [];
  submitting = false;
  user: User = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  };
  inputValue = '';

  handleSubmit(): void {
    this.submitting = true;
    const content = this.inputValue;
    this.inputValue = '';
    setTimeout(() => {
      this.submitting = false;
      this.data = [
        ...this.data,
        {
          ...this.user,
          content,
          datetime: new Date(),
          displayTime: formatDistance(new Date(), new Date())
        }
      ].map(e => ({
        ...e,
        displayTime: formatDistance(new Date(), e.datetime)
      }));
    }, 800);
  }
}
