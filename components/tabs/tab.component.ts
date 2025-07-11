/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { Subject } from 'rxjs';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TabTemplateContext } from './interfaces';
import { TriTabLinkDirective, TriTabLinkTemplateDirective } from './tab-link.directive';
import { TriTabDirective } from './tab.directive';

/**
 * Used to provide a tab set to a tab without causing a circular dependency.
 */
export const TRI_TAB_SET = new InjectionToken<TriSafeAny>('NZ_TAB_SET');

@Component({
  selector: 'tri-tab',
  exportAs: 'triTab',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #tabLinkTemplate>
      <ng-content select="[nz-tab-link]"></ng-content>
    </ng-template>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class TriTabComponent implements OnChanges, OnDestroy {
  @Input() title: string | TemplateRef<TabTemplateContext> = '';
  @Input({ transform: booleanAttribute }) closable = false;
  @Input() closeIcon: string | TemplateRef<TriSafeAny> = 'close';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) forceRender = false;
  @Output() readonly select = new EventEmitter<void>();
  @Output() readonly deselect = new EventEmitter<void>();
  @Output() readonly click = new EventEmitter<void>();
  @Output() readonly contextmenu = new EventEmitter<MouseEvent>();

  @ContentChild(TriTabLinkTemplateDirective, { static: false }) tabLinkTemplateDirective!: TriTabLinkTemplateDirective;
  @ContentChild(TriTabDirective, { static: false, read: TemplateRef }) template: TemplateRef<void> | null = null;
  @ContentChild(TriTabLinkDirective, { static: false }) linkDirective!: TriTabLinkDirective;
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<TriSafeAny>;

  isActive: boolean = false;
  hasBeenActive = false;
  position: number | null = null;
  origin: number | null = null;
  closestTabSet = inject(TRI_TAB_SET);

  readonly stateChanges = new Subject<void>();

  get content(): TemplateRef<TriSafeAny> {
    return this.template || this.contentTemplate;
  }

  get label(): string | TemplateRef<TriSafeAny> {
    return this.title || this.tabLinkTemplateDirective?.templateRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzTitle, nzDisabled, nzForceRender } = changes;
    if (nzTitle || nzDisabled || nzForceRender) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  setActive(active: boolean): void {
    this.isActive = active;
    if (active) {
      this.hasBeenActive = true;
    }
  }
}
