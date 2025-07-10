/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriCheckListI18nInterface, TriI18nService } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

import { TriCheckListButtonComponent } from './check-list-button.component';
import { TriCheckListContentComponent } from './check-list-content.component';
import { TriItemProps } from './typings';

@Component({
  selector: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TriPopoverModule, TriIconModule, TriOutletModule, TriCheckListButtonComponent, TriCheckListContentComponent],
  template: `
    <tri-check-list-button
      tri-popover
      [popoverContent]="checklistTemplate"
      popoverTrigger="click"
      popoverPlacement="topRight"
      [popoverOverlayClickable]="false"
      [popoverVisible]="visible()"
      (popoverVisibleChange)="visible.set($event)"
    >
      @if (!!triggerRender()) {
        <ng-container *stringTemplateOutlet="triggerRender()">{{ triggerRender() }}</ng-container>
      } @else {
        <tri-icon type="check-circle" theme="outline" class="tri-check-list-icon" />
        <div class="tri-check-list-description">{{ locale().checkList }}</div>
      }
    </tri-check-list-button>
    <ng-template #checklistTemplate>
      <tri-check-list-content
        [locale]="locale()"
        [items]="items()"
        [index]="index()"
        [title]="title()"
        [progress]="progress()"
        [footer]="footer()"
        (closePopover)="visible.set($event)"
        (hide)="visible.set($event); hide.emit($event)"
      ></tri-check-list-content>
    </ng-template>
  `,
  host: {
    class: 'tri-check-list'
  }
})
export class TriCheckListComponent {
  items = input<TriItemProps[]>([]);
  visible = input(false);
  index = input(1);
  progress = input(true);
  triggerRender = input<TemplateRef<void> | string | null>(null);
  title = input<TemplateRef<void> | string | null>(null);
  footer = input<TemplateRef<void> | string | null>(null);
  readonly hide = output<boolean>();

  protected _visible = linkedSignal(this.visible);
  private i18n = inject(TriI18nService);
  locale = toSignal<TriCheckListI18nInterface>(
    this.i18n.localeChange.pipe(map(() => this.i18n.getLocaleData('CheckList'))),
    { requireSync: true }
  );
}
