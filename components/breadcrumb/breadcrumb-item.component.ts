/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriDropdownMenuComponent, TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriBreadcrumb } from './breadcrumb';
import { TriBreadCrumbSeparatorComponent } from './breadcrumb-separator.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-breadcrumb-item',
  exportAs: 'triBreadcrumbItem',
  imports: [NgTemplateOutlet, TriBreadCrumbSeparatorComponent, TriDropdownModule, TriIconModule, TriOutletModule],
  template: `
    @if (!!overlay) {
      <span class="tri-breadcrumb-overlay-link" tri-dropdown [dropdownMenu]="overlay">
        <ng-template [ngTemplateOutlet]="noMenuTpl" />
        <tri-icon type="down" />
      </span>
    } @else {
      <ng-template [ngTemplateOutlet]="noMenubreadCrumbComponentf (separator) {
      <tri-breadcrumb-separator>
        <ng-containerbreadCrumbComponentt="separator">
          {{ breadCrumbComponent.separator }}
        </ng-container>
      </tri-breadcrumb-separator>
    }

    <ng-template #noMenuTpl>
      <span class="tri-breadcrumb-link">
        <ng-content />
      </span>
    </ng-template>
  `
})
export class TriBreadCrumbItemComponent {
  breadCrumbComponent = inject(TriBreadcrumb);
  /**
   * Dropdown content of a breadcrumb item.
   */
  @Input() overlay?: TriDropdownMenuComponent;
}
