import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSelectModule, TriSelectSizeType } from 'ng-zorro-antd/select';

function alphabet(): string[] {
  const children: string[] = [];
  for (let i = 10; i < 36; i++) {
    children.push(i.toString(36) + i);
  }
  return children;
}

@Component({
  selector: 'tri-demo-select-size',
  imports: [FormsModule, TriSelectModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio-button value="large">Large</label>
      <label tri-radio-button value="default">Default</label>
      <label tri-radio-button value="small">Small</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-select [options]="options" [(ngModel)]="singleValue" [size]="size()" />
    <br />
    <br />
    <tri-select [options]="options" [(ngModel)]="singleValue" [size]="size()" showSearch />
    <br />
    <br />
    <tri-select
      [options]="options"
      [(ngModel)]="multipleValue"
      [size]="size()"
      mode="multiple"
      placeHolder="Please select"
    />
    <br />
    <br />
    <tri-select
      [options]="options"
      [(ngModel)]="tagValue"
      [size]="size()"
      mode="tags"
      placeHolder="Please select"
    />
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectSizeComponent {
  readonly options = alphabet().map(item => ({ label: item, value: item }));

  readonly size = signal<TriSelectSizeType>('default');
  readonly singleValue = signal('a10');
  readonly multipleValue = signal(['a10', 'c12']);
  readonly tagValue = signal(['a10', 'c12', 'tag']);
}
