/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  Input,
  NgZone,
  OnChanges,
  PLATFORM_ID,
  PendingTasks,
  Renderer2,
  SimpleChanges,
  booleanAttribute,
  inject,
  numberAttribute
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animationFrameScheduler, asapScheduler, debounceTime, finalize } from 'rxjs';

import { IconDirective, ThemeType } from '@ant-design/icons-angular';

import { warn } from 'ng-zorro-antd/core/logger';
import { wrapIntoObservable } from 'ng-zorro-antd/core/util';

import { TriIconPatchService, TriIconService } from './icon.service';

@Directive({
  selector: 'tri-icon,[tri-icon]',
  exportAs: 'triIcon',
  host: {
    class: 'anticon'
  }
})
export class TriIconDirective extends IconDirective implements OnChanges, AfterContentChecked {
  private readonly ngZone = inject(NgZone);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  private pendingTasks = inject(PendingTasks);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  cacheClassName: string | null = null;
  @Input({ transform: booleanAttribute })
  set spin(value: boolean) {
    this.#spin = value;
  }

  @Input({ transform: numberAttribute }) rotate: number = 0;

  @Input()
  set type(value: string) {
    this.type = value;
  }

  @Input()
  set theme(value: ThemeType) {
    this.theme = value;
  }

  @Input()
  set twotoneColor(value: string) {
    this.twoToneColor = value;
  }

  @Input()
  set iconfont(value: string) {
    this.#iconfont = value;
  }

  hostClass?: string;

  private readonly el: HTMLElement;
  #iconfont?: string;
  #spin: boolean = false;

  constructor(public readonly iconService: TriIconService) {
    super(iconService);
    inject(TriIconPatchService, { optional: true })?.doPatch();
    this.el = this._elementRef.nativeElement;
  }

  override ngOnChanges(changes: SimpleChanges): void {
    const { nzType, nzTwotoneColor, nzSpin, nzTheme, nzRotate } = changes;

    if (nzType || nzTwotoneColor || nzSpin || nzTheme) {
      // This is used to reduce the number of change detections
      // while the icon is being loaded asynchronously.
      this.ngZone.runOutsideAngular(() => this.changeIcon2());
    } else if (nzRotate) {
      this.handleRotate(this.el.firstChild as SVGElement);
    } else {
      this._setSVGElement(this.iconService.createIconfontIcon(`#${this.#iconfont}`));
    }
  }

  /**
   * If custom content is provided, try to normalize SVG elements.
   */
  ngAfterContentChecked(): void {
    if (!this.type) {
      const children = this.el.children;
      let length = children.length;
      if (!this.type && children.length) {
        while (length--) {
          const child = children[length];
          if (child.tagName.toLowerCase() === 'svg') {
            this.iconService.normalizeSvgElement(child as SVGElement);
          }
        }
      }
    }
  }

  /**
   * Replacement of `changeIcon` for more modifications.
   */
  private changeIcon2(): void {
    this.setClassName();

    // It is used to hydrate the icon component properly when
    // zoneless change detection is used in conjunction with server-side rendering.
    const removeTask = this.pendingTasks.add();

    const svgOrRemove$ = wrapIntoObservable(this._changeIcon()).pipe(
      // We need to individually debounce the icon rendering on each animation
      // frame to prevent frame drops when many icons are being rendered on the
      // page, such as in a `@for` loop.
      debounceTime(0, this.isBrowser ? animationFrameScheduler : asapScheduler),
      takeUntilDestroyed(this.destroyRef),
      finalize(removeTask)
    );

    svgOrRemove$.subscribe({
      next: svgOrRemove => {
        // Get back into the Angular zone after completing all the tasks.
        // Since we manually run change detection locally, we have to re-enter
        // the zone because the change detection might also be run on other local
        // components, leading them to handle template functions outside of the Angular zone.
        this.ngZone.run(() => {
          // The _changeIcon method would call Renderer to remove the element of the old icon,
          // which would call `markElementAsRemoved` eventually,
          // so we should call `detectChanges` to tell Angular remove the DOM node.
          // #7186
          this.changeDetectorRef.detectChanges();

          if (svgOrRemove) {
            this.setSVGData(svgOrRemove);
            this.handleSpin(svgOrRemove);
            this.handleRotate(svgOrRemove);
          }
        });
      },
      error: warn
    });
  }

  private handleSpin(svg: SVGElement): void {
    if (this.#spin || this.type === 'loading') {
      this.renderer.addClass(svg, 'anticon-spin');
    } else {
      this.renderer.removeClass(svg, 'anticon-spin');
    }
  }

  private handleRotate(svg: SVGElement): void {
    if (this.rotate) {
      this.renderer.setAttribute(svg, 'style', `transform: rotate(${this.rotate}deg)`);
    } else {
      this.renderer.removeAttribute(svg, 'style');
    }
  }

  private setClassName(): void {
    if (this.cacheClassName) {
      this.renderer.removeClass(this.el, this.cacheClassName);
    }
    this.cacheClassName = `anticon-${this.type}`;
    this.renderer.addClass(this.el, this.cacheClassName);
  }

  private setSVGData(svg: SVGElement): void {
    this.renderer.setAttribute(svg, 'data-icon', this.type as string);
    this.renderer.setAttribute(svg, 'aria-hidden', 'true');
  }
}
