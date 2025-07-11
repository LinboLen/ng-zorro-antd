import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-allow-clear',
  imports: [FormsModule, TriInputModule, TriIconModule],
  template: `
    <tri-input-group [suffix]="inputClearTpl">
      <input type="text" tri-input [(ngModel)]="inputValue" placeholder="input with clear icon" />
    </tri-input-group>
    <ng-template #inputClearTpl>
      @if (inputValue) {
        <tri-icon class="tri-input-clear-icon" theme="fill" type="close-circle" (click)="inputValue = null" />
      }
    </ng-template>
    <br />
    <br />
    <tri-input-group [suffix]="textAreaClearTpl" class="tri-input-affix-wrapper-textarea-with-clear-btn">
      <textarea tri-input [(ngModel)]="textValue" placeholder="textarea with clear icon"></textarea>
    </tri-input-group>
    <ng-template #textAreaClearTpl>
      @if (textValue) {
        <tri-icon class="tri-input-clear-icon" theme="fill" type="close-circle" (click)="textValue = null" />
      }
    </ng-template>
  `
})
export class TriDemoInputAllowClearComponent {
  inputValue: string | null = null;
  textValue: string | null = null;
}
