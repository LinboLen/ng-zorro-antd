import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule],
  template: `
    <button tri-button type="primary" loading>
      <tri-icon type="poweroff" />
      Loading
    </button>
    <button tri-button type="primary" size="small" loading>Loading</button>
    <br />
    <button tri-button type="primary" (click)="loadOne()" [loading]="isLoadingOne">Click me!</button>
    <button tri-button type="primary" (click)="loadTwo()" [loading]="isLoadingTwo">
      <tri-icon type="poweroff" />
      Click me!
    </button>
    <br />
    <button tri-button loading shape="circle"></button>
    <button tri-button loading type="primary" shape="circle"></button>
  `,
  styles: [
    `
      [nz-button] {
        margin-right: 8px;
        margin-bottom: 12px;
      }
    `
  ]
})
export class TriDemoButtonLoadingComponent {
  isLoadingOne = false;
  isLoadingTwo = false;

  loadOne(): void {
    this.isLoadingOne = true;
    setTimeout(() => {
      this.isLoadingOne = false;
    }, 5000);
  }

  loadTwo(): void {
    this.isLoadingTwo = true;
    setTimeout(() => {
      this.isLoadingTwo = false;
    }, 5000);
  }
}
