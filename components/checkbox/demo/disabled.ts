import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: '',
  imports: [FormsModule, TriCheckboxModule],
  template: `
    <label tri-checkbox disabled [ngModel]="false"></label>
    <br />
    <label tri-checkbox disabled [ngModel]="true"></label>
  `
})
export class TriDemoCheckboxDisabledComponent {}
