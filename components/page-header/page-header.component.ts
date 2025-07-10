/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriPageHeaderBreadcrumbDirective, TriPageHeaderFooterDirective } from './page-header-cells';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'pageHeader';

@Component({
  selector: '',
  exportAs: 'triPageHeader',
  template: `
    <ng-content select="nz-breadcrumb[nz-page-header-breadcrumb]" />

    <div class="tri-page-header-heading">
      <div class="tri-page-header-heading-left">
        <!--back-->
        @if (backIcon !== null && enableBackButton) {
          <div (click)="onBack()" class="tri-page-header-back">
            <div role="button" tabindex="0" class="tri-page-header-back-button">
              <ng-container *stringTemplateOutlet="backIcon; let backIcon">
                <tri-icon [type]="backIcon || getBackIcon()" theme="outline" />
              </ng-container>
            </div>
          </div>
        }

        <!--avatar-->
        <ng-content select="nz-avatar[nz-page-header-avatar]" />
        <!--title-->
        @if (title) {
          <span class="tri-page-header-heading-title">
            <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
          </span>
        } @else {
          <ng-content select="nz-page-header-title, [nz-page-header-title]" />
        }

        <!--subtitle-->
        @if (subtitle) {
          <span class="tri-page-header-heading-sub-title">
            <ng-container *stringTemplateOutlet="subtitle">{{ subtitle }}</ng-container>
          </span>
        } @else {
          <ng-content select="nz-page-header-subtitle, [nz-page-header-subtitle]" />
        }
        <ng-content select="nz-page-header-tags, [nz-page-header-tags]" />
      </div>

      <ng-content select="nz-page-header-extra, [nz-page-header-extra]" />
    </div>

    <ng-content select="nz-page-header-content, [nz-page-header-content]" />
    <ng-content select="nz-page-header-footer, [nz-page-header-footer]" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-page-header',
    '[class.has-footer]': 'nzPageHeaderFooter',
    '[class.tri-page-header-ghost]': 'ghost',
    '[class.has-breadcrumb]': 'nzPageHeaderBreadcrumb',
    '[class.tri-page-header-compact]': 'compact',
    '[class.tri-page-header-rtl]': `dir === 'rtl'`
  },
  imports: [TriOutletModule, TriIconModule]
})
export class TriPageHeaderComponent implements AfterViewInit, OnInit {
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  @Input() backIcon: string | TemplateRef<void> | null = null;
  @Input() title?: string | TemplateRef<void>;
  @Input() subtitle?: string | TemplateRef<void>;
  @Input() @WithConfig() ghost: boolean = true;
  @Output() readonly back = new EventEmitter<void>();

  @ContentChild(TriPageHeaderFooterDirective, { static: false })
  pageHeaderFooter?: ElementRef<TriPageHeaderFooterDirective>;
  @ContentChild(TriPageHeaderBreadcrumbDirective, { static: false })
  pageHeaderBreadcrumb?: ElementRef<TriPageHeaderBreadcrumbDirective>;

  compact = false;
  dir: Direction = 'ltr';

  enableBackButton = true;

  constructor(
    public nzConfigService: TriConfigService,
    private elementRef: ElementRef,
    private nzResizeObserver: TriResizeObserver,
    private cdr: ChangeDetectorRef,
    private directionality: Directionality
  ) {}

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
  }

  ngAfterViewInit(): void {
    if (!this.back.observers.length) {
      this.enableBackButton = (this.location.getState() as TriSafeAny)?.navigationId > 1;
      // Location is not an RxJS construct, as a result, we can't pipe it.
      const subscription = this.location.subscribe(() => {
        this.enableBackButton = true;
        this.cdr.detectChanges();
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }

    this.nzResizeObserver
      .observe(this.elementRef)
      .pipe(
        map(([entry]) => entry.contentRect.width),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((width: number) => {
        this.compact = width < 768;
        this.cdr.markForCheck();
      });
  }

  onBack(): void {
    if (this.back.observers.length) {
      this.back.emit();
    } else {
      this.location.back();
    }
  }

  getBackIcon(): string {
    if (this.dir === 'rtl') {
      return 'arrow-right';
    }
    return 'arrow-left';
  }
}
