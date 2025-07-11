/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  HostBinding,
  Input,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriDirectionVHType } from 'ng-zorro-antd/core/types';

import { TriListItemActionsComponent, TriListItemExtraComponent } from './list-item-cell';
import { TriListComponent } from './list.component';

@Component({
  selector: 'tri-list-item,[tri-list-item]',
  exportAs: 'triListItem',
  template: `
    <ng-template #actionsTpl>
      @if (actions && actions.length > 0) {
        <ul tri-list-item-actions [actions]="actions"></ul>
      }
      <ng-content select="nz-list-item-actions, [nz-list-item-actions]" />
    </ng-template>
    <ng-template #contentTpl>
      <ng-content select="nz-list-item-meta, [nz-list-item-meta]" />
      <ng-content />
      @if (content) {
        <ng-container *stringTemplateOutlet="content">{{ content }}</ng-container>
      }
    </ng-template>
    <ng-template #extraTpl>
      <ng-content select="nz-list-item-extra, [nz-list-item-extra]" />
    </ng-template>

    @if (isVerticalAndExtra) {
      <div class="tri-list-item-main">
        <ng-template [ngTemplateOutlet]="contentTpl" />
        <ng-template [ngTemplateOutlet]="actionsTpl" />
      </div>
      @if (extra) {
        <tri-list-item-extra>
          <ng-template [ngTemplateOutlet]="extra" />
        </tri-list-item-extra>
      }
      <ng-template [ngTemplateOutlet]="extraTpl" />
    } @else {
      <ng-template [ngTemplateOutlet]="contentTpl" />
      <ng-template [ngTemplateOutlet]="extra" />
      <ng-template [ngTemplateOutlet]="extraTpl" />
      <ng-template [ngTemplateOutlet]="actionsTpl" />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-list-item'
  },
  imports: [TriListItemActionsComponent, TriOutletModule, NgTemplateOutlet, TriListItemExtraComponent]
})
export class TriListItemComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private parentComp = inject(TriListComponent);

  @Input() actions: Array<TemplateRef<void>> = [];
  @Input() content?: string | TemplateRef<void>;
  @Input() extra: TemplateRef<void> | null = null;
  @Input({ transform: booleanAttribute }) @HostBinding('class.ant-list-item-no-flex') noFlex: boolean = false;

  @ContentChild(TriListItemExtraComponent) listItemExtraDirective?: TriListItemExtraComponent;

  private itemLayout?: TriDirectionVHType;

  get isVerticalAndExtra(): boolean {
    return this.itemLayout === 'vertical' && (!!this.listItemExtraDirective || !!this.extra);
  }

  ngAfterViewInit(): void {
    this.parentComp.itemLayoutNotify$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(val => {
      this.itemLayout = val;
      this.cdr.detectChanges();
    });
  }
}
