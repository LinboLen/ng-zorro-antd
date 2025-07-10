/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriOptionGroupComponent } from './option-group.component';

@Component({
  selector: '',
  exportAs: 'triOption',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class TriOptionComponent implements OnChanges, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly optionGroupComponent = inject(TriOptionGroupComponent, { optional: true });

  changes = new Subject<void>();
  groupLabel?: string | number | TemplateRef<TriSafeAny> | null = null;
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<TriSafeAny>;
  @Input() title?: string | number | null;
  @Input() label: string | number | null = null;
  @Input() value: TriSafeAny | null = null;
  @Input() key?: string | number;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) hide = false;
  @Input({ transform: booleanAttribute }) customContent = false;

  ngOnInit(): void {
    this.optionGroupComponent?.changes.pipe(startWith(true), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.groupLabel = this.optionGroupComponent?.label;
    });
  }

  ngOnChanges(): void {
    this.changes.next();
  }
}
