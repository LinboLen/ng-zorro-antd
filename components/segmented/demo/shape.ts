import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-shape',
  imports: [TriSegmentedModule, FormsModule],
  template: `
    <tri-segmented [options]="optionsSize" [(ngModel)]="currentSize" />
    <tri-segmented [options]="options" shape="round" [size]="currentSize()" />
  `,
  styles: `
    nz-segmented:first-child {
      display: block;
      width: fit-content;
      margin-bottom: 16px;
    }
  `
})
export class TriDemoSegmentedShapeComponent {
  currentSize = model<TriSizeLDSType>('default');

  optionsSize = [
    { value: 'small', label: 'Small' },
    { value: 'default', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];
  options = [
    { value: 'List', icon: 'bars' },
    { value: 'Kanban', icon: 'appstore' }
  ];
}
