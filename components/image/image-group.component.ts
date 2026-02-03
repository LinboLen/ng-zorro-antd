/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { TriImageDirective } from './image.directive';

@Component({
  selector: 'tri-image-group',
  exportAs: 'triImageGroup',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriImageGroupComponent {
  @Input() scaleStep: number | null = null;

  images: TriImageDirective[] = [];

  addImage(image: TriImageDirective): void {
    this.images.push(image);
  }
}
