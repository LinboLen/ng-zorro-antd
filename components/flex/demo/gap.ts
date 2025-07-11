import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';
import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-flex-gap',
  imports: [FormsModule, TriButtonModule, TriFlexModule, TriSegmentedModule, TriSliderModule],
  template: `
    <div class="segment-wrapper">
      <span>Select gap:</span>
      <tri-segmented [options]="gapSegment" [(ngModel)]="selectedGap"></tri-segmented>
    </div>
    @if (selectedGap === 'custom') {
      <tri-slider [min]="0" [max]="100" [(ngModel)]="customGapValue" />
    }
    <div tri-flex [gap]="selectedGap === 'custom' ? customGapValue : selectedGap">
      <button tri-button type="primary">Primary</button>
      <button tri-button type="dashed">Dashed</button>
      <button tri-button type="default">Default</button>
      <button tri-button type="link">Link</button>
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
    `
  ]
})
export class TriDemoFlexGapComponent {
  public gapSegment: string[] = ['small', 'middle', 'large', 'custom'];
  public selectedGap = 'small';
  public customGapValue = 0;
}
