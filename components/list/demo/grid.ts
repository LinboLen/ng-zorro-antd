import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriListModule } from 'ng-zorro-antd/list';

@Component({
  selector: 'tri-demo-list-grid',
  imports: [TriCardModule, TriGridModule, TriListModule],
  template: `
    <tri-list grid>
      <div tri-row [gutter]="16">
        @for (item of data; track item) {
          <div tri-col [span]="6">
            <tri-list-item>
              <tri-card [title]="item.title">Card content</tri-card>
            </tri-list-item>
          </div>
        }
      </div>
    </tri-list>
  `
})
export class TriDemoListGridComponent {
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
    }
  ];
}
