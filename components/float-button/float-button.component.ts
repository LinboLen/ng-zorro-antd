/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  TemplateRef
} from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriShapeSCType } from 'ng-zorro-antd/core/types';
import { generateClassName } from 'ng-zorro-antd/core/util';

import { TriFloatButtonContentComponent } from './float-button-content.component';
import { TriFloatButtonBadge, TriFloatButtonType } from './typings';

const CLASS_NAME = 'ant-float-btn';

@Component({
  selector: 'tri-float-button',
  exportAs: 'triFloatButton',
  imports: [TriButtonModule, TriFloatButtonContentComponent, TriBadgeModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!!href()) {
      <a
        [target]="target()"
        [href]="href()"
        tri-button
        [type]="type()"
        [class.tri-float-btn-default]="type() === 'default'"
        class="tri-float-btn-inner"
        (click)="onClick.emit(true)"
      >
        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
      </a>
    } @else {
      <button
        tri-button
        [type]="type()"
        [class.tri-float-btn-default]="type() === 'default'"
        class="tri-float-btn-inner"
        (click)="onClick.emit(true)"
      >
        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
      </button>
    }
    <ng-template #contentTemplate>
      <tri-float-button-content
        [badge]="badge()"
        [icon]="icon()"
        [description]="description()"
        [shape]="shape()"
      ></tri-float-button-content>
    </ng-template>
  `,
  host: {
    '[class]': 'class()'
  }
})
export class TriFloatButtonComponent {
  readonly href = input<string | null>(null);
  readonly target = input<string | null>(null);
  readonly type = input<TriFloatButtonType>('default');
  readonly icon = input<string | TemplateRef<void> | null>(null);
  readonly description = input<string | TemplateRef<void> | null>(null);
  readonly shape = input<TriShapeSCType>('circle');
  readonly badge = input<TriFloatButtonBadge | null>(null);
  readonly onClick = output<boolean>();

  readonly _shape = linkedSignal(() => this.shape());
  protected readonly dir = inject(Directionality).valueSignal;
  protected readonly class = computed<string[]>(() => {
    const dir = this.dir();
    const classes = [CLASS_NAME, this.generateClass(this._shape())];
    if (dir === 'rtl') {
      classes.push(this.generateClass(dir));
    }
    return classes;
  });

  private generateClass(suffix: string): string {
    return generateClassName(CLASS_NAME, suffix);
  }
}
