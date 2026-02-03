import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriListModule } from 'ng-zorro-antd/list';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-drawer-multi-level-drawer',
  imports: [TriButtonModule, TriDrawerModule, TriFormModule, TriInputModule, TriListModule, TriTagModule],
  template: `
    <button tri-button type="primary" (click)="open()">New Cookbook</button>
    <tri-drawer
      [closable]="false"
      [offsetX]="childrenVisible ? 180 : 0"
      [width]="320"
      [visible]="visible"
      title="Cookbook"
      (onClose)="close()"
    >
      <form *drawerContent tri-form>
        <div tri-row>
          <div tri-col span="24">
            <tri-form-item>
              <tri-form-label>Name</tri-form-label>
              <tri-form-control>
                <input tri-input placeholder="please enter cookbook name" />
              </tri-form-control>
            </tri-form-item>
          </div>
        </div>
        <div tri-row>
          <div tri-col span="24">
            <tri-form-item>
              <tri-form-label>Food</tri-form-label>
              <tri-form-control>
                <tri-tag>potato</tri-tag>
                <tri-tag>eggplant</tri-tag>
                <tri-tag (click)="openChildren()">+</tri-tag>
              </tri-form-control>
            </tri-form-item>
          </div>
        </div>
      </form>
      <tri-drawer [closable]="false" [visible]="childrenVisible" title="Food" (onClose)="closeChildren()">
        <tri-list *drawerContent [dataSource]="vegetables" [renderItem]="item">
          <ng-template #item let-item>
            <tri-list-item [content]="item" />
          </ng-template>
        </tri-list>
      </tri-drawer>
    </tri-drawer>
  `
})
export class TriDemoDrawerMultiLevelDrawerComponent {
  visible = false;
  childrenVisible = false;

  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  openChildren(): void {
    this.childrenVisible = true;
  }

  closeChildren(): void {
    this.childrenVisible = false;
  }
}
