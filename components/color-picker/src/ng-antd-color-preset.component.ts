/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';

import { TriColor, TriPresetColor } from '../typings';
import type { Color } from './interfaces/color';
import { NgAntdColorBlockComponent } from './ng-antd-color-block.component';
import { generateColor } from './util/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ng-antd-color-preset',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriCollapseModule, NgAntdColorBlockComponent],
  template: `
    <div class="tri-color-picker-presets">
      <tri-collapse ghost>
        @for (preset of presets; track preset.key || $index) {
          <tri-collapse-panel
            [active]="openPresets.has($index)"
            (activeChange)="onPanelActiveChange($index, $event)"
            [header]="preset.label"
          >
            <div class="tri-color-picker-presets-items">
              @for (color of preset.colors; track $index) {
                <ng-antd-color-block
                  [value]="value"
                  [color]="getColorString(color)"
                  (onClick)="selectPresetColor(color)"
                />
              }
            </div>
          </tri-collapse-panel>
        }
      </tri-collapse>
    </div>
  `,
  host: {
    class: 'tri-color-picker-presets-wrapper'
  }
})
export class NgAntdColorPresetComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  protected openPresets = new Set<string | number>();

  @Input() presets: TriPresetColor[] = [];
  @Input() value: Color | null = null;
  @Output() readonly presetSelect = new EventEmitter<TriColor>();

  ngOnInit(): void {
    this.presets.forEach((preset, index) => {
      if (preset.defaultOpen) {
        this.openPresets.add(index);
      }
    });
  }

  onPanelActiveChange(index: number, active: boolean): void {
    if (active) {
      this.openPresets.add(index);
    } else {
      this.openPresets.delete(index);
    }
    this.cdr.markForCheck();
  }

  selectPresetColor(color: string | TriColor): void {
    const colorInstance = typeof color === 'string' ? generateColor(color) : color;
    this.presetSelect.emit(colorInstance);
  }

  getColorString(color: string | TriColor): string {
    if (typeof color === 'string') {
      return color;
    }
    return color.toRgbString();
  }
}
