/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
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
  EventEmitter,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { TriAffixModule } from 'ng-zorro-antd/affix';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriScrollService } from 'ng-zorro-antd/core/services';
import { NgStyleInterface, TriDirectionVHType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular, numberAttributeWithZeroFallback } from 'ng-zorro-antd/core/util';

import { TriAnchorLinkComponent } from './anchor-link.component';
import { getOffsetTop } from './util';

interface Section {
  comp: TriAnchorLinkComponent;
  top: number;
}

const VISIBLE_CLASSNAME = 'ant-anchor-ink-ball-visible';
const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'anchor';
const sharpMatcherRegx = /#([^#]+)$/;

const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

@Component({
  selector: 'tri-anchor',
  exportAs: 'triAnchor',
  imports: [NgTemplateOutlet, TriAffixModule],
  template: `
    @if (affix) {
      <tri-affix [offsetTop]="offsetTop" [target]="container">
        <ng-template [ngTemplateOutlet]="content" />
      </tri-affix>
    } @else {
      <ng-template [ngTemplateOutlet]="content" />
    }

    <ng-template #content>
      <div
        class="tri-anchor-wrapper"
        [class]="{ 'ant-anchor-wrapper-horizontal': direction === 'horizontal' }"
        [style]="wrapperStyle"
      >
        <div class="tri-anchor" [class]="{ 'ant-anchor-fixed': !affix && !showInkInFixed }">
          <div class="tri-anchor-ink">
            <div class="tri-anchor-ink-ball" #ink></div>
          </div>
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriAnchorComponent implements AfterViewInit, OnChanges {
  public configService = inject(TriConfigService);
  private scrollSrv = inject(TriScrollService);
  private cdr = inject(ChangeDetectorRef);
  private platform = inject(Platform);
  private renderer = inject(Renderer2);
  private doc: Document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @ViewChild('ink', { static: false }) private ink!: ElementRef;

  @Input({ transform: booleanAttribute }) affix = true;

  @Input({ transform: booleanAttribute })
  @WithConfig()
  showInkInFixed: boolean = false;

  @Input({ transform: numberAttribute })
  @WithConfig()
  bounds: number = 5;

  @Input({ transform: numberAttributeWithZeroFallback })
  @WithConfig()
  offsetTop?: number = undefined;

  @Input({ transform: numberAttributeWithZeroFallback })
  @WithConfig()
  targetOffset?: number = undefined;

  @Input() container?: string | HTMLElement;
  @Input() currentAnchor?: string;
  @Input() direction: TriDirectionVHType = 'vertical';

  @Output() readonly click = new EventEmitter<string>();
  @Output() readonly change = new EventEmitter<string>();
  @Output() readonly scroll = new EventEmitter<TriAnchorLinkComponent>();

  visible = false;
  wrapperStyle: NgStyleInterface = { 'max-height': '100vh' };

  _container?: HTMLElement | Window;
  activeLink?: string;

  private links: TriAnchorLinkComponent[] = [];
  private animating = false;
  private destroy$ = new Subject<boolean>();
  private handleScrollTimeoutID?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.handleScrollTimeoutID);
      this.destroy$.next(true);
      this.destroy$.complete();
    });
  }

  registerLink(link: TriAnchorLinkComponent): void {
    this.links.push(link);
  }

  unregisterLink(link: TriAnchorLinkComponent): void {
    this.links.splice(this.links.indexOf(link), 1);
  }

  private getContainer(): HTMLElement | Window {
    return this._container || window;
  }

  ngAfterViewInit(): void {
    this.registerScrollEvent();
  }
  private registerScrollEvent(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.destroy$.next(true);

    fromEventOutsideAngular(this.getContainer(), 'scroll', passiveEventListenerOptions)
      .pipe(throttleTime(50), takeUntil(this.destroy$))
      .subscribe(() => this.handleScroll());
    // Browser would maintain the scrolling position when refreshing.
    // So we have to delay calculation in avoid of getting a incorrect result.
    this.handleScrollTimeoutID = setTimeout(() => this.handleScroll());
  }

  handleScroll(): void {
    if (typeof document === 'undefined' || this.animating) {
      return;
    }

    const sections: Section[] = [];
    const offsetTop = this.targetOffset ? this.targetOffset : this.offsetTop || 0;
    const scope = offsetTop + this.bounds;
    this.links.forEach(comp => {
      const sharpLinkMatch = sharpMatcherRegx.exec(comp.href.toString());
      if (!sharpLinkMatch) {
        return;
      }
      const target = this.doc.getElementById(sharpLinkMatch[1]);
      if (target) {
        const top = getOffsetTop(target, this.getContainer());
        if (top < scope) {
          sections.push({
            top,
            comp
          });
        }
      }
    });

    this.visible = !!sections.length;
    if (!this.visible) {
      this.clearActive();
      this.cdr.detectChanges();
    } else {
      const maxSection = sections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev));
      this.handleActive(maxSection.comp);
    }
    this.setVisible();
  }

  private clearActive(): void {
    this.links.forEach(i => {
      i.unsetActive();
    });
  }

  private setActive(comp?: TriAnchorLinkComponent): void {
    const originalActiveLink = this.activeLink;
    const targetComp = (this.currentAnchor && this.links.find(n => n.href === this.currentAnchor)) || comp;
    if (!targetComp) return;

    targetComp.setActive();
    const linkNode = targetComp.getLinkTitleElement();
    if (this.direction === 'vertical') {
      this.ink.nativeElement.style.top = `${linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5}px`;
    } else {
      this.ink.nativeElement.style.left = `${linkNode.offsetLeft + linkNode.clientWidth / 2}px`;
    }
    this.activeLink = (comp || targetComp).href;
    if (originalActiveLink !== this.activeLink) {
      this.change.emit(this.activeLink);
    }
  }

  private handleActive(comp: TriAnchorLinkComponent): void {
    this.clearActive();
    this.setActive(comp);
    this.visible = true;
    this.setVisible();
    this.scroll.emit(comp);
  }

  private setVisible(): void {
    if (this.ink) {
      const visible = this.visible;
      if (visible) {
        this.renderer.addClass(this.ink.nativeElement, VISIBLE_CLASSNAME);
      } else {
        this.renderer.removeClass(this.ink.nativeElement, VISIBLE_CLASSNAME);
      }
    }
  }

  handleScrollTo(linkComp: TriAnchorLinkComponent): void {
    const el = this.doc.querySelector<HTMLElement>(linkComp.href);
    if (!el) {
      return;
    }

    this.animating = true;
    const containerScrollTop = this.scrollSrv.getScroll(this.getContainer());
    const elOffsetTop = getOffsetTop(el, this.getContainer());
    let targetScrollTop = containerScrollTop + elOffsetTop;
    targetScrollTop -= this.targetOffset !== undefined ? this.targetOffset : this.offsetTop || 0;
    this.scrollSrv.scrollTo(this.getContainer(), targetScrollTop, {
      callback: () => {
        this.animating = false;
        this.handleActive(linkComp);
      }
    });
    this.click.emit(linkComp.href);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOffsetTop, nzContainer, nzCurrentAnchor } = changes;
    if (nzOffsetTop) {
      this.wrapperStyle = {
        'max-height': `calc(100vh - ${this.offsetTop}px)`
      };
    }
    if (nzContainer) {
      const container = this.container;
      this._container = typeof container === 'string' ? this.doc.querySelector<HTMLElement>(container)! : container;
      this.registerScrollEvent();
    }
    if (nzCurrentAnchor) {
      this.setActive();
    }
  }
}
