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
  contentChildren,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  TemplateRef
} from '@angular/core';

import { fadeMotion } from 'ng-zorro-antd/core/animation';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriFloatButtonTopComponent } from './float-button-top.component';
import { TriFloatButtonComponent } from './float-button.component';

@Component({
  selector: 'tri-float-button-group',
  exportAs: 'triFloatButtonGroup',
  imports: [TriFloatButtonComponent, TriIconModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeMotion],
  template: `
    @if (!isMenuMode()) {
      <ng-container *ngTemplateOutlet="menu"></ng-container>
    } @else {
      @if (open()) {
        <div class="tri-float-btn-group-wrap" @fadeMotion><ng-container *ngTemplateOutlet="menu"></ng-container></div>
      }
      <tri-float-button
        class="tri-float-btn-group-trigger"
        [type]="type()"
        [icon]="open() ? close : icon()"
        [shape]="shape()"
        [description]="open() ? null : description()"
        (onClick)="open() ? clickCloseMenu() : clickOpenMenu()"
        (mouseover)="hoverOpenMenu()"
      ></tri-float-button>
    }
    <ng-template #menu><ng-content></ng-content></ng-template>
    <ng-template #close>
      <tri-icon type="close" theme="outline" />
    </ng-template>
  `,
  host: {
    '[class]': 'class()',
    '(mouseleave)': 'hoverCloseMenu()'
  }
})
export class TriFloatButtonGroupComponent {
  readonly floatButtonComponents = contentChildren(TriFloatButtonComponent);
  readonly floatButtonTopComponents = contentChildren(TriFloatButtonTopComponent);

  readonly href = input<string | null>(null);
  readonly target = input<string | null>(null);
  readonly type = input<'default' | 'primary'>('default');
  readonly icon = input<TemplateRef<void> | null>(null);
  readonly description = input<TemplateRef<void> | null>(null);
  readonly shape = input<'circle' | 'square'>('circle');
  readonly trigger = input<'click' | 'hover' | null>(null);
  readonly open = input<boolean | null>(null);
  readonly placement = input<'top' | 'right' | 'bottom' | 'left'>('top');
  readonly onOpenChange = output<boolean>();

  protected dir = inject(Directionality).valueSignal;
  protected _open = linkedSignal<boolean>(() => !!this.open());
  protected isMenuMode = computed(() => !!this.trigger() && ['click', 'hover'].includes(this.trigger() as string));
  protected isControlledMode = computed(() => this.open() !== null);
  protected class = computed<string[]>(() => {
    const shape = this.shape();
    const dir = this.dir();
    const classes = ['ant-float-btn-group', this.generateClass(shape)];
    if (!this.isMenuMode()) {
      classes.push(this.generateClass(`${shape}-shadow`));
    } else {
      classes.push(this.generateClass(this.placement()));
    }
    if (dir === 'rtl') {
      classes.push(this.generateClass(dir));
    }
    return classes;
  });

  constructor() {
    effect(() => {
      if (this.floatButtonComponents()) {
        this.floatButtonComponents().forEach(item => {
          item.shape = this.shape();
        });
      }
      if (this.floatButtonTopComponents()) {
        this.floatButtonTopComponents().forEach(item => {
          item.shape = this.shape();
          item.detectChanges();
        });
      }
    });
  }

  clickOpenMenu(): void {
    this.handleEvent('click', true);
  }

  hoverOpenMenu(): void {
    this.handleEvent('hover', true);
  }

  clickCloseMenu(): void {
    this.handleEvent('click', false);
  }

  hoverCloseMenu(): void {
    this.handleEvent('hover', false);
  }

  private handleEvent(type: 'click' | 'hover', isOpen: boolean): void {
    if (this.trigger() !== type || this.isControlledMode() || this._open() === isOpen) {
      return;
    }
    this._open.set(isOpen);
    this.onOpenChange.emit(isOpen);
  }

  private generateClass(suffix: string): string {
    return `ant-float-btn-group-${suffix}`;
  }
}
