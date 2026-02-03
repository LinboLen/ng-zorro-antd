/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-select-item',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *stringTemplateOutlet="contentTemplateOutlet; stringTemplateOutletContext: templateOutletContext">
      @if (displayLabelInHtml) {
        <span [class.tri-select-selection-item-content]="deletable" [innerHTML]="label"></span>
      } @else {
        <span [class.tri-select-selection-item-content]="deletable">{{ label }}</span>
      }
    </ng-container>
    @if (deletable && !disabled) {
      <span class="tri-select-selection-item-remove" (click)="onDelete($event)">
        @if (!removeIcon) {
          <tri-icon type="close" />
        } @else {
          <ng-template [ngTemplateOutlet]="removeIcon" />
        }
      </span>
    }
  `,
  host: {
    class: 'tri-select-selection-item',
    '[attr.title]': 'label',
    '[class.tri-select-selection-item-disabled]': 'disabled'
  },
  imports: [NgTemplateOutlet, TriOutletModule, TriIconModule]
})
export class TriSelectItemComponent {
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() label: string | number | null | undefined = null;
  /**
   * @internal Internally used, please do not use it directly.
   * @description Whether the label is in HTML format.
   */
  @Input({ transform: booleanAttribute }) displayLabelInHtml = false;
  @Input({ transform: booleanAttribute }) deletable = false;
  @Input() removeIcon: TemplateRef<TriSafeAny> | null = null;
  @Input() contentTemplateOutletContext: TriSafeAny | null = null;
  @Input() contentTemplateOutlet: string | TemplateRef<TriSafeAny> | null = null;
  @Output() readonly delete = new EventEmitter<MouseEvent>();

  protected get templateOutletContext(): TriSafeAny {
    return {
      $implicit: this.contentTemplateOutletContext,
      ...this.contentTemplateOutletContext
    };
  }

  onDelete(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.disabled) {
      this.delete.next(e);
    }
  }
}
