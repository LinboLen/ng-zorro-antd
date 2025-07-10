import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { TriPageHeaderModule } from 'ng-zorro-antd/page-header';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [TriButtonModule, TriDescriptionsModule, TriPageHeaderModule, TriSpaceModule],
  template: `
    <tri-page-header backIcon [ghost]="false">
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
        <tri-descriptions size="small" [column]="3">
          <tri-descriptions-item title="Created" [span]="1">Lili Qu</tri-descriptions-item>
          <tri-descriptions-item title="Association" [span]="1"><a>421421</a></tri-descriptions-item>
          <tri-descriptions-item title="Creation Time" [span]="1">2017-01-10</tri-descriptions-item>
          <tri-descriptions-item title="Effective Time" [span]="1">2017-10-10</tri-descriptions-item>
          <tri-descriptions-item title="Remarks" [span]="2">
            Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
          </tri-descriptions-item>
        </tri-descriptions>
      </tri-page-header-content>
    </tri-page-header>
  `
})
export class TriDemoPageHeaderGhostComponent {}
