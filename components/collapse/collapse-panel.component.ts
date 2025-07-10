/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  NgZone,
  ChangeDetectorRef,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { collapseMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriCollapseComponent } from './collapse.component';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'collapsePanel';

@Component({
  selector: '',
  exportAs: 'triCollapsePanel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [collapseMotion],
  template: `
    <div #collapseHeader role="button" [attr.aria-expanded]="active" class="tri-collapse-header">
      @if (showArrow) {
        <div>
          <ng-container *stringTemplateOutlet="expandedIcon; let expandedIcon">
            <tri-icon [type]="expandedIcon || 'right'" class="tri-collapse-arrow" [rotate]="active ? 90 : 0" />
          </ng-container>
        </div>
      }
      <span class="tri-collapse-header-text">
        <ng-container *stringTemplateOutlet="header">{{ header }}</ng-container>
      </span>
      @if (extra) {
        <div class="tri-collapse-extra">
          <ng-container *stringTemplateOutlet="extra">{{ extra }}</ng-container>
        </div>
      }
    </div>
    <div
      class="tri-collapse-content"
      [class.tri-collapse-content-active]="active"
      [@.disabled]="!!noAnimation?.nzNoAnimation"
      [@collapseMotion]="active ? 'expanded' : 'hidden'"
    >
      <div class="tri-collapse-content-box">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: {
    class: 'tri-collapse-item',
    '[class.tri-collapse-no-arrow]': '!showArrow',
    '[class.tri-collapse-item-active]': 'active',
    '[class.tri-collapse-item-disabled]': 'disabled'
  },
  imports: [TriOutletModule, TriIconModule]
})
export class TriCollapsePanelComponent implements OnInit {
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private collapseComponent = inject(TriCollapseComponent, { host: true });
  noAnimation = inject(TriNoAnimationDirective, { optional: true });

  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  @Input({ transform: booleanAttribute }) active = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) @WithConfig() showArrow: boolean = true;
  @Input() extra?: string | TemplateRef<void>;
  @Input() header?: string | TemplateRef<void>;
  @Input() expandedIcon?: string | TemplateRef<void>;
  @Output() readonly activeChange = new EventEmitter<boolean>();

  @ViewChild('collapseHeader', { static: true }) collapseHeader!: ElementRef<HTMLElement>;

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  constructor() {
    onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());

    this.destroyRef.onDestroy(() => {
      this.collapseComponent.removePanel(this);
    });
  }

  ngOnInit(): void {
    this.collapseComponent.addPanel(this);

    fromEventOutsideAngular(this.collapseHeader.nativeElement, 'click')
      .pipe(
        filter(() => !this.disabled),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.collapseComponent.click(this);
          this.cdr.markForCheck();
        });
      });
  }
}
