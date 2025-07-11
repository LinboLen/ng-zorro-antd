/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriCheckListI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriProgressModule } from 'ng-zorro-antd/progress';

import { TriItemProps } from './typings';

@Component({
  selector: 'tri-check-list-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TriIconModule, TriProgressModule, TriOutletModule, TriCheckboxModule, TriButtonModule, FormsModule, DecimalPipe],
  template: `
    @let i18n = locale();
    @if (visible()) {
      @if (progressPercent() === 100) {
        <div class="tri-check-list-header-finish">
          <tri-icon type="check-circle" theme="outline" class="tri-check-list-header-finish-icon" />
          <h3 class="tri-check-list-header-finish-title">{{ i18n.checkListFinish }}</h3>
          <button tri-button type="primary" [style.margin.px]="24" (click)="closePopover.emit(false)">
            {{ i18n.checkListClose }}
          </button>
        </div>
      } @else {
        <div class="tri-check-list-header">
          <div class="tri-check-list-header-title">
            @if (!!title()) {
              <ng-container *stringTemplateOutlet="title()">{{ title() }}</ng-container>
            } @else {
              {{ i18n.checkList }}
            }
          </div>
          <div class="tri-check-list-header-extra">
            <tri-icon type="down" theme="outline" (click)="closePopover.emit(false)" />
          </div>
        </div>
        @if (progress()) {
          <div class="tri-check-list-progressBar">
            <div class="tri-check-list-progressBar-progress">
              <tri-progress [percent]="progressPercent() | number: '1.0-0'"></tri-progress>
            </div>
          </div>
        }
      }
      <div class="tri-check-list-steps-content">
        @for (item of items(); track item.key || item.description; let i = $index) {
          @let itemHighlight = index() === i + 1;
          @let itemChecked = index() > i + 1;
          <div
            class="tri-check-list-steps"
            [class.tri-check-list-highlight]="itemHighlight"
            [class.tri-check-list-checked]="itemChecked"
          >
            <div class="tri-check-list-steps-item">
              <div class="tri-check-list-steps-item-circle">
                @if (itemChecked) {
                  <tri-icon type="check" theme="outline" class="tri-check-list-steps-checkoutlined" />
                } @else {
                  <div class="tri-check-list-steps-number">{{ i + 1 }}</div>
                }
              </div>
              <div class="tri-check-list-steps-item-description">{{ item.description }}</div>
            </div>
            @if (itemHighlight && !!item.onClick) {
              <tri-icon
                type="arrow-right"
                theme="outline"
                class="tri-check-list-steps-item-arrows"
                (click)="item.onClick()"
              />
            }
          </div>
        }
      </div>
      <div class="tri-check-list-footer" (click)="visible.set(false)">
        @if (!!footer()) {
          <ng-container *stringTemplateOutlet="footer()">{{ footer() }}</ng-container>
        } @else {
          {{ i18n.checkListFooter }}
        }
      </div>
    } @else {
      <div class="tri-check-list-close-check">
        <div class="tri-check-list-close-check-title">{{ i18n.checkListCheck }}</div>
        <div class="tri-check-list-close-check-action">
          <button tri-button type="primary" (click)="visible.set(false); hide.emit(checked)">{{ i18n.ok }}</button>
          <button tri-button (click)="visible.set(true)">{{ i18n.cancel }}</button>
        </div>
        <div class="tri-check-list-close-check-other">
          <label tri-checkbox [(ngModel)]="checked">{{ i18n.checkListCheckOther }}</label>
        </div>
      </div>
    }
  `,
  host: {
    class: 'tri-check-list-content'
  }
})
export class TriCheckListContentComponent {
  locale = input.required<TriCheckListI18nInterface>();
  items = input<TriItemProps[]>([]);
  index = input(0);
  progress = input(true);
  title = input<TemplateRef<void> | string | null>(null);
  footer = input<TemplateRef<void> | string | null>(null);
  readonly closePopover = output<boolean>();
  readonly hide = output<boolean>();

  protected checked = false;
  protected visible = signal(true);
  protected progressPercent = computed(() => {
    const index = Math.min(Math.max(this.index() - 1, 0), this.items().length);
    return (index / this.items().length) * 100;
  });
}
