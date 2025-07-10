import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: '',
  imports: [FormsModule, TriCheckboxModule],
  template: `<label tri-checkbox [(ngModel)]="checked">Checkbox</label>`
})
export class TriDemoCheckboxBasicComponent {
  checked = true;
}
