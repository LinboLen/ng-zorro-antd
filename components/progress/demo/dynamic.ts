import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriProgressModule } from 'ng-zorro-antd/progress';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-progress-dynamic',
  imports: [TriButtonModule, TriIconModule, TriFlexModule, TriProgressModule, TriSpaceModule],
  template: `
    <div tri-flex vertical gap="small">
      <tri-progress [percent]="percent"></tri-progress>
      <tri-progress [percent]="percent" type="circle"></tri-progress>
      <tri-space-compact>
        <button tri-button (click)="decline()"><tri-icon type="minus" /></button>
        <button tri-button (click)="increase()"><tri-icon type="plus" /></button>
      </tri-space-compact>
    </div>
  `
})
export class TriDemoProgressDynamicComponent {
  percent = 0;

  increase(): void {
    this.percent = Math.min(this.percent + 10, 100);
  }

  decline(): void {
    this.percent = Math.max(this.percent - 10, 0);
  }
}
