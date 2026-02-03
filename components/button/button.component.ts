/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  afterEveryRender,
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  ContentChild,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  signal,
  SimpleChanges,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriIconDirective, TriIconModule } from 'ng-zorro-antd/icon';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

export type TriButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text' | null;
export type TriButtonShape = 'circle' | 'round' | null;
export type TriButtonSize = TriSizeLDSType;

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'button';

@Component({
  selector: 'button[nz-button],a[nz-button]',
  exportAs: 'triButton',
  imports: [TriIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (loading) {
      <span class="tri-btn-icon tri-btn-loading-icon">
        <tri-icon type="loading" />
      </span>
    }
    <ng-content />
  `,
  host: {
    class: 'tri-btn',
    '[class.tri-btn-default]': `type === 'default'`,
    '[class.tri-btn-primary]': `type === 'primary'`,
    '[class.tri-btn-dashed]': `type === 'dashed'`,
    '[class.tri-btn-link]': `type === 'link'`,
    '[class.tri-btn-text]': `type === 'text'`,
    '[class.tri-btn-circle]': `shape === 'circle'`,
    '[class.tri-btn-round]': `shape === 'round'`,
    '[class.tri-btn-lg]': `finalSize() === 'large'`,
    '[class.tri-btn-sm]': `finalSize() === 'small'`,
    '[class.tri-btn-dangerous]': `danger`,
    '[class.tri-btn-loading]': `loading`,
    '[class.tri-btn-background-ghost]': `ghost`,
    '[class.tri-btn-block]': `block`,
    '[class.tri-input-search-button]': `search`,
    '[class.tri-btn-rtl]': `dir() === 'rtl'`,
    '[class.tri-btn-icon-only]': `iconOnly()`,
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
    '[attr.disabled]': 'disabled || null'
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  providers: [{ provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'btn' }]
})
export class TriButtonComponent implements OnChanges, AfterViewInit, AfterContentInit, OnInit {
  private elementRef: ElementRef<HTMLButtonElement | HTMLAnchorElement> = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @ContentChild(TriIconDirective, { read: ElementRef }) iconDirectiveElement!: ElementRef;
  @Input({ transform: booleanAttribute }) block: boolean = false;
  @Input({ transform: booleanAttribute }) ghost: boolean = false;
  /**
   * @deprecated Will be removed in v22.0.0. Please use `nz-input-search` instead.
   */
  @Input({ transform: booleanAttribute }) search: boolean = false;
  @Input({ transform: booleanAttribute }) loading: boolean = false;
  @Input({ transform: booleanAttribute }) danger: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input() tabIndex: number | string | null = null;
  @Input() type: TriButtonType = null;
  @Input() shape: TriButtonShape = null;
  @Input() @WithConfig() size: TriButtonSize = 'default';
  protected readonly dir = inject(Directionality).valueSignal;

  private readonly elementOnly = signal(false);
  readonly #size = signal<TriSizeLDSType>(this.size);

  private readonly formSize = inject(TRI_FORM_SIZE, { optional: true });

  private readonly compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private readonly loading$ = new Subject<boolean>();

  protected readonly finalSize = computed(() => {
    if (this.formSize?.()) {
      return this.formSize();
    }
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  readonly iconDir = contentChild(TriIconDirective);
  readonly loadingIconDir = viewChild(TriIconDirective);

  readonly iconOnly = computed(() => this.elementOnly() && (!!this.iconDir() || !!this.loadingIconDir()));

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => {
      this.#size.set(this.size);
      this.cdr.markForCheck();
    });

    afterEveryRender({
      read: () => {
        const { children } = this.elementRef.nativeElement;
        const visibleElement = Array.from(children).filter(
          element => (element as HTMLElement).style.display !== 'none'
        );
        this.elementOnly.set(visibleElement.length === 1);
      }
    });
  }

  ngOnInit(): void {
    this.#size.set(this.size);

    // Caretaker note: this event listener could've been added through `host.click` or `HostListener`.
    // The compiler generates the `ɵɵlistener` instruction which wraps the actual listener internally into the
    // function, which runs `markDirty()` before running the actual listener (the decorated class method).
    // Since we're preventing the default behavior and stopping event propagation this doesn't require Angular to run the change detection.
    fromEventOutsideAngular<MouseEvent>(this.elementRef.nativeElement, 'click', { capture: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if ((this.disabled && (event.target as HTMLElement)?.tagName === 'A') || this.loading) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });
  }

  ngOnChanges({ nzLoading, nzSize }: SimpleChanges): void {
    if (nzLoading) {
      this.loading$.next(this.loading);
    }
    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.insertSpan();
  }

  ngAfterContentInit(): void {
    this.loading$
      .pipe(
        startWith(this.loading),
        filter(() => !!this.iconDirectiveElement),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(loading => {
        const nativeElement = this.iconDirectiveElement.nativeElement;
        if (loading) {
          this.renderer.setStyle(nativeElement, 'display', 'none');
        } else {
          this.renderer.removeStyle(nativeElement, 'display');
        }
      });
  }

  insertSpan(): void {
    this.elementRef.nativeElement.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent!.trim().length > 0) {
        const span = this.renderer.createElement('span');
        const parent = this.renderer.parentNode(node);
        this.renderer.insertBefore(parent, span, node);
        this.renderer.appendChild(span, node);
      }
    });
  }
}
