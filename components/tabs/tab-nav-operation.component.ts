/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      (visibleChange)="menuVisChange($event)"
      (mouseenter)="showItems()"
    >
      <tri-icon type="ellipsis" />
    </button>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      @if (menuOpened) {
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
export class TriTabNavOperationComponent implements OnDestroy {
  @Input() items: TriTabNavItemDirective[] = [];
  @Input({ transform: booleanAttribute }) addable: boolean = false;
  @Input() addIcon: string | TemplateRef<TriSafeAny> = 'plus';

  @Output() readonly addClicked = new EventEmitter<void>();
  @Output() readonly selected = new EventEmitter<TriTabNavItemDirective>();
  closeAnimationWaitTimeoutId?: ReturnType<typeof setTimeout>;
  menuOpened = false;

  private cdr = inject(ChangeDetectorRef);
  private readonly element: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

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
    this.menuOpened = true;
    this.cdr.markForCheck();
  }

  menuVisChange(visible: boolean): void {
    if (!visible) {
      this.closeAnimationWaitTimeoutId = setTimeout(() => {
        this.menuOpened = false;
        this.cdr.markForCheck();
      }, 150);
    }
  }

  getElementWidth(): number {
    return this.element?.offsetWidth || 0;
  }

  getElementHeight(): number {
    return this.element?.offsetHeight || 0;
  }

  ngOnDestroy(): void {
    clearTimeout(this.closeAnimationWaitTimeoutId);
  }
}
