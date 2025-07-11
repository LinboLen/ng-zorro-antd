import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'tri-demo-checkbox-layout-legacy',
  imports: [FormsModule, TriCheckboxModule, TriGridModule],
  template: `
    <tri-checkbox-wrapper style="width: 100%;" (onChange)="log($event)">
      <tri-row>
        <tri-col span="8">
          <label tri-checkbox value="A" [ngModel]="true">A</label>
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
    </tri-checkbox-wrapper>
  `
})
export class TriDemoCheckboxLayoutLegacyComponent {
  value = ['A'];

  log(value: string[]): void {
    console.log(value);
  }
}
