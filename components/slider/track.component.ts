/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
  numberAttribute,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';

export interface TriSliderTrackStyle {
  bottom?: string | null;
  height?: string | null;
  left?: string | null;
  right?: string | null;
  width?: string | null;
  visibility?: string;
}

@Component({
  selector: 'tri-slider-track',
  exportAs: 'triSliderTrack',
  template: `<div class="tri-slider-track" [style]="style"></div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriSliderTrackComponent implements OnChanges {
  @Input({ transform: numberAttribute }) offset: number = 0;
  @Input({ transform: booleanAttribute }) reverse: boolean = false;
  @Input() dir: Direction = 'ltr';
  @Input({ transform: numberAttribute }) length: number = 0;
  @Input({ transform: booleanAttribute }) vertical = false;
  @Input({ transform: booleanAttribute }) included = false;

  style: TriSliderTrackStyle = {};

  ngOnChanges(): void {
    const visibility = this.included ? 'visible' : 'hidden';

    if (this.vertical) {
      this.style = {
        [this.reverse ? 'top' : 'bottom']: `${this.offset}%`,
        [this.reverse ? 'bottom' : 'top']: 'auto',
        height: `${this.length}%`,
        visibility
      };
    } else {
      this.style = {
        ...this.getHorizontalStylePosition(),
        width: `${this.length}%`,
        visibility
      };
    }
  }

  private getHorizontalStylePosition(): { left: string; right: string } {
    let left = this.reverse ? 'auto' : `${this.offset}%`;
    let right = this.reverse ? `${this.offset}%` : 'auto';
    if (this.dir === 'rtl') {
      [left, right] = [right, left];
    }
    return { left, right };
  }
}
