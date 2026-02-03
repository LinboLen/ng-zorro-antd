/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { toCssPixel } from 'ng-zorro-antd/core/util';

import { TriSkeletonElementAvatarComponent, TriSkeletonElementDirective } from './skeleton-element.component';
import {
  TriSkeletonAvatar,
  TriSkeletonAvatarShape,
  TriSkeletonAvatarSize,
  TriSkeletonParagraph,
  TriSkeletonTitle
} from './skeleton.type';

@Component({
  selector: 'tri-skeleton',
  exportAs: 'triSkeleton',
  host: {
    class: 'tri-skeleton',
    '[class.tri-skeleton-with-avatar]': '!!avatar',
    '[class.tri-skeleton-active]': 'active',
    '[class.tri-skeleton-round]': 'round'
  },
  template: `
    @if (loading) {
      @if (!!avatar) {
        <div class="tri-skeleton-header">
          <tri-skeleton-element
            type="avatar"
            [size]="avatar.size || 'default'"
            [shape]="avatar.shape || 'circle'"
          />
        </div>
      }
      <div class="tri-skeleton-content">
        @if (!!title) {
          <h3 class="tri-skeleton-title" [style.width]="toCSSUnit(title.width)"></h3>
        }
        @if (!!paragraph) {
          <ul class="tri-skeleton-paragraph">
            @for (row of rowsList; track row) {
              <li [style.width]="toCSSUnit(widthList[$index])"></li>
            }
          </ul>
        }
      </div>
    } @else {
      <ng-content />
    }
  `,
  imports: [TriSkeletonElementDirective, TriSkeletonElementAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriSkeletonComponent implements OnInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);

  @Input({ transform: booleanAttribute }) active = false;
  @Input({ transform: booleanAttribute }) loading = true;
  @Input({ transform: booleanAttribute }) round = false;
  @Input() title: TriSkeletonTitle | boolean = true;
  @Input() avatar: TriSkeletonAvatar | boolean = false;
  @Input() paragraph: TriSkeletonParagraph | boolean = true;

  _title!: TriSkeletonTitle;
  _avatar!: TriSkeletonAvatar;
  _paragraph!: TriSkeletonParagraph;
  rowsList: number[] = [];
  widthList: Array<number | string> = [];

  protected toCSSUnit(value: number | string = ''): string {
    return toCssPixel(value);
  }

  private getTitleProps(): TriSkeletonTitle {
    const hasAvatar = !!this.avatar;
    const hasParagraph = !!this.paragraph;
    let width = '';
    if (!hasAvatar && hasParagraph) {
      width = '38%';
    } else if (hasAvatar && hasParagraph) {
      width = '50%';
    }
    return { width, ...this.getProps(this.title) };
  }

  private getAvatarProps(): TriSkeletonAvatar {
    const shape: TriSkeletonAvatarShape = !!this.title && !this.paragraph ? 'square' : 'circle';
    const size: TriSkeletonAvatarSize = 'large';
    return { shape, size, ...this.getProps(this.avatar) };
  }

  private getParagraphProps(): TriSkeletonParagraph {
    const hasAvatar = !!this.avatar;
    const hasTitle = !!this.title;
    const basicProps: TriSkeletonParagraph = {};
    // Width
    if (!hasAvatar || !hasTitle) {
      basicProps.width = '61%';
    }
    // Rows
    if (!hasAvatar && hasTitle) {
      basicProps.rows = 3;
    } else {
      basicProps.rows = 2;
    }
    return { ...basicProps, ...this.getProps(this.paragraph) };
  }

  private getProps<T>(prop: T | boolean | undefined): T | {} {
    return prop && typeof prop === 'object' ? prop : {};
  }

  private getWidthList(): Array<number | string> {
    const { width, rows } = this._paragraph;
    let widthList: Array<string | number> = [];
    if (width && Array.isArray(width)) {
      widthList = width;
    } else if (width && !Array.isArray(width)) {
      widthList = [];
      widthList[rows! - 1] = width;
    }
    return widthList;
  }

  private updateProps(): void {
    this._title = this.getTitleProps();
    this._avatar = this.getAvatarProps();
    this._paragraph = this.getParagraphProps();
    this.rowsList = [...Array(this._paragraph.rows)];
    this.widthList = this.getWidthList();
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.updateProps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzTitle || changes.nzAvatar || changes.nzParagraph) {
      this.updateProps();
    }
  }
}
