/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  booleanAttribute
} from '@angular/core';

import {
  TriSkeletonAvatarShape,
  TriSkeletonAvatarSize,
  TriSkeletonButtonShape,
  TriSkeletonButtonSize,
  TriSkeletonInputSize
} from './skeleton.type';

@Directive({
  selector: 'tri-skeleton-element',
  host: {
    class: 'tri-skeleton ant-skeleton-element',
    '[class.tri-skeleton-active]': 'active',
    '[class.tri-skeleton-block]': 'block'
  }
})
export class TriSkeletonElementDirective {
  @Input({ transform: booleanAttribute }) active: boolean = false;
  @Input() type!: 'button' | 'input' | 'avatar' | 'image';
  @Input({ transform: booleanAttribute }) block: boolean = false;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-skeleton-element[nzType="button"]',
  template: `
    <span
      class="tri-skeleton-button"
      [class.tri-skeleton-button-square]="shape === 'square'"
      [class.tri-skeleton-button-round]="shape === 'round'"
      [class.tri-skeleton-button-circle]="shape === 'circle'"
      [class.tri-skeleton-button-lg]="size === 'large'"
      [class.tri-skeleton-button-sm]="size === 'small'"
    ></span>
  `
})
export class TriSkeletonElementButtonComponent {
  @Input() shape: TriSkeletonButtonShape = 'default';
  @Input() size: TriSkeletonButtonSize = 'default';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-skeleton-element[nzType="avatar"]',
  template: `
    <span
      class="tri-skeleton-avatar"
      [class.tri-skeleton-avatar-square]="shape === 'square'"
      [class.tri-skeleton-avatar-circle]="shape === 'circle'"
      [class.tri-skeleton-avatar-lg]="size === 'large'"
      [class.tri-skeleton-avatar-sm]="size === 'small'"
      [style]="styleMap"
    ></span>
  `
})
export class TriSkeletonElementAvatarComponent implements OnChanges {
  @Input() shape: TriSkeletonAvatarShape = 'circle';
  @Input() size: TriSkeletonAvatarSize = 'default';

  styleMap = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzSize && typeof this.size === 'number') {
      const sideLength = `${this.size}px`;
      this.styleMap = { width: sideLength, height: sideLength, 'line-height': sideLength };
    } else {
      this.styleMap = {};
    }
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-skeleton-element[nzType="input"]',
  template: `
    <span
      class="tri-skeleton-input"
      [class.tri-skeleton-input-lg]="size === 'large'"
      [class.tri-skeleton-input-sm]="size === 'small'"
    ></span>
  `
})
export class TriSkeletonElementInputComponent {
  @Input() size: TriSkeletonInputSize = 'default';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-skeleton-element[nzType="image"]',
  template: `
    <span class="tri-skeleton-image">
      <svg class="tri-skeleton-image-svg" viewBox="0 0 1098 1024" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z"
          class="tri-skeleton-image-path"
        />
      </svg>
    </span>
  `
})
export class TriSkeletonElementImageComponent {}
