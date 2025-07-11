import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-slider-icon-slider',
  imports: [FormsModule, TriIconModule, TriSliderModule],
  template: `
    <div class="icon-wrapper test-class">
      <tri-icon type="frown" [class.icon-highlight]="preHighLight" />
      <tri-slider [min]="0" [max]="20" [(ngModel)]="sliderValue"></tri-slider>
      <tri-icon type="smile" [class.icon-highlight]="nextHighLight" />
    </div>
  `,
  styles: [
    `
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
        left: 0;
      }

      nz-icon:last-child {
        right: 0;
      }

      .icon-highlight {
        color: rgba(0, 0, 0, 0.45);
      }
    `
  ]
})
export class TriDemoSliderIconSliderComponent implements OnInit {
  min = 0;
  max = 20;
  mid = parseFloat(((this.max - this.min) / 2).toFixed(5));
  preHighLight = false;
  nextHighLight = false;
  _sliderValue = 0;

  set sliderValue(value: number) {
    this._sliderValue = value;
    this.highlightIcon();
  }

  get sliderValue(): number {
    return this._sliderValue;
  }

  ngOnInit(): void {
    this.sliderValue = 0;
  }

  highlightIcon(): void {
    const lower = this._sliderValue >= this.mid;
    this.preHighLight = !lower;
    this.nextHighLight = lower;
  }
}
