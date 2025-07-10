import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <input tri-input [(ngModel)]="value" [autocomplete]="auto" status="error" />
    <br />
    <br />
    <input tri-input [(ngModel)]="value" [autocomplete]="auto" status="warning" />
    <tri-autocomplete [dataSource]="['12345', '23456', '34567']" #auto></tri-autocomplete>
  `
})
export class TriDemoAutoCompleteStatusComponent {
  value?: string;
}
