/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Directive, Input, TemplateRef } from '@angular/core';

import { TriEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: '',
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
  selector: '',
  exportAs: 'triListHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-list-header'
  }
})
export class TriListHeaderComponent {}

@Component({
  selector: '',
  exportAs: 'triListFooter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-list-footer'
  }
})
export class TriListFooterComponent {}

@Component({
  selector: '',
  exportAs: 'triListPagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-list-pagination'
  }
})
export class TriListPaginationComponent {}

@Directive({
  selector: '',
  exportAs: 'triListLoadMoreDirective'
})
export class TriListLoadMoreDirective {}

@Directive({
  selector: '',
  host: {
    class: 'tri-list-grid'
  }
})
export class TriListGridDirective {}
