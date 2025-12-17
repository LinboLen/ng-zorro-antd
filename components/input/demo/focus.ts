import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputDirective, TriInputModule } from 'ng-zorro-antd/input';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-input-focus',
  imports: [FormsModule, TriInputModule, TriButtonModule, TriSwitchModule],
  template: `
    <button tri-button (click)="input.focus({ cursor: 'start' })">Focus at first</button>
    <button tri-button (click)="input.focus({ cursor: 'end' })">Focus at last</button>
    <button tri-button (click)="input.focus({ cursor: 'all' })">Focus to select all</button>
    <button tri-button (click)="input.focus({ preventScroll: true })"> Focus prevent scroll </button>

    <br />
    <tri-switch [(ngModel)]="inputElem" checkedChildren="input" unCheckedChildren="textarea" />
    <br />
    <br />

    @if (inputElem) {
      <input #input="nzInput" tri-input [(ngModel)]="value" />
    } @else {
      <textarea #input="nzInput" tri-input rows="2" [(ngModel)]="value"> </textarea>
    }
  `
})
export class TriDemoInputFocusComponent {
  value = 'NG-ZORRO love you!';
  inputElem = true;

  @ViewChild(TriInputDirective) input!: TriInputDirective;
}
