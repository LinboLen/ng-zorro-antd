import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-custom-dropdown-menu',
  imports: [TriDividerModule, TriIconModule, TriInputModule, TriSelectModule],
  template: `
    <tri-select showSearch allowClear [dropdownRender]="renderTemplate" placeHolder="custom dropdown render">
      @for (item of listOfItem; track item) {
        <tri-option [label]="item" [value]="item"></tri-option>
      }
    </tri-select>
    <ng-template #renderTemplate>
      <tri-divider></tri-divider>
      <div class="container">
        <input type="text" tri-input #inputElement />
        <a class="add-item" (click)="addItem(inputElement)">
          <tri-icon type="plus" />
          Add item
        </a>
      </div>
    </ng-template>
  `,
  styles: [
    `
      nz-select {
        width: 240px;
      }
      nz-divider {
        margin: 4px 0;
      }
      .container {
        display: flex;
        flex-wrap: nowrap;
        padding: 8px;
      }
      .add-item {
        flex: 0 0 auto;
        padding: 8px;
        display: block;
      }
    `
  ]
})
export class TriDemoSelectCustomDropdownMenuComponent {
  listOfItem = ['jack', 'lucy'];
  index = 0;

  addItem(input: HTMLInputElement): void {
    const value = input.value;
    if (this.listOfItem.indexOf(value) === -1) {
      this.listOfItem = [...this.listOfItem, input.value || `New item ${this.index++}`];
    }
  }
}
