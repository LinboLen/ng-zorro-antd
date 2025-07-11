import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  TRI_CAROUSEL_CUSTOM_STRATEGIES,
  TriCarouselFlipStrategy,
  TriCarouselModule,
  TriCarouselTransformNoLoopStrategy
} from 'ng-zorro-antd/carousel';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-carousel-custom',
  imports: [FormsModule, TriCarouselModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="strategy">
      <label tri-radio-button value="transform-no-loop">Transform No Loop</label>
      <label tri-radio-button value="flip">Flip</label>
      <label tri-radio-button value="fade">Fade (built-in)</label>
    </tri-radio-group>
    <tri-carousel [effect]="strategy">
      @for (index of array; track index) {
        <div tri-carousel-content>
          <h3>{{ index }}</h3>
        </div>
      }
    </tri-carousel>
  `,
  styles: [
    `
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
  ],
  providers: [
    {
      provide: TRI_CAROUSEL_CUSTOM_STRATEGIES,
      useValue: [
        { name: 'transform-no-loop', strategy: TriCarouselTransformNoLoopStrategy },
        { name: 'flip', strategy: TriCarouselFlipStrategy }
      ]
    }
  ]
})
export class TriDemoCarouselCustomComponent {
  strategy = 'transform-no-loop';
  array = [1, 2, 3, 4];
}
