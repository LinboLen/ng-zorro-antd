/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge, ReplaySubject, Subscription } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { TriConfigKey, WithConfig } from 'ng-zorro-antd/core/config';
import { TriScrollService } from 'ng-zorro-antd/core/services';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { getStyleAsText, numberAttributeWithZeroFallback, shallowEqual } from 'ng-zorro-antd/core/util';

import { AffixRespondEvents } from './respond-events';
import { getTargetRect, SimpleRect } from './utils';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'affix';
const TRI_AFFIX_CLS_PREFIX = 'ant-affix';
const TRI_AFFIX_DEFAULT_SCROLL_TIME = 20;
const NOOP_EVENT = {} as Event;

@Component({
  selector: 'tri-affix',
  exportAs: 'triAffix',
  template: `
    <div #fixedEl>
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriAffixComponent implements OnChanges {
  private readonly scrollSrv = inject(TriScrollService);
  private readonly ngZone = inject(NgZone);
  private readonly platform = inject(Platform);
  private readonly renderer = inject(Renderer2);
  private readonly resizeObserver = inject(TriResizeObserver);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly placeholderNode: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @ViewChild('fixedEl', { static: true }) private fixedEl!: ElementRef<HTMLDivElement>;

  @Input() target?: string | Element | Window;

  @Input({ transform: numberAttributeWithZeroFallback })
  @WithConfig()
  offsetTop?: null | number;

  @Input({ transform: numberAttributeWithZeroFallback })
  @WithConfig()
  offsetBottom?: null | number;

  readonly change = output<boolean>();

  private affixStyle?: NgStyleInterface;
  private placeholderStyle?: NgStyleInterface;
  private positionChangeSubscription = Subscription.EMPTY;
  private offsetChanged$ = new ReplaySubject<void>(1);
  private timeout?: ReturnType<typeof setTimeout>;

  get #target(): Element | Window {
    const el = this.target;
    return (typeof el === 'string' ? this.document.querySelector(el) : el) || window;
  }

  constructor() {
    effect(() => {
      this.directionality.valueSignal();
      this.registerListeners();
      this.updatePosition(NOOP_EVENT);
    });

    this.destroyRef.onDestroy(() => {
      this.removeListeners();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOffsetBottom, nzOffsetTop, nzTarget } = changes;

    if (nzOffsetBottom || nzOffsetTop) {
      this.offsetChanged$.next();
    }
    if (nzTarget) {
      this.registerListeners();
    }
  }

  private registerListeners(): void {
    if (!this.platform.isBrowser) {
      return;
    }

    this.removeListeners();
    const el = this.#target === window ? this.document.body : (this.#target as Element);
    this.positionChangeSubscription = this.ngZone.runOutsideAngular(() =>
      merge(
        ...Object.keys(AffixRespondEvents).map(evName => fromEvent(this.#target, evName)),
        this.offsetChanged$.pipe(map(() => NOOP_EVENT)),
        this.resizeObserver.observe(el)
      )
        .pipe(
          throttleTime(TRI_AFFIX_DEFAULT_SCROLL_TIME, undefined, { trailing: true }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(e => this.updatePosition(e as Event))
    );
    this.timeout = setTimeout(() => this.updatePosition(NOOP_EVENT));
  }

  private removeListeners(): void {
    clearTimeout(this.timeout);
    this.positionChangeSubscription.unsubscribe();
  }

  getOffset(element: Element, target: Element | Window | undefined): SimpleRect {
    const elemRect = element.getBoundingClientRect();
    const targetRect = getTargetRect(target!);

    const scrollTop = this.scrollSrv.getScroll(target, true);
    const scrollLeft = this.scrollSrv.getScroll(target, false);

    const docElem = this.document.body;
    const clientTop = docElem.clientTop || 0;
    const clientLeft = docElem.clientLeft || 0;

    return {
      top: elemRect.top - targetRect.top + scrollTop - clientTop,
      left: elemRect.left - targetRect.left + scrollLeft - clientLeft,
      width: elemRect.width,
      height: elemRect.height
    };
  }

  private setAffixStyle(e: Event, affixStyle?: NgStyleInterface): void {
    const originalAffixStyle = this.affixStyle;
    if (e.type === 'scroll' && originalAffixStyle && affixStyle && this.#target === window) {
      return;
    }
    if (shallowEqual(originalAffixStyle, affixStyle)) {
      return;
    }

    const fixed = !!affixStyle;
    const wrapEl = this.fixedEl.nativeElement;
    this.renderer.setStyle(wrapEl, 'cssText', getStyleAsText(affixStyle));
    this.affixStyle = affixStyle;
    if (fixed) {
      wrapEl.classList.add(TRI_AFFIX_CLS_PREFIX);
    } else {
      wrapEl.classList.remove(TRI_AFFIX_CLS_PREFIX);
    }
    this.updateRtlClass();
    if ((affixStyle && !originalAffixStyle) || (!affixStyle && originalAffixStyle)) {
      this.change.emit(fixed);
    }
  }

  private setPlaceholderStyle(placeholderStyle?: NgStyleInterface): void {
    const originalPlaceholderStyle = this.placeholderStyle;
    if (shallowEqual(placeholderStyle, originalPlaceholderStyle)) {
      return;
    }
    this.renderer.setStyle(this.placeholderNode, 'cssText', getStyleAsText(placeholderStyle));
    this.placeholderStyle = placeholderStyle;
  }

  private syncPlaceholderStyle(e: Event): void {
    if (!this.affixStyle) {
      return;
    }
    this.renderer.setStyle(this.placeholderNode, 'cssText', '');
    this.placeholderStyle = undefined;
    const styleObj = {
      width: this.placeholderNode.offsetWidth,
      height: this.fixedEl.nativeElement.offsetHeight
    };
    this.setAffixStyle(e, {
      ...this.affixStyle,
      ...styleObj
    });
    this.setPlaceholderStyle(styleObj);
  }

  updatePosition(e: Event): void {
    if (!this.platform.isBrowser) {
      return;
    }

    const targetNode = this.#target;
    let offsetTop = this.offsetTop;
    const scrollTop = this.scrollSrv.getScroll(targetNode, true);
    const elemOffset = this.getOffset(this.placeholderNode, targetNode!);
    const fixedNode = this.fixedEl.nativeElement;
    const elemSize = {
      width: fixedNode.offsetWidth,
      height: fixedNode.offsetHeight
    };
    const offsetMode = {
      top: false,
      bottom: false
    };
    // Default to `offsetTop=0`.
    if (typeof offsetTop !== 'number' && typeof this.offsetBottom !== 'number') {
      offsetMode.top = true;
      offsetTop = 0;
    } else {
      offsetMode.top = typeof offsetTop === 'number';
      offsetMode.bottom = typeof this.offsetBottom === 'number';
    }
    const targetRect = getTargetRect(targetNode);
    const targetInnerHeight = (targetNode as Window).innerHeight || (targetNode as HTMLElement).clientHeight;
    if (scrollTop >= elemOffset.top - (offsetTop as number) && offsetMode.top) {
      const width = elemOffset.width;
      const top = targetRect.top + (offsetTop as number);
      this.setAffixStyle(e, {
        position: 'fixed',
        top,
        left: targetRect.left + elemOffset.left,
        width
      });
      this.setPlaceholderStyle({
        width,
        height: elemSize.height
      });
    } else if (
      scrollTop <= elemOffset.top + elemSize.height + (this.offsetBottom as number) - targetInnerHeight &&
      offsetMode.bottom
    ) {
      const targetBottomOffset = targetNode === window ? 0 : window.innerHeight - targetRect.bottom!;
      const width = elemOffset.width;
      this.setAffixStyle(e, {
        position: 'fixed',
        bottom: targetBottomOffset + (this.offsetBottom as number),
        left: targetRect.left + elemOffset.left,
        width
      });
      this.setPlaceholderStyle({
        width,
        height: elemOffset.height
      });
    } else {
      if (
        e.type === AffixRespondEvents.resize &&
        this.affixStyle &&
        this.affixStyle.position === 'fixed' &&
        this.placeholderNode.offsetWidth
      ) {
        this.setAffixStyle(e, {
          ...this.affixStyle,
          width: this.placeholderNode.offsetWidth
        });
      } else {
        this.setAffixStyle(e);
      }
      this.setPlaceholderStyle();
    }

    if (e.type === 'resize') {
      this.syncPlaceholderStyle(e);
    }
  }

  private updateRtlClass(): void {
    const wrapEl = this.fixedEl.nativeElement;
    if (this.directionality.valueSignal() === 'rtl' && wrapEl.classList.contains(TRI_AFFIX_CLS_PREFIX)) {
      wrapEl.classList.add(`${TRI_AFFIX_CLS_PREFIX}-rtl`);
    } else {
      wrapEl.classList.remove(`${TRI_AFFIX_CLS_PREFIX}-rtl`);
    }
  }
}
