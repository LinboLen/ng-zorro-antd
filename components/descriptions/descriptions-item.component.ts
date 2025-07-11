/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  numberAttribute
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-descriptions-item',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  exportAs: 'triDescriptionsItem'
})
export class TriDescriptionsItemComponent implements OnChanges, OnDestroy {
  @ViewChild(TemplateRef, { static: true }) content!: TemplateRef<void>;

  @Input({ transform: numberAttribute }) span = 1;
  @Input() title: string | TemplateRef<void> = '';

  readonly inputChange$ = new Subject<void>();

  ngOnChanges(): void {
    this.inputChange$.next();
  }

  ngOnDestroy(): void {
    this.inputChange$.complete();
  }
}
