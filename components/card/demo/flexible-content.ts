import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'tri-demo-card-flexible-content',
  imports: [TriCardModule],
  template: `
    <tri-card hoverable style="width:240px" [cover]="coverTemplate">
      <tri-card-meta title="Europe Street beat" description="www.instagram.com"></tri-card-meta>
    </tri-card>
    <ng-template #coverTemplate>
      <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
    </ng-template>
  `
})
export class TriDemoCardFlexibleContentComponent {}
