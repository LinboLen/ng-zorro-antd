import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: '',
  imports: [FormsModule, TriRadioModule],
  template: `<label tri-radio ngModel>Radio</label>`
})
export class TriDemoRadioBasicComponent {}
