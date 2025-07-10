import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriCronExpressionModule, TriDropDownModule, TriIconModule],
  template: `
    <tri-cron-expression
      [extra]="shortcuts"
      [(ngModel)]="value"
      (ngModelChange)="getValue($event)"
    ></tri-cron-expression>
    <ng-template #shortcuts>
      <button tri-button tri-dropdown [dropdownMenu]="menu">
        Shortcuts
        <tri-icon type="down" />
      </button>
      <tri-dropdown-menu #menu="nzDropdownMenu">
        <ul tri-menu selectable>
          @for (item of options; track item.value) {
            <li tri-menu-item [value]="item.value" (click)="setValue(item.value)">{{ item.label }}</li>
          }
        </ul>
      </tri-dropdown-menu>
    </ng-template>
    <p>cron: {{ cron }} </p>
  `
})
export class TriDemoCronExpressionShortcutsComponent {
  value: string = '1 1 * * *';
  cron: string = '';
  options = [
    {
      label: 'Every hour',
      value: '0 0-23/1 * * *'
    },
    {
      label: 'Every day at eight',
      value: '0 8 * * *'
    },
    {
      label: 'Every Friday',
      value: '0 0 * * 5'
    }
  ];

  setValue(value: string): void {
    this.value = value;
  }

  getValue(value: string): void {
    this.cron = value;
  }
}
