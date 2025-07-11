import { Component, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

const userList = ['Lucy', 'U', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

@Component({
  selector: 'tri-demo-avatar-dynamic',
  imports: [FormsModule, TriAvatarModule, TriButtonModule, TriInputNumberModule],
  template: `
    <div>
      <label>Gap: </label>
      <tri-input-number [min]="0" [max]="16" [step]="1" [(ngModel)]="gap"></tri-input-number>
      <button tri-button (click)="change()">Change Text</button>
    </div>

    <tri-avatar [gap]="gap()" [text]="text()" size="large" [style.background-color]="color()"></tri-avatar>
  `,
  styles: [
    `
      div {
        margin-bottom: 16px;
      }
      button {
        margin-left: 8px;
      }
    `
  ]
})
export class TriDemoAvatarDynamicComponent {
  index = signal(3);
  text = computed(() => userList[this.index()]);
  color = computed(() => colorList[this.index()]);
  gap = model(4);
  change(): void {
    this.index.update(idx => (idx + 1) % userList.length);
  }
}
