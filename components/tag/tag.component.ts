/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { isPresetColor, isStatusColor, presetColors, statusColors } from 'ng-zorro-antd/core/color';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriTagColor } from './typings';

@Component({
  selector: 'tri-tag',
  exportAs: 'triTag',
  template: `
    <ng-content />
    @if (mode === 'closeable') {
      <tri-icon type="close" class="tri-tag-close-icon" tabindex="-1" (click)="closeTag($event)" />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-tag',
    '[style.background-color]': `isPresetColor ? '' : nzColor`,
    '[class.tri-tag-has-color]': `color && !isPresetColor`,
    '[class.tri-tag-checkable]': `mode === 'checkable'`,
    '[class.tri-tag-checkable-checked]': `checked`,
    '[class.tri-tag-rtl]': `dir() === 'rtl'`,
    '[class.tri-tag-borderless]': `!bordered`,
    '(click)': 'updateCheckedStatus()'
  },
  imports: [TriIconModule]
})
export class TriTagComponent implements OnChanges {
  private renderer = inject(Renderer2);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  protected readonly dir = inject(Directionality).valueSignal;

  @Input() mode: 'default' | 'closeable' | 'checkable' = 'default';
  @Input() color?: TriTagColor;
  @Input({ transform: booleanAttribute }) checked = false;
  @Input({ transform: booleanAttribute }) bordered = true;
  @Output() readonly onClose = new EventEmitter<MouseEvent>();
  @Output() readonly checkedChange = new EventEmitter<boolean>();
  isPresetColor = false;

  updateCheckedStatus(): void {
    if (this.mode === 'checkable') {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
    }
  }

  closeTag(e: MouseEvent): void {
    this.onClose.emit(e);
    if (!e.defaultPrevented) {
      this.renderer.removeChild(this.renderer.parentNode(this.el), this.el);
    }
  }

  private clearPresetColor(): void {
    // /(ant-tag-(?:pink|red|...))/g
    const regexp = new RegExp(`(ant-tag-(?:${[...presetColors, ...statusColors].join('|')}))`, 'g');
    const classname = this.el.classList.toString();
    const matches: string[] = [];
    let match: RegExpExecArray | null = regexp.exec(classname);
    while (match !== null) {
      matches.push(match[1]);
      match = regexp.exec(classname);
    }
    this.el.classList.remove(...matches);
  }

  private setPresetColor(): void {
    this.clearPresetColor();
    if (!this.color) {
      this.isPresetColor = false;
    } else {
      this.isPresetColor = isPresetColor(this.color) || isStatusColor(this.color);
    }
    if (this.isPresetColor) {
      this.el.classList.add(`ant-tag-${this.color}`);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzColor } = changes;
    if (nzColor) {
      this.setPresetColor();
    }
  }
}
