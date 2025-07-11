/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Directive, Input, TemplateRef } from '@angular/core';

import { TriEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'tri-list-empty',
  exportAs: 'triListHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<tri-embed-empty [componentName]="'list'" [specificContent]="noResult"></tri-embed-empty>`,
  host: {
    class: 'tri-list-empty-text'
  },
  imports: [TriEmptyModule]
})
export class TriListEmptyComponent {
  @Input() noResult?: string | TemplateRef<void>;
}

@Component({
  selector: 'tri-list-header',
  exportAs: 'triListHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-list-header'
  }
})
export class TriListHeaderComponent {}

@Component({
  selector: 'tri-list-footer',
  exportAs: 'triListFooter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-list-footer'
  }
})
export class TriListFooterComponent {}

@Component({
  selector: 'tri-list-pagination',
  exportAs: 'triListPagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-list-pagination'
  }
})
export class TriListPaginationComponent {}

@Directive({
  selector: 'tri-list-load-more',
  exportAs: 'triListLoadMoreDirective'
})
export class TriListLoadMoreDirective {}

@Directive({
  selector: 'tri-list[nzGrid]',
  host: {
    class: 'tri-list-grid'
  }
})
export class TriListGridDirective {}
