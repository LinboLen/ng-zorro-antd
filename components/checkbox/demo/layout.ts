import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: '',
  imports: [FormsModule, TriCheckboxModule, TriGridModule],
  template: `
    <tri-checkbox-group [(ngModel)]="value" [style.width.%]="100" (ngModelChange)="log($event)">
      <tri-row>
        <tri-col span="8">
          <label tri-checkbox value="A">A</label>
        </tri-col>
        <tri-col span="8">
          <label tri-checkbox value="B">B</label>
        </tri-col>
        <tri-col span="8">
          <label tri-checkbox value="C">C</label>
        </tri-col>
        <tri-col span="8">
          <label tri-checkbox value="D">D</label>
        </tri-col>
        <tri-col span="8">
          <label tri-checkbox value="E">E</label>
        </tri-col>
      </tri-row>
    </tri-checkbox-group>
  `
})
export class TriDemoCheckboxLayoutComponent {
  value = ['A'];

  log(value: string[]): void {
    console.log(value);
  }
}
