import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriMarks, TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-grid-playground',
  imports: [FormsModule, TriGridModule, TriSliderModule],
  template: `
    <div class="slider-container">
      <span>Horizontal Gutter (px):</span>
      <div class="slider">
        <tri-slider [marks]="marksHGutter" [step]="null" [min]="8" [max]="48" [(ngModel)]="hGutter" />
      </div>
      <span>Vertical Gutter (px):</span>
      <div class="slider">
        <tri-slider [marks]="marksVGutter" [step]="null" [min]="8" [max]="48" [(ngModel)]="vGutter" />
      </div>
      <span>Column Count:</span>
      <div class="slider">
        <tri-slider
          [marks]="marksCount"
          [step]="null"
          [min]="2"
          [max]="12"
          [(ngModel)]="count"
          (ngModelChange)="reGenerateArray($event)"
        />
      </div>
    </div>

    <div class="gutter-example">
      <div tri-row [gutter]="[hGutter, vGutter]">
        @for (i of array; track $index) {
          <div tri-col class="gutter-row" [span]="24 / count">
            <div class="grid-config">Column</div>
          </div>
        }

        @for (i of array; track $index) {
          <div tri-col class="gutter-row" [span]="24 / count">
            <div class="grid-config">Column</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .slider {
      width: 50%;
    }
    .slider-container {
      margin-bottom: 16px;
    }
    .grid-config {
      height: 120px;
      font-size: 14px;
      line-height: 120px;
      background: #0092ff;
      border-radius: 4px;
    }
  `
})
export class TriDemoGridPlaygroundComponent {
  hGutter = 16;
  vGutter = 16;
  count = 4;
  array = new Array(this.count);
  marksHGutter: TriMarks = {
    8: '8',
    16: '16',
    24: '24',
    32: '32',
    40: '40',
    48: '48'
  };
  marksVGutter: TriMarks = {
    8: '8',
    16: '16',
    24: '24',
    32: '32',
    40: '40',
    48: '48'
  };
  marksCount: TriMarks = {
    2: '2',
    3: '3',
    4: '4',
    6: '6',
    8: '8',
    12: '12'
  };
  reGenerateArray(count: number): void {
    this.array = new Array(count);
  }
}
