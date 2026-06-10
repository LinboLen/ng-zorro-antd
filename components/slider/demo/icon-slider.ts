import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-slider-icon-slider',
  imports: [FormsModule, TriIconModule, TriSliderModule],
  template: `
    <div class="icon-wrapper">
      <tri-icon type="frown" [class.icon-highlight]="preHighLight()" />
      <tri-slider [min]="0" [max]="20" [(ngModel)]="sliderValue" />
      <tri-icon type="smile" [class.icon-highlight]="nextHighLight()" />
    </div>
  `,
  styles: `
    .icon-wrapper {
      position: relative;
      padding: 0 30px;
    }

    nz-icon {
      position: absolute;
      top: -2px;
      width: 16px;
      height: 16px;
      line-height: 1;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.25);
    }

    nz-icon:first-child {
      inset-inline-start: 0;
    }

    nz-icon:last-child {
      inset-inline-end: 0;
    }

    .icon-highlight {
      color: rgba(0, 0, 0, 0.45);
    }
  `
})
export class TriDemoSliderIconSliderComponent {
  readonly min = 0;
  readonly max = 20;
  readonly mid = parseFloat(((this.max - this.min) / 2).toFixed(5));
  readonly sliderValue = signal(0);
  readonly preHighLight = computed(() => this.sliderValue() < this.mid);
  readonly nextHighLight = computed(() => this.sliderValue() >= this.mid);
}
