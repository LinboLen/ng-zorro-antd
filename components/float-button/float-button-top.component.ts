/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  numberAttribute,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { fadeMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriScrollService } from 'ng-zorro-antd/core/services';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriFloatButtonComponent } from './float-button.component';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'backTop';

const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

@Component({
  selector: '',
  exportAs: 'triFloatButtonTop',
  imports: [TriFloatButtonComponent, TriIconModule],
  animations: [fadeMotion],
  template: `
    <div #backTop @fadeMotion>
      <tri-float-button
        [icon]="icon || top"
        [description]="description"
        [href]="href"
        [type]="type"
        [shape]="shape"
      ></tri-float-button>
      <ng-template #top>
        <tri-icon type="vertical-align-top" theme="outline" />
      </ng-template>
    </div>
  `,
  host: {
    class: 'tri-float-btn ant-float-btn-top',
    '[class.tri-float-btn-circle]': `shape === 'circle'`,
    '[class.tri-float-btn-hidden]': `!visible`,
    '[class.tri-float-btn-square]': `shape === 'square'`,
    '[class.tri-float-btn-rtl]': `dir === 'rtl'`
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriFloatButtonTopComponent implements OnInit, OnChanges {
  public configService = inject(TriConfigService);
  private scrollSrv = inject(TriScrollService);
  private platform = inject(Platform);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  private scrollListenerDestroy$ = new Subject<void>();
  #target?: HTMLElement | null = null;

  visible: boolean = false;
  dir: Direction = 'ltr';

  @Input() href: string | null = null;
  @Input() type: 'default' | 'primary' = 'default';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() icon: TemplateRef<void> | null = null;
  @Input() description: TemplateRef<void> | null = null;

  @Input() template?: TemplateRef<void>;
  @Input({ transform: numberAttribute }) @WithConfig() visibilityHeight: number = 400;
  @Input() target?: string | HTMLElement;
  @Input({ transform: numberAttribute }) duration: number = 450;
  @Output() readonly onClick = new EventEmitter<boolean>();

  @ViewChild('backTop', { static: false })
  set backTop(backTop: ElementRef<HTMLElement> | undefined) {
    if (backTop) {
      this.backTopClickSubscription.unsubscribe();

      this.backTopClickSubscription = fromEventOutsideAngular(backTop.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.scrollSrv.scrollTo(this.getTarget(), 0, { duration: this.duration });
          if (this.onClick.observers.length) {
            this.ngZone.run(() => this.onClick.emit(true));
          }
        });
    }
  }

  private doc = inject(DOCUMENT);
  private backTopClickSubscription = Subscription.EMPTY;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.scrollListenerDestroy$.next();
      this.scrollListenerDestroy$.complete();
    });
  }

  ngOnInit(): void {
    this.registerScrollEvent();
    this.dir = this.directionality.value;

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
  }

  private getTarget(): HTMLElement | Window {
    return this.#target || window;
  }

  private handleScroll(): void {
    if (this.visible === this.scrollSrv.getScroll(this.getTarget()) > this.visibilityHeight) {
      return;
    }
    this.visible = !this.visible;
    this.cdr.detectChanges();
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

  detectChanges(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzTarget } = changes;
    if (nzTarget) {
      this.#target = typeof this.target === 'string' ? this.doc.querySelector(this.target) : this.target;
      this.registerScrollEvent();
    }
  }
}
