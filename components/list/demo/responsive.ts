import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriListModule } from 'ng-zorro-antd/list';

@Component({
  selector: 'tri-demo-list-responsive',
  imports: [TriCardModule, TriGridModule, TriListModule],
  template: `
    <tri-list grid>
      <div tri-row [gutter]="16">
        @for (item of data; track item) {
          <div tri-col [xXl]="8" [xl]="4" [lg]="6" [md]="6" [sm]="12" [xs]="24">
            <tri-list-item>
              <tri-card [title]="item.title">Card content</tri-card>
            </tri-list-item>
          </div>
        }
      </div>
    </tri-list>
  `
})
export class TriDemoListResponsiveComponent {
  data = [
    {
      title: 'Title 1'
    },
    {
      title: 'Title 2'
    },
    {
      title: 'Title 3'
    },
    {
      title: 'Title 4'
    },
    {
      title: 'Title 5'
    },
    {
      title: 'Title 6'
    }
  ];
}
