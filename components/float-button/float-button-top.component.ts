/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  NgZone,
  numberAttribute,
  OnInit,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { fadeMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigService, withConfigFactory } from 'ng-zorro-antd/core/config';
import { TriScrollService } from 'ng-zorro-antd/core/services';
import { TriShapeSCType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular, generateClassName } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriFloatButtonComponent } from './float-button.component';
import { TriFloatButtonType } from './typings';

const withConfig = withConfigFactory('backTop');
const CLASS_NAME = 'ant-float-btn';

const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

@Component({
  selector: 'tri-float-button-top',
  exportAs: 'triFloatButtonTop',
  imports: [TriFloatButtonComponent, TriIconModule],
  animations: [fadeMotion],
  template: `
    <div #backTop @fadeMotion>
      <tri-float-button
        [icon]="icon() || top"
        [description]="description()"
        [href]="href()"
        [type]="type()"
        [shape]="shape()"
      ></tri-float-button>
      <ng-template #top>
        <tri-icon type="vertical-align-top" theme="outline" />
      </ng-template>
    </div>
  `,
  host: {
    '[class]': 'class()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriFloatButtonTopComponent implements OnInit {
  public configService = inject(TriConfigService);
  private scrollSrv = inject(TriScrollService);
  private platform = inject(Platform);
  private ngZone = inject(NgZone);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);

  readonly backTop = viewChild('backTop', { read: ElementRef });

  readonly visibilityHeight = input<number>();
  readonly href = input<string | null>(null);
  readonly type = input<TriFloatButtonType>('default');
  readonly shape = input<TriShapeSCType>('circle');
  readonly icon = input<string | TemplateRef<void> | null>(null);
  readonly description = input<TemplateRef<void> | null>(null);
  readonly template = input<TemplateRef<void> | null>(null);
  readonly target = input<string | HTMLElement | null>(null);
  readonly duration = input(450, { transform: numberAttribute });
  readonly onClick = output<boolean>();

  // compact global config
  readonly #visibilityHeight = withConfig('nzVisibilityHeight', this.visibilityHeight, 400);
  readonly _shape = linkedSignal(() => this.shape());
  protected readonly dir = this.directionality.valueSignal;
  protected readonly class = computed<string[]>(() => {
    const dir = this.dir();
    const classes = [CLASS_NAME, `${CLASS_NAME}-top`, this.generateClass(this._shape())];
    if (dir === 'rtl') {
      classes.push(this.generateClass(dir));
    }
    if (!this.visible()) {
      classes.push(this.generateClass('hidden'));
    }
    return classes;
  });

  #target?: HTMLElement | null = null;
  private readonly visible = signal<boolean>(false);
  private backTopClickSubscription = Subscription.EMPTY;
  private scrollListenerDestroy$ = new Subject<void>();

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.scrollListenerDestroy$.next();
      this.scrollListenerDestroy$.complete();
    });

    effect(() => {
      const target = this.target();
      if (target) {
        this.#target = typeof target === 'string' ? this.document.querySelector(target) : target;
        this.registerScrollEvent();
      }
    });

    effect(onCleanup => {
      const backTop = this.backTop();
      if (backTop) {
        this.backTopClickSubscription.unsubscribe();
        this.backTopClickSubscription = fromEventOutsideAngular(backTop.nativeElement, 'click')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.scrollSrv.scrollTo(this.getTarget(), 0, { duration: this.duration() });
            this.ngZone.run(() => this.onClick.emit(true));
          });
      }
      return onCleanup(() => {
        this.backTopClickSubscription.unsubscribe();
      });
    });

    effect(() => {
      this.#visibilityHeight();
      untracked(() => this.handleScroll());
    });
  }

  ngOnInit(): void {
    this.registerScrollEvent();
  }

  private getTarget(): HTMLElement | Window {
    return this.#target || window;
  }

  private handleScroll(): void {
    if (
      !this.platform.isBrowser ||
      this.visible() === this.scrollSrv.getScroll(this.getTarget()) > this.#visibilityHeight()
    ) {
      return;
    }
    this.visible.update(v => !v);
  }

  private registerScrollEvent(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.scrollListenerDestroy$.next();
    this.handleScroll();
    fromEventOutsideAngular(this.getTarget(), 'scroll', passiveEventListenerOptions as AddEventListenerOptions)
      .pipe(debounceTime(50), takeUntil(this.scrollListenerDestroy$))
      .subscribe(() => this.handleScroll());
  }

  private generateClass(suffix: string): string {
    return generateClassName(CLASS_NAME, suffix);
  }
}
