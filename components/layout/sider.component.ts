/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriBreakpointKey, TriBreakpointService, siderResponsiveMap } from 'ng-zorro-antd/core/services';
import { inNextTick, toCssPixel } from 'ng-zorro-antd/core/util';
import { TriMenuDirective } from 'ng-zorro-antd/menu';

import { TriSiderTriggerComponent } from './sider-trigger.component';

@Component({
  selector: 'tri-sider',
  exportAs: 'triSider',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tri-layout-sider-children">
      <ng-content />
    </div>
    @if (collapsible && trigger !== null) {
      <div
        tri-sider-trigger
        [matchBreakPoint]="matchBreakPoint"
        [collapsedWidth]="collapsedWidth"
        [collapsed]="collapsed"
        [breakpoint]="breakpoint"
        [reverseArrow]="reverseArrow"
        [trigger]="trigger"
        [zeroTrigger]="zeroTrigger"
        [siderWidth]="widthSetting"
        (click)="setCollapsed(!collapsed)"
      ></div>
    }
  `,
  host: {
    class: 'tri-layout-sider',
    '[class.tri-layout-sider-zero-width]': `collapsed && collapsedWidth === 0`,
    '[class.tri-layout-sider-light]': `theme === 'light'`,
    '[class.tri-layout-sider-dark]': `theme === 'dark'`,
    '[class.tri-layout-sider-collapsed]': `collapsed`,
    '[class.tri-layout-sider-has-trigger]': `collapsible && trigger !== null`,
    '[style.flex]': 'flexSetting',
    '[style.maxWidth]': 'widthSetting',
    '[style.minWidth]': 'widthSetting',
    '[style.width]': 'widthSetting'
  },
  imports: [TriSiderTriggerComponent]
})
export class TriSiderComponent implements OnInit, OnChanges, AfterContentInit {
  private destroyRef = inject(DestroyRef);
  private platform = inject(Platform);
  private cdr = inject(ChangeDetectorRef);
  private breakpointService = inject(TriBreakpointService);

  @ContentChild(TriMenuDirective) menuDirective: TriMenuDirective | null = null;
  @Output() readonly collapsedChange = new EventEmitter();
  @Input() width: string | number = 200;
  @Input() theme: 'light' | 'dark' = 'dark';
  @Input() collapsedWidth = 80;
  @Input() breakpoint: TriBreakpointKey | null = null;
  @Input() zeroTrigger: TemplateRef<void> | null = null;
  @Input() trigger: TemplateRef<void> | undefined | null = undefined;
  @Input({ transform: booleanAttribute }) reverseArrow = false;
  @Input({ transform: booleanAttribute }) collapsible = false;
  @Input({ transform: booleanAttribute }) collapsed = false;
  matchBreakPoint = false;
  flexSetting: string | null = null;
  widthSetting: string | null = null;

  updateStyleMap(): void {
    this.widthSetting = this.collapsed ? `${this.collapsedWidth}px` : toCssPixel(this.width);
    this.flexSetting = `0 0 ${this.widthSetting}`;
    this.cdr.markForCheck();
  }

  updateMenuInlineCollapsed(): void {
    if (this.menuDirective && this.menuDirective.mode === 'inline' && this.collapsedWidth !== 0) {
      this.menuDirective.setInlineCollapsed(this.collapsed);
    }
  }

  setCollapsed(collapsed: boolean): void {
    if (collapsed !== this.collapsed) {
      this.collapsed = collapsed;
      this.collapsedChange.emit(collapsed);
      this.updateMenuInlineCollapsed();
      this.updateStyleMap();
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    this.updateStyleMap();

    if (this.platform.isBrowser) {
      this.breakpointService
        .subscribe(siderResponsiveMap, true)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(map => {
          const breakpoint = this.breakpoint;
          if (breakpoint) {
            inNextTick().subscribe(() => {
              this.matchBreakPoint = !map[breakpoint];
              this.setCollapsed(this.matchBreakPoint);
              this.cdr.markForCheck();
            });
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzCollapsed, nzCollapsedWidth, nzWidth } = changes;
    if (nzCollapsed || nzCollapsedWidth || nzWidth) {
      this.updateStyleMap();
    }
    if (nzCollapsed) {
      this.updateMenuInlineCollapsed();
    }
  }

  ngAfterContentInit(): void {
    this.updateMenuInlineCollapsed();
  }
}
