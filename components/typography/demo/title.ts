import { Component } from '@angular/core';

import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: '',
  imports: [TriTypographyModule],
  template: `
    <h1 tri-typography>h1. Ant Design</h1>
    <h2 tri-typography>h2. Ant Design</h2>
    <h3 tri-typography>h3. Ant Design</h3>
    <h4 tri-typography>h4. Ant Design</h4>
    <h5 tri-typography>h5. Ant Design</h5>
  `
})
export class TriDemoTypographyTitleComponent {}
