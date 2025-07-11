import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule, TriCheckboxOption } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'tri-demo-checkbox-group',
  imports: [FormsModule, TriCheckboxModule],
  template: `
    <tri-checkbox-group [options]="options1" [(ngModel)]="value" (ngModelChange)="log($event)" />
    <br />
    <br />
    <tri-checkbox-group [options]="options2" [(ngModel)]="value" (ngModelChange)="log($event)" />
    <br />
    <br />
    <tri-checkbox-group disabled [options]="options3" [(ngModel)]="value" (ngModelChange)="log($event)" />
  `
})
export class TriDemoCheckboxGroupComponent {
  options1: TriCheckboxOption[] = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];
  options2: TriCheckboxOption[] = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange', disabled: true }
  ];
  options3: TriCheckboxOption[] = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];

  value = ['Apple'];

  log(value: string[]): void {
    console.log(value);
  }
}
