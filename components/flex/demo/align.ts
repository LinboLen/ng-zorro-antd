import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriAlign, TriFlexModule, TriJustify } from 'ng-zorro-antd/flex';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriFlexModule, TriSegmentedModule],
  template: `
    <div class="segment-wrapper">
      <span>Select justify:</span>
      <tri-segmented [options]="justifySegment" [(ngModel)]="selectedJustification"></tri-segmented>
    </div>

    <div class="segment-wrapper">
      <span>Select align:</span>
      <tri-segmented [options]="alignSegment" [(ngModel)]="selectedLAlignment"></tri-segmented>
    </div>

    <div class="btn-wrappers" tri-flex [justify]="selectedJustification" [align]="selectedLAlignment">
      <button tri-button type="primary">Primary</button>
      <button tri-button type="primary">Primary</button>
      <button tri-button type="primary">Primary</button>
      <button tri-button type="primary">Primary</button>
    </div>
  `,
  styles: [
    `
      .segment-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;

        margin-block-end: 1rem;
      }

      .btn-wrappers {
        block-size: 10rem;
        border: 1px solid var(--ant-primary-6);
      }
    `
  ]
})
export class TriDemoFlexAlignComponent {
  public justifySegment: TriJustify[] = [
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly'
  ];
  public alignSegment: TriAlign[] = ['flex-start', 'center', 'flex-end'];
  public selectedJustification: TriJustify = 'flex-start';
  public selectedLAlignment: TriAlign = 'flex-start';
}
