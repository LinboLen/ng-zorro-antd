/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  inject,
  Input,
  OnChanges,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, defer, merge, of } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: '',
  exportAs: 'triListItemExtra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-list-item-extra'
  }
})
export class TriListItemExtraComponent {}

@Component({
  selector: '',
  exportAs: 'triListItemAction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template><ng-content></ng-content></ng-template>`
})
export class TriListItemActionComponent {
  @ViewChild(TemplateRef, { static: true }) templateRef?: TemplateRef<void>;
}

@Component({
  selector: '',
  exportAs: 'triListItemActions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (i of actions; track i) {
      <li>
        <ng-template [ngTemplateOutlet]="i" />
        @if (!$last) {
          <em class="tri-list-item-action-split"></em>
        }
      </li>
    }
  `,
  host: {
    class: 'tri-list-item-action'
  },
  imports: [NgTemplateOutlet]
})
export class TriListItemActionsComponent implements OnChanges, AfterContentInit {
  private cdr = inject(ChangeDetectorRef);

  @Input() actions: Array<TemplateRef<void>> = [];
  @ContentChildren(TriListItemActionComponent) listItemActions!: QueryList<TriListItemActionComponent>;

  _actions: Array<TemplateRef<void>> = [];
  private inputActionChanges$ = new Subject<null>();
  private contentChildrenChanges$: Observable<TriSafeAny> = defer(() => {
    if (this.listItemActions) {
      return of(null);
    }
    return this.initialized.pipe(
      mergeMap(() => this.listItemActions.changes.pipe(startWith(this.listItemActions)))
    );
  });

  private initialized = new Subject<void>();

  constructor() {
    merge(this.contentChildrenChanges$, this.inputActionChanges$)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.actions.length) {
          this._actions = this.actions;
        } else {
          this._actions = this.listItemActions.map(action => action.templateRef!);
        }
        this.cdr.detectChanges();
      });
  }

  ngOnChanges(): void {
    this.inputActionChanges$.next(null);
  }

  ngAfterContentInit(): void {
    this.initialized.next();
    this.initialized.complete();
  }
}
