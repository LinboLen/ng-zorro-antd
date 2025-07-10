/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  inject,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

import {
  TriListItemMetaAvatarComponent,
  TriListItemMetaDescriptionComponent,
  TriListItemMetaDescriptionComponent as DescriptionComponent,
  TriListItemMetaTitleComponent,
  TriListItemMetaTitleComponent as TitleComponent
} from './list-item-meta-cell';

@Component({
  selector: '',
  exportAs: 'triListItemMeta',
  template: `
    <!--Old API Start-->
    @if (avatarStr) {
      <tri-list-item-meta-avatar [src]="avatarStr" />
    }

    @if (avatarTpl) {
      <tri-list-item-meta-avatar>
        <ng-container [ngTemplateOutlet]="avatarTpl" />
      </tri-list-item-meta-avatar>
    }

    <!--Old API End-->

    <ng-content select="nz-list-item-meta-avatar" />

    @if (title || description || descriptionComponent || titleComponent) {
      <div class="tri-list-item-meta-content">
        <!--Old API Start-->

        @if (title && !titleComponent) {
          <tri-list-item-meta-title>
            <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
          </tri-list-item-meta-title>
        }

        @if (description && !descriptionComponent) {
          <tri-list-item-meta-description>
            <ng-container *stringTemplateOutlet="description">{{ description }}</ng-container>
          </tri-list-item-meta-description>
        }
        <!--Old API End-->

        <ng-content select="nz-list-item-meta-title" />
        <ng-content select="nz-list-item-meta-description" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-list-item-meta'
  },
  imports: [
    TriListItemMetaAvatarComponent,
    NgTemplateOutlet,
    TriListItemMetaTitleComponent,
    TriOutletModule,
    TriListItemMetaDescriptionComponent
  ]
})
export class TriListItemMetaComponent {
  public readonly elementRef = inject(ElementRef);

  avatarStr = '';
  avatarTpl?: TemplateRef<void>;

  @Input()
  set avatar(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this.avatarStr = '';
      this.avatarTpl = value;
    } else {
      this.avatarStr = value;
    }
  }

  @Input() title?: string | TemplateRef<void>;

  @Input() description?: string | TemplateRef<void>;

  @ContentChild(DescriptionComponent) descriptionComponent?: DescriptionComponent;
  @ContentChild(TitleComponent) titleComponent?: TitleComponent;
}
