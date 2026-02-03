import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCarouselModule } from 'ng-zorro-antd/carousel';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-carousel-position',
  imports: [FormsModule, TriCarouselModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="dotPosition">
      <label tri-radio-button value="bottom">Bottom</label>
      <label tri-radio-button value="top">Top</label>
      <label tri-radio-button value="left">Left</label>
      <label tri-radio-button value="right">Right</label>
    </tri-radio-group>
    <tri-carousel [dotPosition]="dotPosition">
      @for (index of array; track index) {
        <div tri-carousel-content>
          <h3>{{ index }}</h3>
        </div>
      }
    </tri-carousel>
  `,
  styles: `
    nz-radio-group {
      margin-bottom: 8px;
    }

    [nz-carousel-content] {
      text-align: center;
      height: 160px;
      line-height: 160px;
      background: #364d79;
      color: #fff;
      overflow: hidden;
    }

    h3 {
      color: #fff;
      margin-bottom: 0;
      user-select: none;
    }
  `
})
export class TriDemoCarouselPositionComponent {
  array = [1, 2, 3, 4];
  dotPosition = 'bottom';
}
