import { Component } from '@angular/core';

import { TriEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: '',
  imports: [TriEmptyModule],
  template: `<tri-empty notFoundImage="simple"></tri-empty>`
})
export class TriDemoEmptySimpleComponent {}
