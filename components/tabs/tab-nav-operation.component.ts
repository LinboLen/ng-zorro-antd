/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  signal
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMenuModule } from 'ng-zorro-antd/menu';

import { TriTabAddButtonComponent } from './tab-add-button.component';
import { TriTabNavItemDirective } from './tab-nav-item.directive';

@Component({
  selector: 'tri-tab-nav-operation',
  exportAs: 'triTabNavOperation',
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      tri-dropdown
      class="tri-tabs-nav-more"
      type="button"
      tabindex="-1"
      aria-hidden="true"
      overlayClassName="nz-tabs-dropdown"
      #dropdownTrigger="nzDropdown"
      [dropdownMenu]="menu"
      [overlayStyle]="{ minWidth: '46px' }"
      [matchWidthElement]="null"
      (visibleChange)="menuVisibleChange($event)"
      (mouseenter)="showItems()"
    >
      <tri-icon type="ellipsis" />
    </button>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      @if (menuOpened()) {
        <ul tri-menu>
          @for (item of items; track item) {
            <li
              tri-menu-item
              class="tri-tabs-dropdown-menu-item"
              [class.tri-tabs-dropdown-menu-item-disabled]="item.disabled"
              [selected]="item.active"
              [disabled]="item.disabled"
              (click)="onSelect(item)"
              (contextmenu)="onContextmenu(item, $event)"
            >
              <ng-container *stringTemplateOutlet="item.tab.label; stringTemplateOutletContext: { visible: false }">
                {{ item.tab.label }}
              </ng-container>
            </li>
          }
        </ul>
      }
    </tri-dropdown-menu>
    @if (addable) {
      <button tri-tab-add-button [addIcon]="addIcon" (click)="addClicked.emit()"></button>
    }
  `,
  host: {
    class: 'tri-tabs-nav-operations',
    '[class.tri-tabs-nav-operations-hidden]': 'items.length === 0'
  },
  imports: [TriDropdownModule, TriIconModule, TriOutletModule, TriTabAddButtonComponent, TriMenuModule]
})
export class TriTabNavOperationComponent {
  private readonly element: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  @Input() items: TriTabNavItemDirective[] = [];
  @Input({ transform: booleanAttribute }) addable: boolean = false;
  @Input() addIcon: string | TemplateRef<TriSafeAny> = 'plus';

  @Output() readonly addClicked = new EventEmitter<void>();
  @Output() readonly selected = new EventEmitter<TriTabNavItemDirective>();

  private closeAnimationWaitTimeoutId?: ReturnType<typeof setTimeout>;
  protected readonly menuOpened = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.closeAnimationWaitTimeoutId);
    });
  }

  onSelect(item: TriTabNavItemDirective): void {
    if (!item.disabled) {
      // ignore nzCanDeactivate
      item.tab.click.emit();
      this.selected.emit(item);
    }
  }

  onContextmenu(item: TriTabNavItemDirective, e: MouseEvent): void {
    if (!item.disabled) {
      item.tab.contextmenu.emit(e);
    }
  }

  showItems(): void {
    clearTimeout(this.closeAnimationWaitTimeoutId);
    this.menuOpened.set(true);
  }

  protected menuVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closeAnimationWaitTimeoutId = setTimeout(() => this.menuOpened.set(false), 150);
    }
  }

  getElementWidth(): number {
    return this.element.offsetWidth || 0;
  }

  getElementHeight(): number {
    return this.element.offsetHeight || 0;
  }
}
