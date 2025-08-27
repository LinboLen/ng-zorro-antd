/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  type AfterViewInit
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

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'collapsePanel';

@Component({
  selector: 'tri-collapse-panel',
  exportAs: 'triCollapsePanel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [collapseMotion],
  template: `
    <div
      #collapseHeader
      role="button"
      [attr.aria-expanded]="active"
      class="tri-collapse-header"
      [class.tri-collapse-icon-collapsible-only]="collapsible === 'icon'"
      [class.tri-collapse-header-collapsible-only]="collapsible === 'header'"
    >
      @if (showArrow) {
        <div role="button" #collapseIcon class="tri-collapse-expand-icon">
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
    '[class.tri-collapse-item-disabled]': 'disabled || collapsible === "disabled"'
  },
  imports: [TriOutletModule, TriIconModule]
})
export class TriCollapsePanelComponent implements OnInit, AfterViewInit {
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private collapseComponent = inject(TriCollapseComponent, { host: true });
  noAnimation = inject(TriNoAnimationDirective, { optional: true });

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input({ transform: booleanAttribute }) active = false;
  /**
   * @deprecated Use `nzCollapsible` instead with the value `'disabled'`.
   */
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) @WithConfig() showArrow: boolean = true;
  @Input() extra?: string | TemplateRef<void>;
  @Input() header?: string | TemplateRef<void>;
  @Input() expandedIcon?: string | TemplateRef<void>;
  @Input() collapsible?: 'disabled' | 'header' | 'icon';
  @Output() readonly activeChange = new EventEmitter<boolean>();

  @ViewChild('collapseHeader') collapseHeader!: ElementRef<HTMLElement>;
  @ViewChild('collapseIcon') collapseIcon?: ElementRef<HTMLElement>;

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());

    this.destroyRef.onDestroy(() => {
      this.collapseComponent.removePanel(this);
    });
  }

  ngOnInit(): void {
    this.collapseComponent.addPanel(this);
  }

  ngAfterViewInit(): void {
    let fromEvent$ = fromEventOutsideAngular(this.collapseHeader.nativeElement, 'click');
    if (this.showArrow && this.collapsible === 'icon' && this.collapseIcon) {
      fromEvent$ = fromEventOutsideAngular(this.collapseIcon!.nativeElement, 'click');
    }
    fromEvent$
      .pipe(
        filter(() => !this.disabled && this.collapsible !== 'disabled'),
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
