/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
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

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriShapeSCType } from 'ng-zorro-antd/core/types';
import { generateClassName } from 'ng-zorro-antd/core/util';

import { TriFloatButtonContentComponent } from './float-button-content.component';
import { TriFloatButtonType } from './typings';

const CLASS_NAME = 'ant-float-btn';

@Component({
  selector: 'tri-float-button',
  exportAs: 'triFloatButton',
  imports: [TriButtonModule, TriFloatButtonContentComponent],
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
        <tri-float-button-content
          [icon]="icon()"
          [description]="description()"
          [shape]="shape()"
        ></tri-float-button-content>
      </a>
    } @else {
      <button
        tri-button
        [type]="type()"
        [class.tri-float-btn-default]="type() === 'default'"
        class="tri-float-btn-inner"
        (click)="onClick.emit(true)"
      >
        <tri-float-button-content
          [icon]="icon()"
          [description]="description()"
          [shape]="shape()"
        ></tri-float-button-content>
      </button>
    }
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
