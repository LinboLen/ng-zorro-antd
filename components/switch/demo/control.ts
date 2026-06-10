import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-switch-control',
  imports: [FormsModule, TriSwitchModule],
  template: `<tri-switch [(ngModel)]="value" control (click)="clickSwitch()" [loading]="loading()" />`
})
export class TriDemoSwitchControlComponent {
  readonly value = signal(false);
  readonly loading = signal(false);

  clickSwitch(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    setTimeout(() => {
      this.value.update(value => !value);
      this.loading.set(false);
    }, 3000);
  }
}
