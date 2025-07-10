/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriIconDirective, TriIconModule } from 'ng-zorro-antd/icon';
import { NZ_SPACE_COMPACT_ITEM_TYPE, NZ_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

export type TriButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text' | null;
export type TriButtonShape = 'circle' | 'round' | null;
export type TriButtonSize = TriSizeLDSType;

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'button';

@Component({
  selector: '',
  exportAs: 'triButton',
  imports: [TriIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (loading) {
      <tri-icon type="loading" />
    }
    <ng-content></ng-content>
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
    '[class.tri-btn-rtl]': `dir === 'rtl'`,
    '[class.tri-btn-icon-only]': `iconOnly`,
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
    '[attr.disabled]': 'disabled || null'
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  providers: [{ provide: NZ_SPACE_COMPACT_ITEM_TYPE, useValue: 'btn' }]
})
export class TriButtonComponent implements OnChanges, AfterViewInit, AfterContentInit, OnInit {
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  @ContentChild(TriIconDirective, { read: ElementRef }) iconDirectiveElement!: ElementRef;
  @Input({ transform: booleanAttribute }) block: boolean = false;
  @Input({ transform: booleanAttribute }) ghost: boolean = false;
  @Input({ transform: booleanAttribute }) search: boolean = false;
  @Input({ transform: booleanAttribute }) loading: boolean = false;
  @Input({ transform: booleanAttribute }) danger: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input() tabIndex: number | string | null = null;
  @Input() type: TriButtonType = null;
  @Input() shape: TriButtonShape = null;
  @Input() @WithConfig() size: TriButtonSize = 'default';
  dir: Direction = 'ltr';

  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);
  private compactSize = inject(NZ_SPACE_COMPACT_SIZE, { optional: true });
  private loading$ = new Subject<boolean>();

  insertSpan(nodes: NodeList, renderer: Renderer2): void {
    nodes.forEach(node => {
      if (node.nodeName === '#text') {
        const span = renderer.createElement('span');
        const parent = renderer.parentNode(node);
        renderer.insertBefore(parent, span, node);
        renderer.appendChild(span, node);
      }
    });
  }

  public get iconOnly(): boolean {
    const listOfNode = Array.from((this.elementRef?.nativeElement as HTMLButtonElement)?.childNodes || []);
    const noText = listOfNode.every(node => node.nodeName !== '#text');
    // ignore icon and comment
    const noSpan =
      listOfNode.filter(node => {
        return !(node.nodeName === '#comment' || !!(node as HTMLElement)?.classList?.contains('anticon'));
      }).length == 0;
    return !!this.iconDirectiveElement && noSpan && noText;
  }

  constructor() {
    onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => {
      this.#size.set(this.size);
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.#size.set(this.size);

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;

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
    this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
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
}
