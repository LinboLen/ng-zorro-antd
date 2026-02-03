import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-addon',
  imports: [FormsModule, TriButtonModule, TriTimePickerModule],
  template: `
    <tri-time-picker [(ngModel)]="time" [addOn]="addOnTemplate" #timePicker />
    <ng-template #addOnTemplate>
      <button tri-button size="small" type="primary" (click)="timePicker.close()">Ok</button>
    </ng-template>
  `
})
export class TriDemoTimePickerAddonComponent {
  time: Date | null = null;
}
