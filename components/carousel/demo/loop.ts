import { Component } from '@angular/core';

import { TriCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
  selector: 'tri-demo-carousel-loop',
  imports: [TriCarouselModule],
  template: `
    <tri-carousel autoPlay [effect]="effect" [loop]="false">
      @for (index of array; track index) {
        <div tri-carousel-content>
          <h3>{{ index }}</h3>
        </div>
      }
    </tri-carousel>
  `,
  styles: `
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
export class TriDemoCarouselLoopComponent {
  array = [1, 2, 3, 4];
  effect = 'scrollx';
}
