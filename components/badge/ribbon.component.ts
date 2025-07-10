/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

import { badgePresetColors } from './preset-colors';

@Component({
  selector: '',
  exportAs: 'triRibbon',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriOutletModule],
  template: `
    <ng-content></ng-content>
    <div
      class="tri-ribbon"
      [class]="presetColor && 'ant-ribbon-color-' + presetColor"
      [class.tri-ribbon-placement-end]="placement === 'end'"
      [class.tri-ribbon-placement-start]="placement === 'start'"
      [style.background-color]="!presetColor && color"
    >
      <ng-container *stringTemplateOutlet="text">
        <span class="tri-ribbon-text">{{ text }}</span>
      </ng-container>
      <div class="tri-ribbon-corner" [style.color]="!presetColor && color"></div>
    </div>
  `,
  host: { class: 'tri-ribbon-wrapper' }
})
export class TriRibbonComponent implements OnChanges {
  @Input() color: string | undefined;
  @Input() placement: 'start' | 'end' = 'end';
  @Input() text: string | TemplateRef<void> | null = null;
  presetColor: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    const { nzColor } = changes;
    if (nzColor) {
      this.presetColor = this.color && badgePresetColors.indexOf(this.color) !== -1 ? this.color : null;
    }
  }
}
