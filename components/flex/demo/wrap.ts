import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFlexModule, TriWrap } from 'ng-zorro-antd/flex';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriFlexModule, TriSegmentedModule],
  template: `
    <div class="segment-wrapper">
      <span>Select wrap:</span>
      <tri-segmented [options]="wrapSegment" [(ngModel)]="selectedWrap"></tri-segmented>
    </div>
    <div class="btn-wrapper" tri-flex [gap]="'middle'" [wrap]="selectedWrap">
      @for (_ of array; track _) {
        <button style="width: 100px" tri-button type="primary">Button {{ _ }}</button>
      }
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

      .btn-wrapper {
        overflow: auto;
        padding-block: 10px;
      }
    `
  ]
})
export class TriDemoFlexWrapComponent {
  wrapSegment: TriWrap[] = ['wrap', 'wrap-reverse', 'nowrap'];
  selectedWrap: TriWrap = 'wrap';
  array = Array.from({ length: 20 }, (_, index) => index + 1);
}
