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
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriDropDownDirective, TriDropDownModule, TriDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'filterTrigger';

@Component({
  selector: '',
  exportAs: `nzFilterTrigger`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      tri-dropdown
      class="tri-table-filter-trigger"
      trigger="click"
      placement="bottomRight"
      [backdrop]="backdrop"
      [clickHide]="false"
      [dropdownMenu]="dropdownMenu"
      [class.active]="active"
      [class.tri-table-filter-open]="visible"
      [visible]="visible"
      (visibleChange)="onVisibleChange($event)"
    >
      <ng-content></ng-content>
    </span>
  `,
  imports: [TriDropDownModule]
})
export class TriFilterTriggerComponent implements OnInit {
  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  public readonly configService = inject(TriConfigService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  @Input() active = false;
  @Input() dropdownMenu!: TriDropdownMenuComponent;
  @Input() visible = false;

  @Input({ transform: booleanAttribute }) @WithConfig() backdrop = false;

  @Output() readonly visibleChange = new EventEmitter<boolean>();

  @ViewChild(TriDropDownDirective, { static: true, read: ElementRef }) dropdown!: ElementRef<HTMLElement>;

  onVisibleChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.next(visible);
  }

  hide(): void {
    this.visible = false;
    this.cdr.markForCheck();
  }

  show(): void {
    this.visible = true;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    fromEventOutsideAngular(this.dropdown.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => event.stopPropagation());
  }
}
