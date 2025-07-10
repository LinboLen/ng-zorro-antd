/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import { NgTemplateOutlet } from '@angular/common';
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

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'backTop';

const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

/**
 * @deprecated Will be removed in v21. It is recommended to use `<nz-float-button-top>` instead.
 */
@Component({
  selector: '',
  exportAs: 'triBackTop',
  animations: [fadeMotion],
  imports: [NgTemplateOutlet, TriIconModule],
  template: `
    @if (visible) {
      <div #backTop class="tri-back-top" [class.tri-back-top-rtl]="dir === 'rtl'" @fadeMotion>
        <ng-template #defaultContent>
          <div class="tri-back-top-content">
            <div class="tri-back-top-icon">
              <tri-icon type="vertical-align-top" />
            </div>
          </div>
        </ng-template>
        <ng-template [ngTemplateOutlet]="template || defaultContent"></ng-template>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriBackTopComponent implements OnInit, OnChanges {
  public configService = inject(TriConfigService);
  private scrollSrv = inject(TriScrollService);
  private platform = inject(Platform);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  private scrollListenerDestroy$ = new Subject<boolean>();
  #target: HTMLElement | null = null;

  visible: boolean = false;
  dir: Direction = this.directionality.value || 'ltr';

  @Input() template?: TemplateRef<void>;
  @Input({ transform: numberAttribute }) @WithConfig() visibilityHeight: number = 400;
  @Input() target?: string | HTMLElement;
  @Input({ transform: numberAttribute }) duration: number = 450;
  @Output() readonly click = new EventEmitter<boolean>();

  @ViewChild('backTop', { static: false })
  set backTop(backTop: ElementRef<HTMLElement> | undefined) {
    if (backTop) {
      this.backTopClickSubscription.unsubscribe();

      this.backTopClickSubscription = fromEventOutsideAngular(backTop.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.scrollSrv.scrollTo(this.getTarget(), 0, { duration: this.duration });
          if (this.click.observers.length) {
            this.zone.run(() => this.click.emit(true));
          }
        });
    }
  }

  private backTopClickSubscription = Subscription.EMPTY;
  private doc: Document = inject(DOCUMENT);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.scrollListenerDestroy$.next(true);
      this.scrollListenerDestroy$.complete();
    });
  }

  ngOnInit(): void {
    this.registerScrollEvent();

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  private getTarget(): HTMLElement | Window {
    return this.#target || window;
  }

  private handleScroll(): void {
    const newVisible = this.scrollSrv.getScroll(this.getTarget()) > this.visibilityHeight;
    if (this.visible !== newVisible) {
      this.visible = newVisible;
      this.cdr.detectChanges();
    }
  }

  private registerScrollEvent(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.scrollListenerDestroy$.next(true);
    this.handleScroll();
    fromEventOutsideAngular(this.getTarget(), 'scroll', passiveEventListenerOptions as AddEventListenerOptions)
      .pipe(debounceTime(50), takeUntil(this.scrollListenerDestroy$))
      .subscribe(() => this.handleScroll());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzTarget } = changes;
    if (nzTarget) {
      this.#target = typeof this.target === 'string' ? this.doc.querySelector(this.target) : this.target!;
      this.registerScrollEvent();
    }
  }
}
