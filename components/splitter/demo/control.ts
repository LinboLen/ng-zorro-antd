import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriSplitterModule } from 'ng-zorro-antd/splitter';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-splitter-control',
  imports: [FormsModule, TriButtonModule, TriFlexModule, TriSplitterModule, TriSwitchModule],
  template: `
    <tri-flex gap="middle" vertical>
      <tri-splitter (resize)="setSizes($event)">
        <tri-splitter-panel [size]="sizes()[0]" [resizable]="resizable()">
          <div class="box">First</div>
        </tri-splitter-panel>
        <tri-splitter-panel [size]="sizes()[1]">
          <div class="box">Second</div>
        </tri-splitter-panel>
      </tri-splitter>
      <tri-flex justify="space-between">
        <tri-switch checkedChildren="Enabled" unCheckedChildren="Disabled" [(ngModel)]="resizable" />
        <button tri-button (click)="sizes.set(['50%', '50%'])">Reset</button>
      </tri-flex>
    </tri-flex>
  `,
  styles: `
    nz-splitter {
      height: 200px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .box {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `
})
export class TriDemoSplitterControlComponent {
  resizable = model(true);
  sizes = signal<Array<number | string>>(['50%', '50%']);

  setSizes(sizes: Array<number | string>): void {
    console.log('output', sizes);
    this.sizes.set(sizes);
  }
}
