/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  input,
  linkedSignal,
  NgZone,
  output,
  TemplateRef,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { TriAnimationCollapseDirective } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
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
  template: `
    <div
      #collapseHeader
      role="button"
      [attr.aria-expanded]="active()"
      class="tri-collapse-header"
      [class.tri-collapse-collapsible-icon]="collapsible === 'icon'"
      [class.tri-collapse-collapsible-header]="collapsible === 'header'"
    >
      @if (showArrow) {
        <div role="button" #collapseIcon class="tri-collapse-expand-icon">
          <ng-container *stringTemplateOutlet="expandedIcon; let expandedIcon">
            <tri-icon [type]="expandedIcon || 'right'" class="tri-collapse-arrow" [rotate]="active() ? 90 : 0" />
          </ng-container>
        </div>
      }
      <span class="tri-collapse-title">
        <ng-container *stringTemplateOutlet="header">{{ header }}</ng-container>
      </span>
      @if (extra) {
        <div class="tri-collapse-extra">
          <ng-container *stringTemplateOutlet="extra">{{ extra }}</ng-container>
        </div>
      }
    </div>
    <div
      class="tri-collapse-panel"
      [class.tri-collapse-panel-active]="active()"
      animation-collapse
      [open]="active()"
      leavedClassName="ant-collapse-panel-hidden"
    >
      <div class="tri-collapse-body">
        <ng-content />
      </div>
    </div>
  `,
  host: {
    class: 'tri-collapse-item',
    '[class.tri-collapse-no-arrow]': '!showArrow',
    '[class.tri-collapse-item-active]': 'active()',
    '[class.tri-collapse-item-disabled]': 'disabled || collapsible === "disabled"'
  },
  imports: [TriOutletModule, TriIconModule, TriAnimationCollapseDirective]
})
export class TriCollapsePanelComponent implements AfterViewInit {
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly collapseComponent = inject(TriCollapseComponent, { host: true });

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  readonly active = input(false, { transform: booleanAttribute });
  /**
   * @deprecated Will be removed in v22, please use `nzCollapsible` with the value `'disabled'` instead.
   */
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) @WithConfig() showArrow: boolean = true;
  @Input() extra?: string | TemplateRef<void>;
  @Input() header?: string | TemplateRef<void>;
  @Input() expandedIcon?: string | TemplateRef<void>;
  @Input() collapsible?: 'disabled' | 'header' | 'icon';
  readonly activeChange = output<boolean>();

  /**
   * @description Actual active state of the panel.
   */
  readonly _active = linkedSignal(() => this.active());

  readonly collapseHeader = viewChild.required('collapseHeader', { read: ElementRef });
  readonly collapseIcon = viewChild('collapseIcon', { read: ElementRef });

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());

    this.collapseComponent.addPanel(this);
    this.destroyRef.onDestroy(() => {
      this.collapseComponent.removePanel(this);
    });
  }

  ngAfterViewInit(): void {
    const icon = this.collapseIcon();
    const header = this.collapseHeader();
    const element =
      this.showArrow && this.collapsible === 'icon' && icon
        ? (icon.nativeElement as HTMLElement)
        : (header.nativeElement as HTMLElement);
    fromEventOutsideAngular(element, 'click')
      .pipe(
        filter(() => !this.disabled && this.collapsible !== 'disabled'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.collapseComponent.click(this);
        });
      });
  }

  activate(active: boolean): void {
    this._active.set(active);
    this.activeChange.emit(active);
  }
}
