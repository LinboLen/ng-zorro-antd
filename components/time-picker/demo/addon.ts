import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriTimePickerModule],
  template: `
    <tri-time-picker [(ngModel)]="time" [addOn]="addOnTemplate" #timePicker></tri-time-picker>
    <ng-template #addOnTemplate>
      <button tri-button size="small" type="primary" (click)="timePicker.close()">Ok</button>
    </ng-template>
  `
})
export class TriDemoTimePickerAddonComponent {
  time: Date | null = null;
}
