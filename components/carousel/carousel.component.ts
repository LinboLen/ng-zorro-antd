/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriDragService, TriResizeService } from 'ng-zorro-antd/core/services';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriCarouselContentDirective } from './carousel-content.directive';
import { TriCarouselBaseStrategy } from './strategies/base-strategy';
import { TriCarouselOpacityStrategy } from './strategies/opacity-strategy';
import { TriCarouselTransformStrategy } from './strategies/transform-strategy';
import {
  FromToInterface,
  TRI_CAROUSEL_CUSTOM_STRATEGIES,
  TriCarouselDotPosition,
  TriCarouselEffects,
  PointerVector
} from './typings';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'carousel';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triCarousel',
  template: `
    <div
      class="slick-initialized slick-slider"
      [class.slick-vertical]="dotPosition === 'left' || dotPosition === 'right'"
      [dir]="'ltr'"
    >
      <div
        #slickList
        class="slick-list"
        tabindex="-1"
        (mousedown)="pointerDown($event)"
        (touchstart)="pointerDown($event)"
      >
        <!-- Render carousel items. -->
        <div class="slick-track" #slickTrack>
          <ng-content></ng-content>
        </div>
      </div>
      <!-- Render dots. -->
      @if (dots) {
        <ul
          class="slick-dots"
          [class.slick-dots-top]="dotPosition === 'top'"
          [class.slick-dots-bottom]="dotPosition === 'bottom'"
          [class.slick-dots-left]="dotPosition === 'left'"
          [class.slick-dots-right]="dotPosition === 'right'"
        >
          @for (content of carouselContents; track content) {
            <li [class.slick-active]="$index === activeIndex" (click)="goTo($index)">
              <ng-template
                [ngTemplateOutlet]="dotRender || renderDotTemplate"
                [ngTemplateOutletContext]="{ $implicit: $index }"
              ></ng-template>
            </li>
          }
        </ul>
      }
    </div>

    <ng-template #renderDotTemplate let-index>
      <button>{{ index + 1 }}</button>
    </ng-template>
  `,
  host: {
    class: 'tri-carousel',
    '[class.tri-carousel-vertical]': 'vertical',
    '[class.tri-carousel-rtl]': `dir === 'rtl'`
  },
  imports: [NgTemplateOutlet]
})
export class TriCarouselComponent implements AfterContentInit, AfterViewInit, OnChanges, OnInit {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  public readonly configService = inject(TriConfigService);
  public readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platform = inject(Platform);
  private readonly resizeService = inject(TriResizeService);
  private readonly dragService = inject(TriDragService);
  private resizeObserver = inject(TriResizeObserver);
  private destroyRef = inject(DestroyRef);

  @ContentChildren(TriCarouselContentDirective) carouselContents!: QueryList<TriCarouselContentDirective>;

  @ViewChild('slickList', { static: true }) slickList!: ElementRef<HTMLElement>;
  @ViewChild('slickTrack', { static: true }) slickTrack!: ElementRef<HTMLElement>;

  @Input() dotRender?: TemplateRef<{ $implicit: number }>;
  @Input() @WithConfig() effect: TriCarouselEffects = 'scrollx';
  @Input({ transform: booleanAttribute }) @WithConfig() enableSwipe: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() dots: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() autoPlay: boolean = false;
  @Input({ transform: numberAttribute }) @WithConfig() autoPlaySpeed: number = 3000;
  @Input({ transform: numberAttribute }) transitionSpeed = 500;
  @Input() @WithConfig() loop: boolean = true;

  /**
   * this property is passed directly to an NzCarouselBaseStrategy
   */
  @Input() strategyOptions: TriSafeAny = undefined;

  @Input()
  // @ts-ignore
  @WithConfig()
  set dotPosition(value: TriCarouselDotPosition) {
    this._dotPosition = value;
    this.vertical = value === 'left' || value === 'right';
  }

  get dotPosition(): TriCarouselDotPosition {
    return this._dotPosition;
  }

  private _dotPosition: TriCarouselDotPosition = 'bottom';

  @Output() readonly beforeChange = new EventEmitter<FromToInterface>();
  @Output() readonly afterChange = new EventEmitter<number>();

  activeIndex = 0;
  el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  slickListEl!: HTMLElement;
  slickTrackEl!: HTMLElement;
  strategy?: TriCarouselBaseStrategy;
  vertical = false;
  transitionInProgress?: ReturnType<typeof setTimeout>;
  dir: Direction = 'ltr';

  private gestureRect: DOMRect | null = null;
  private pointerDelta: PointerVector | null = null;
  private isTransiting = false;
  private isDragging = false;
  private directionality = inject(Directionality);
  private customStrategies = inject(TRI_CAROUSEL_CUSTOM_STRATEGIES, { optional: true });

  constructor() {
    this.dotPosition = 'bottom';
    this.destroyRef.onDestroy(() => {
      this.clearScheduledTransition();
      this.strategy?.dispose();
    });
  }

  ngOnInit(): void {
    this.slickListEl = this.slickList!.nativeElement;
    this.slickTrackEl = this.slickTrack!.nativeElement;

    this.dir = this.directionality.value;

    this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.markContentActive(this.activeIndex);
      this.cdr.detectChanges();
    });

    fromEventOutsideAngular<KeyboardEvent>(this.slickListEl, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        const { keyCode } = event;

        if (keyCode !== LEFT_ARROW && keyCode !== RIGHT_ARROW) {
          return;
        }

        event.preventDefault();

        this.ngZone.run(() => {
          if (keyCode === LEFT_ARROW) {
            this.pre();
          } else {
            this.next();
          }
          this.cdr.markForCheck();
        });
      });

    this.resizeObserver
      .observe(this.el)
      .pipe(debounceTime(100), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.layout());
  }

  ngAfterContentInit(): void {
    this.markContentActive(0);
  }

  ngAfterViewInit(): void {
    this.carouselContents.changes.subscribe(() => {
      this.markContentActive(0);
      this.layout();
    });

    this.resizeService
      .connect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.layout());

    this.switchStrategy();
    this.markContentActive(0);
    this.layout();

    // If embedded in an entry component, it may do initial render at an inappropriate time.
    // ngZone.onStable won't do this trick
    // TODO: need to change this.
    Promise.resolve().then(() => this.layout());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzEffect, nzDotPosition } = changes;

    if (nzEffect && !nzEffect.isFirstChange()) {
      this.switchStrategy();
      this.markContentActive(0);
      this.layout();
    }

    if (nzDotPosition && !nzDotPosition.isFirstChange()) {
      this.switchStrategy();
      this.markContentActive(0);
      this.layout();
    }

    if (!this.autoPlay || !this.autoPlaySpeed) {
      this.clearScheduledTransition();
    } else {
      this.scheduleNextTransition();
    }
  }

  next(): void {
    this.goTo(this.activeIndex + 1);
  }

  pre(): void {
    this.goTo(this.activeIndex - 1);
  }

  goTo(index: number): void {
    if (
      this.carouselContents &&
      this.carouselContents.length &&
      !this.isTransiting &&
      (this.loop || (index >= 0 && index < this.carouselContents.length))
    ) {
      const length = this.carouselContents.length;
      const from = this.activeIndex;
      const to = (index + length) % length;
      this.isTransiting = true;
      this.beforeChange.emit({ from, to });
      this.strategy!.switch(this.activeIndex, index).subscribe(() => {
        this.scheduleNextTransition();
        this.afterChange.emit(to);
        this.isTransiting = false;
      });
      this.markContentActive(to);
      this.cdr.markForCheck();
    }
  }

  private switchStrategy(): void {
    if (this.strategy) {
      this.strategy.dispose();
    }

    // Load custom strategies first.
    const customStrategy = this.customStrategies ? this.customStrategies.find(s => s.name === this.effect) : null;
    if (customStrategy) {
      this.strategy = new (customStrategy.strategy as TriSafeAny)(this, this.cdr, this.renderer, this.platform);
      return;
    }

    this.strategy =
      this.effect === 'scrollx'
        ? new TriCarouselTransformStrategy(this, this.cdr, this.renderer, this.platform)
        : new TriCarouselOpacityStrategy(this, this.cdr, this.renderer, this.platform);
  }

  private scheduleNextTransition(): void {
    this.clearScheduledTransition();
    if (this.autoPlay && this.autoPlaySpeed > 0 && this.platform.isBrowser) {
      this.transitionInProgress = setTimeout(() => {
        this.goTo(this.activeIndex + 1);
      }, this.autoPlaySpeed);
    }
  }

  private clearScheduledTransition(): void {
    if (this.transitionInProgress) {
      clearTimeout(this.transitionInProgress);
      this.transitionInProgress = undefined;
    }
  }

  private markContentActive(index: number): void {
    this.activeIndex = index;
    this.carouselContents?.forEach((slide, i) => (slide.isActive = index === i));
    this.cdr.markForCheck();
  }

  /**
   * Drag carousel.
   */
  pointerDown = (event: TouchEvent | MouseEvent): void => {
    if (!this.isDragging && !this.isTransiting && this.enableSwipe) {
      this.clearScheduledTransition();
      this.gestureRect = this.slickListEl.getBoundingClientRect();

      this.dragService.requestDraggingSequence(event).subscribe({
        next: delta => {
          this.pointerDelta = delta;
          this.isDragging = true;
          this.strategy?.dragging(this.pointerDelta);
        },
        complete: () => {
          if (this.enableSwipe && this.isDragging) {
            const xDelta = this.pointerDelta ? this.pointerDelta.x : 0;

            // Switch to another slide if delta is bigger than third of the width.
            if (
              Math.abs(xDelta) > this.gestureRect!.width / 3 &&
              (this.loop ||
                (xDelta <= 0 && this.activeIndex + 1 < this.carouselContents.length) ||
                (xDelta > 0 && this.activeIndex > 0))
            ) {
              this.goTo(xDelta > 0 ? this.activeIndex - 1 : this.activeIndex + 1);
            } else {
              this.goTo(this.activeIndex);
            }

            this.gestureRect = null;
            this.pointerDelta = null;
          }

          this.isDragging = false;
        }
      });
    }
  };

  layout(): void {
    this.strategy?.withCarouselContents(this.carouselContents);
  }
}
