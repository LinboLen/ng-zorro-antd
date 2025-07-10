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
  selector: '',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select mode="tags" placeHolder="Tag Mode" [(ngModel)]="listOfTagOptions">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option"></tri-option>
      }
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectTagsComponent {
  readonly listOfOption: string[] = alphabet();
  listOfTagOptions: string[] = [];
}
