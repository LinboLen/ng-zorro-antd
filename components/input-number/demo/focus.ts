import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-focus',
  imports: [FormsModule, TriInputNumberModule, TriButtonModule],
  template: `
    <button tri-button (click)="inputNumber.focus({ cursor: 'start' })">Focus at first</button>
    <button tri-button (click)="inputNumber.focus({ cursor: 'end' })">Focus at last</button>
    <button tri-button (click)="inputNumber.focus({ cursor: 'all' })">Focus to select all</button>
    <button tri-button (click)="inputNumber.focus({ preventScroll: true })"> Focus prevent scroll </button>

    <br />
    <br />

    <tri-input-number #inputNumber [(ngModel)]="value" [style.width.%]="100" />
  `
})
export class TriDemoInputNumberFocusComponent {
  value = 9999;
}
