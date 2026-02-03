/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { cancelAnimationFrame, requestAnimationFrame } from 'ng-zorro-antd/core/polyfill';
import { TriResizeService } from 'ng-zorro-antd/core/services';
import { TriTSType } from 'ng-zorro-antd/core/types';
import { isStyleSupport, measure } from 'ng-zorro-antd/core/util';
import { TriI18nService, TriTextI18nInterface } from 'ng-zorro-antd/i18n';

import { TriTextCopyComponent } from './text-copy.component';
import { TriTextEditComponent } from './text-edit.component';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'typography';
const EXPAND_ELEMENT_CLASSNAME = 'ant-typography-expand';

@Component({
  selector: `
  nz-typography,
  [nz-typography],
  p[nz-paragraph],
  span[nz-text],
  h1[nz-title], h2[nz-title], h3[nz-title], h4[nz-title]
  `,
  exportAs: 'triTypography',
  template: `
    <ng-template #contentTemplate let-content="content">
      @if (!content) {
        <ng-content />
      }
      {{ content }}
    </ng-template>
    @if (!editing) {
      @if (
        expanded ||
        (!hasOperationsWithEllipsis && ellipsisRows === 1 && !hasEllipsisObservers) ||
        canCssEllipsis ||
        (suffix && expanded)
      ) {
        <ng-template [ngTemplateOutlet]="contentTemplate" [ngTemplateOutletContext]="{ content: content }" />
        @if (suffix) {
          {{ suffix }}
        }
      } @else {
        <span #ellipsisContainer></span>
        @if (isEllipsis) {
          {{ ellipsisStr }}
        }
        @if (suffix) {
          {{ suffix }}
        }
        @if (expandable && isEllipsis) {
          <a #expandable class="tri-typography-expand" (click)="onExpand()">
            {{ locale?.expand }}
          </a>
        }
      }
    }

    @if (editable) {
      <tri-text-edit
        [text]="content"
        [icon]="editIcon"
        [tooltip]="editTooltip"
        (endEditing)="onEndEditing($event)"
        (startEditing)="onStartEditing()"
      />
    }

    @if (copyable && !editing) {
      <tri-text-copy
        [text]="copyText"
        [tooltips]="copyTooltips"
        [icons]="copyIcons"
        (textCopy)="onTextCopy($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.tri-typography]': '!editing',
    '[class.tri-typography-rtl]': 'dir === "rtl"',
    '[class.tri-typography-edit-content]': 'editing',
    '[class.tri-typography-secondary]': 'type === "secondary"',
    '[class.tri-typography-warning]': 'type === "warning"',
    '[class.tri-typography-danger]': 'type === "danger"',
    '[class.tri-typography-success]': 'type === "success"',
    '[class.tri-typography-disabled]': 'disabled',
    '[class.tri-typography-ellipsis]': 'ellipsis && !expanded',
    '[class.tri-typography-single-line]': 'ellipsis && ellipsisRows === 1',
    '[class.tri-typography-ellipsis-single-line]': 'canCssEllipsis && ellipsisRows === 1',
    '[class.tri-typography-ellipsis-multiple-line]': 'canCssEllipsis && ellipsisRows > 1',
    '[style.-webkit-line-clamp]': '(canCssEllipsis && nzEllipsisRows > 1) ? nzEllipsisRows : null'
  },
  imports: [NgTemplateOutlet, TriTextEditComponent, TriTextCopyComponent]
})
export class TriTypographyComponent implements OnInit, AfterViewInit, OnChanges {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  configService = inject(TriConfigService);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private cdr = inject(ChangeDetectorRef);
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private platform = inject(Platform);
  private i18n = inject(TriI18nService);
  private resizeService = inject(TriResizeService);
  private directionality = inject(Directionality);
  private document: Document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  @Input({ transform: booleanAttribute }) copyable = false;
  @Input({ transform: booleanAttribute }) editable = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) expandable = false;
  @Input({ transform: booleanAttribute }) ellipsis = false;
  @Input() @WithConfig() copyTooltips?: [TriTSType, TriTSType] | null = undefined;
  @Input() @WithConfig() copyIcons: [TriTSType, TriTSType] = ['copy', 'check'];
  @Input() @WithConfig() editTooltip?: null | TriTSType = undefined;
  @Input() @WithConfig() editIcon: TriTSType = 'edit';
  @Input() content?: string;
  @Input({ transform: numberAttribute }) @WithConfig() ellipsisRows: number = 1;
  @Input() type: 'secondary' | 'warning' | 'danger' | 'success' | undefined;
  @Input() copyText: string | undefined;
  @Input() suffix: string | undefined;
  @Output() readonly contentChange = new EventEmitter<string>();
  @Output() readonly copy = new EventEmitter<string>();
  @Output() readonly expandChange = new EventEmitter<void>();
  // This is not a two-way binding output with {@link nzEllipsis}
  @Output() readonly onEllipsis = new EventEmitter<boolean>();

  @ViewChild(TriTextEditComponent, { static: false }) textEditRef?: TriTextEditComponent;
  @ViewChild(TriTextCopyComponent, { static: false }) textCopyRef?: TriTextCopyComponent;
  @ViewChild('ellipsisContainer', { static: false }) ellipsisContainer?: ElementRef<HTMLSpanElement>;
  @ViewChild('expandable', { static: false }) expandableBtn?: ElementRef<HTMLSpanElement>;
  @ViewChild('contentTemplate', { static: false }) contentTemplate?: TemplateRef<{ content: string }>;

  locale!: TriTextI18nInterface;
  expandableBtnElementCache: HTMLElement | null = null;
  editing = false;
  ellipsisText: string | undefined;
  cssEllipsis: boolean = false;
  isEllipsis: boolean = true;
  expanded: boolean = false;
  ellipsisStr = '...';
  dir: Direction = 'ltr';

  get hasEllipsisObservers(): boolean {
    return this.onEllipsis.observers.length > 0;
  }

  get canCssEllipsis(): boolean {
    return this.ellipsis && this.cssEllipsis && !this.expanded && !this.hasEllipsisObservers;
  }

  get hasOperationsWithEllipsis(): boolean {
    return (this.copyable || this.editable || this.expandable) && this.ellipsis;
  }

  private viewInit = false;
  private requestId: number = -1;
  private windowResizeSubscription = Subscription.EMPTY;

  get _copyText(): string {
    return (typeof this.copyText === 'string' ? this.copyText : this.content)!;
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.expandableBtnElementCache = null;
      this.windowResizeSubscription.unsubscribe();
    });
  }

  onTextCopy(text: string): void {
    this.copy.emit(text);
  }

  onStartEditing(): void {
    this.editing = true;
  }

  onEndEditing(text: string): void {
    this.editing = false;
    this.contentChange.emit(text);
    if (this.content === text) {
      this.renderOnNextFrame();
    }
    this.cdr.markForCheck();
  }

  onExpand(): void {
    this.isEllipsis = false;
    this.expanded = true;
    this.expandChange.emit();
    this.onEllipsis.emit(false);
  }

  canUseCSSEllipsis(): boolean {
    if (this.editable || this.copyable || this.expandable || this.suffix) {
      return false;
    }
    // make sure {@link nzOnEllipsis} works, will force use JS to calculations
    if (this.hasEllipsisObservers) {
      return false;
    }
    if (this.ellipsisRows === 1) {
      return isStyleSupport('textOverflow');
    } else {
      return isStyleSupport('webkitLineClamp');
    }
  }

  renderOnNextFrame(): void {
    cancelAnimationFrame(this.requestId);
    if (!this.viewInit || !this.ellipsis || this.ellipsisRows < 0 || this.expanded || !this.platform.isBrowser) {
      return;
    }
    this.requestId = requestAnimationFrame(() => this.syncEllipsis());
  }

  getOriginContentViewRef(): { viewRef: EmbeddedViewRef<{ content: string }>; removeView(): void } {
    const viewRef = this.viewContainerRef.createEmbeddedView<{ content: string }>(this.contentTemplate!, {
      content: this.content!
    });
    viewRef.detectChanges();
    return {
      viewRef,
      removeView: () => this.viewContainerRef.remove(this.viewContainerRef.indexOf(viewRef))
    };
  }

  syncEllipsis(): void {
    if (this.cssEllipsis) {
      return;
    }
    const { viewRef, removeView } = this.getOriginContentViewRef();
    const fixedNodes = [this.textCopyRef, this.textEditRef]
      .filter(e => e && e.nativeElement)
      .map(e => e!.nativeElement);
    const expandableBtnElement = this.getExpandableBtnElement();
    if (expandableBtnElement) {
      fixedNodes.push(expandableBtnElement);
    }
    const { contentNodes, text, ellipsis } = measure(
      this.el,
      this.ellipsisRows,
      viewRef.rootNodes,
      fixedNodes,
      this.ellipsisStr,
      this.suffix
    );

    removeView();

    this.ellipsisText = text;
    if (ellipsis !== this.isEllipsis) {
      this.isEllipsis = ellipsis;
      this.onEllipsis.emit(ellipsis);
    }
    const ellipsisContainerNativeElement = this.ellipsisContainer!.nativeElement;
    while (ellipsisContainerNativeElement.firstChild) {
      this.renderer.removeChild(ellipsisContainerNativeElement, ellipsisContainerNativeElement.firstChild);
    }
    contentNodes.forEach(n => {
      this.renderer.appendChild(ellipsisContainerNativeElement, n.cloneNode(true));
    });
    this.cdr.markForCheck();
  }

  // Need to create the element for calculation size before view init
  private getExpandableBtnElement(): HTMLElement | null {
    if (this.expandable) {
      const expandText = this.locale ? this.locale.expand : '';
      const cache = this.expandableBtnElementCache;
      if (!cache || cache.innerText === expandText) {
        const el = this.document.createElement('a');
        el.className = EXPAND_ELEMENT_CLASSNAME;
        el.innerText = expandText;
        this.expandableBtnElementCache = el;
      }
      return this.expandableBtnElementCache;
    } else {
      this.expandableBtnElementCache = null;
      return null;
    }
  }

  private renderAndSubscribeWindowResize(): void {
    if (this.platform.isBrowser) {
      this.windowResizeSubscription.unsubscribe();
      this.cssEllipsis = this.canUseCSSEllipsis();
      this.renderOnNextFrame();
      this.windowResizeSubscription = this.resizeService
        .connect()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.renderOnNextFrame());
    }
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Text');
      this.cdr.markForCheck();
    });

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
    this.renderAndSubscribeWindowResize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzCopyable, nzEditable, nzExpandable, nzEllipsis, nzContent, nzEllipsisRows, nzSuffix } = changes;
    if (nzCopyable || nzEditable || nzExpandable || nzEllipsis || nzContent || nzEllipsisRows || nzSuffix) {
      if (this.ellipsis) {
        if (this.expanded) {
          this.windowResizeSubscription.unsubscribe();
        } else {
          this.renderAndSubscribeWindowResize();
        }
      }
    }
  }
}
