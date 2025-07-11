import { Component } from '@angular/core';

import { TriEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'tri-demo-empty-description',
  imports: [TriEmptyModule],
  template: `<tri-empty [notFoundContent]="null"></tri-empty>`
})
export class TriDemoEmptyDescriptionComponent {}
