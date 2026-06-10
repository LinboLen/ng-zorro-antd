import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-status',
  imports: [FormsModule, TriAutocompleteModule, TriFlexModule, TriInputModule],
  template: `
    <tri-flex vertical gap="1rem">
      <input tri-input [(ngModel)]="value" [autocomplete]="auto" status="error" />
      <input tri-input [(ngModel)]="value" [autocomplete]="auto" status="warning" />
    </tri-flex>
    <tri-autocomplete [dataSource]="['12345', '23456', '34567']" #auto />
  `
})
export class TriDemoAutoCompleteStatusComponent {
  value?: string;
}
