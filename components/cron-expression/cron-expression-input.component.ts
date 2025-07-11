/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  booleanAttribute
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';

import { CronChangeType, TimeType } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-cron-expression-input',
  exportAs: 'triCronExpressionInput',
  template: `
    <div class="tri-cron-expression-input">
      <input
        tri-input
        [(ngModel)]="value"
        [name]="label"
        [disabled]="disabled"
        (focus)="focusInputEffect($event)"
        (blur)="blurInputEffect()"
        (ngModelChange)="setValue()"
      />
    </div>
  `,
  imports: [TriInputModule, FormsModule]
})
export class TriCronExpressionInputComponent {
  @Input() value: string = '0';
  @Input() label: TimeType = 'second';
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Output() readonly focusEffect = new EventEmitter<TimeType>();
  @Output() readonly blurEffect = new EventEmitter<void>();
  @Output() readonly getValue = new EventEmitter<CronChangeType>();

  focusInputEffect(event: FocusEvent): void {
    this.focusEffect.emit(this.label);
    (event.target as HTMLInputElement).select();
  }

  blurInputEffect(): void {
    this.blurEffect.emit();
  }

  setValue(): void {
    this.getValue.emit({ label: this.label, value: this.value });
  }
}
