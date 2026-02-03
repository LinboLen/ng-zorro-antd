import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { TriPageHeaderModule } from 'ng-zorro-antd/page-header';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriStatisticModule } from 'ng-zorro-antd/statistic';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-page-header-responsive',
  imports: [TriButtonModule, TriDescriptionsModule, TriPageHeaderModule, TriSpaceModule, TriStatisticModule, TriTabsModule],
  template: `
    <tri-page-header backIcon>
      <tri-page-header-title>Title</tri-page-header-title>
      <tri-page-header-subtitle>This is a subtitle</tri-page-header-subtitle>
      <tri-page-header-extra>
        <tri-space>
          <button *spaceItem tri-button>Operation</button>
          <button *spaceItem tri-button>Operation</button>
          <button *spaceItem tri-button type="primary">Primary</button>
        </tri-space>
      </tri-page-header-extra>
      <tri-page-header-content>
        <div class="content">
          <div class="main">
            <tri-descriptions size="small" [column]="2">
              <tri-descriptions-item title="Created" [span]="1">Lili Qu</tri-descriptions-item>
              <tri-descriptions-item title="Association" [span]="1"><a>421421</a></tri-descriptions-item>
              <tri-descriptions-item title="Creation Time" [span]="1">2017-01-10</tri-descriptions-item>
              <tri-descriptions-item title="Effective Time" [span]="1">2017-10-10</tri-descriptions-item>
              <tri-descriptions-item title="Remarks" [span]="2">
                Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
              </tri-descriptions-item>
            </tri-descriptions>
          </div>
          <div class="extra">
            <div>
              <tri-statistic title="Status" value="Pending" />
              <tri-statistic title="Price" [value]="568.08" prefix="$" style="margin: 0 32px" />
            </div>
          </div>
        </div>
      </tri-page-header-content>
      <tri-page-header-footer>
        <tri-tabs [selectedIndex]="1">
          <tri-tab title="Details" />
          <tri-tab title="Rule" />
        </tri-tabs>
      </tri-page-header-footer>
    </tri-page-header>
  `,
  styles: `
    .content {
      display: flex;
    }

    .extra > div {
      display: flex;
      width: max-content;
      justify-content: flex-end;
    }

    @media (max-width: 576px) {
      .content {
        display: block;
      }

      .main {
        width: 100%;
        margin-bottom: 12px;
      }

      .extra {
        width: 100%;
        margin-left: 0;
        text-align: left;
      }
    }
  `
})
export class TriDemoPageHeaderResponsiveComponent {}
