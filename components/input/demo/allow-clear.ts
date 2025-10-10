import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-allow-clear',
  imports: [FormsModule, TriInputModule, TriIconModule],
  template: `
    <tri-input-wrapper allowClear>
      <input tri-input [(ngModel)]="inputValue" placeholder="input with clear icon" />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper allowClear>
      <input tri-input [(ngModel)]="inputValue" placeholder="input with custom clear icon" />
      <tri-icon inputClearIcon type="close" />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper allowClear>
      <textarea tri-input [(ngModel)]="textValue" placeholder="textarea with clear icon"></textarea>
    </tri-input-wrapper>
  `
})
export class TriDemoInputAllowClearComponent {
  inputValue: string | null = null;
  textValue: string | null = null;
}
