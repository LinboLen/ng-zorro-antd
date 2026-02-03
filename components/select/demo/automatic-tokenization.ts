import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

function alphabet(): string[] {
  const children: string[] = [];
  for (let i = 10; i < 36; i++) {
    children.push(i.toString(36) + i);
  }
  return children;
}

@Component({
  selector: 'tri-demo-select-automatic-tokenization',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      [(ngModel)]="listOfTagOptions"
      mode="tags"
      [tokenSeparators]="[',']"
      placeHolder="automatic tokenization"
    >
      @for (option of listOfOption; track option.value) {
        <tri-option [label]="option.label" [value]="option.value" />
      }
    </tri-select>
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectAutomaticTokenizationComponent {
  readonly listOfOption: Array<{ label: string; value: string }> = alphabet().map(item => ({
    label: item,
    value: item
  }));
  listOfTagOptions: string[] = [];
}
