import { Component } from '@angular/core';

import { TriEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'tri-demo-empty-simple',
  imports: [TriEmptyModule],
  template: `<tri-empty notFoundImage="simple" />`
})
export class TriDemoEmptySimpleComponent {}
