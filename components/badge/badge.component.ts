/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { zoomBadgeMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny, TriSizeDSType } from 'ng-zorro-antd/core/types';

import { TriBadgeSupComponent } from './badge-sup.component';
import { badgePresetColors } from './preset-colors';
import { TriBadgeStatusType } from './types';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'badge';

@Component({
  selector: 'tri-badge',
  exportAs: 'triBadge',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [zoomBadgeMotion],
  imports: [TriBadgeSupComponent, TriOutletModule],
  template: `
    @if (status || color) {
      <span
        class="ant-badge-status-dot ant-badge-status-{{ status || presetColor }}"
        [style.background]="!presetColor && color"
        [style]="style"
      ></span>
      <span class="tri-badge-status-text">
        <ng-container *stringTemplateOutlet="text">{{ text }}</ng-container>
      </span>
    }
    <ng-content />
    <ng-container *stringTemplateOutlet="count">
      @if (showSup) {
        <tri-badge-sup
          [offset]="offset"
          [size]="size"
          [title]="title"
          [style]="style"
          [dot]="dot"
          [overflowCount]="overflowCount"
          [disableAnimation]="!!(standalone || status || color || noAnimation?.nzNoAnimation)"
          [count]="count"
          [noAnimation]="!!noAnimation?.nzNoAnimation"
        />
      }
    </ng-container>
  `,
  host: {
    class: 'tri-badge',
    '[class.tri-badge-status]': 'status',
    '[class.tri-badge-not-a-wrapper]': '!!(standalone || status || color)'
  }
})
export class TriBadgeComponent implements OnChanges, OnInit {
  public configService = inject(TriConfigService);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef<HTMLElement>);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  showSup = false;
  presetColor: string | null = null;
  dir: Direction = 'ltr';

  @Input({ transform: booleanAttribute }) showZero: boolean = false;
  @Input({ transform: booleanAttribute }) showDot = true;
  @Input({ transform: booleanAttribute }) standalone = false;
  @Input({ transform: booleanAttribute }) dot = false;
  @Input() @WithConfig() overflowCount: number = 99;
  @Input() @WithConfig() color?: string = undefined;
  @Input() style: Record<string, string> | null = null;
  @Input() text?: string | TemplateRef<void> | null = null;
  @Input() title?: string | null | undefined;
  @Input() status?: TriBadgeStatusType | string;
  @Input() count?: number | TemplateRef<TriSafeAny>;
  @Input() offset?: [number, number];
  @Input() size: TriSizeDSType = 'default';

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.prepareBadgeForRtl();
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
    this.prepareBadgeForRtl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzColor, nzShowDot, nzDot, nzCount, nzShowZero } = changes;
    if (nzColor) {
      this.presetColor = this.color && badgePresetColors.indexOf(this.color) !== -1 ? this.color : null;
    }
    if (nzShowDot || nzDot || nzCount || nzShowZero) {
      this.showSup =
        (this.showDot && this.dot) ||
        (typeof this.count === 'number' && this.count! > 0) ||
        (typeof this.count === 'number' && this.count! <= 0 && this.showZero);
    }
  }

  private prepareBadgeForRtl(): void {
    if (this.isRtlLayout) {
      this.renderer.addClass(this.elementRef.nativeElement, 'ant-badge-rtl');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'ant-badge-rtl');
    }
  }

  get isRtlLayout(): boolean {
    return this.dir === 'rtl';
  }
}
