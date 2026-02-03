import { Component } from '@angular/core';

import { TriSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'tri-demo-spin-inside',
  imports: [TriSpinModule],
  template: `
    <div class="container">
      <tri-spin simple />
    </div>
  `,
  styles: `
    .container {
      text-align: center;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      padding: 30px 50px;
      margin: 20px 0;
    }
  `
})
export class TriDemoSpinInsideComponent {}
