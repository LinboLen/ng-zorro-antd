import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-switch-control',
  imports: [FormsModule, TriSwitchModule],
  template: ` <tri-switch [(ngModel)]="switchValue" [control]="true" (click)="clickSwitch()" [loading]="loading" /> `
})
export class TriDemoSwitchControlComponent {
  switchValue = false;
  loading = false;

  clickSwitch(): void {
    if (!this.loading) {
      this.loading = true;
      setTimeout(() => {
        this.switchValue = !this.switchValue;
        this.loading = false;
      }, 3000);
    }
  }
}
