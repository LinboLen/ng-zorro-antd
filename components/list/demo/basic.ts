import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriListModule } from 'ng-zorro-antd/list';

@Component({
  selector: '',
  imports: [TriButtonModule, TriListModule],
  template: `
    <div style="margin-bottom: 8px;">
      <button tri-button (click)="change()">Switch Data</button>
    </div>
    <tri-list itemLayout="horizontal" [loading]="loading">
      @for (item of data; track item) {
        <tri-list-item>
          <tri-list-item-meta
            avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <tri-list-item-meta-title>
              <a href="https://ng.ant.design">{{ item.title }}</a>
            </tri-list-item-meta-title>
          </tri-list-item-meta>
        </tri-list-item>
      }
      @if (data.length === 0) {
        <tri-list-empty />
      }
    </tri-list>
  `
})
export class TriDemoListBasicComponent {
  loading = false;
  data = [
    {
      title: 'Ant Design Title 1'
    },
    {
      title: 'Ant Design Title 2'
    },
    {
      title: 'Ant Design Title 3'
    },
    {
      title: 'Ant Design Title 4'
    }
  ];

  change(): void {
    this.loading = true;
    if (this.data.length > 0) {
      setTimeout(() => {
        this.data = [];
        this.loading = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.data = [
          {
            title: 'Ant Design Title 1'
          },
          {
            title: 'Ant Design Title 2'
          },
          {
            title: 'Ant Design Title 3'
          },
          {
            title: 'Ant Design Title 4'
          }
        ];
        this.loading = false;
      }, 1000);
    }
  }
}
