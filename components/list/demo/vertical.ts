import { Component, OnInit } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriListModule } from 'ng-zorro-antd/list';

interface ItemData {
  href: string;
  title: string;
  avatar: string;
  description: string;
  content: string;
}

@Component({
  selector: '',
  imports: [TriIconModule, TriListModule],
  template: `
    <tri-list itemLayout="vertical">
      @for (item of data; track item) {
        <tri-list-item>
          <tri-list-item-meta>
            <tri-list-item-meta-avatar [src]="item.avatar"></tri-list-item-meta-avatar>
            <tri-list-item-meta-title>
              <a href="{{ item.href }}">{{ item.title }}</a>
            </tri-list-item-meta-title>
            <tri-list-item-meta-description>
              {{ item.description }}
            </tri-list-item-meta-description>
          </tri-list-item-meta>
          {{ item.content }}
          <ul tri-list-item-actions>
            <tri-list-item-action>
              <tri-icon type="star-o" style="margin-right: 8px;" />
              156
            </tri-list-item-action>
            <tri-list-item-action>
              <tri-icon type="star-o" style="margin-right: 8px;" />
              156
            </tri-list-item-action>
            <tri-list-item-action>
              <tri-icon type="star-o" style="margin-right: 8px;" />
              2
            </tri-list-item-action>
          </ul>
          <tri-list-item-extra>
            <img width="272" alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
          </tri-list-item-extra>
        </tri-list-item>
      }
    </tri-list>
  `
})
export class TriDemoListVerticalComponent implements OnInit {
  data: ItemData[] = [];

  ngOnInit(): void {
    this.loadData(1);
  }

  loadData(pi: number): void {
    this.data = new Array(5).fill({}).map((_, index) => ({
      href: 'https://ant.design',
      title: `ant design part ${index} (page: ${pi})`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources ' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    }));
  }
}
