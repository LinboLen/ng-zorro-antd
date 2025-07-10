import { Component } from '@angular/core';

import { TriPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  selector: '',
  imports: [TriPageHeaderModule],
  template: `
    <tri-page-header (back)="onBack()" backIcon title="Title" subtitle="This is a subtitle"></tri-page-header>
  `
})
export class TriDemoPageHeaderBasicComponent {
  onBack(): void {
    console.log('onBack');
  }
}
