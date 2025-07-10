/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { CdkScrollable, Overlay, OverlayConfig, OverlayKeyboardDispatcher, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ContentChild,
  DestroyRef,
  DOCUMENT,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';

import { drawerMaskMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { overlayZIndexSetter } from 'ng-zorro-antd/core/overlay';
import { NgStyleInterface, TriSafeAny } from 'ng-zorro-antd/core/types';
import { isTemplateRef, toCssPixel } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriDrawerContentDirective } from './drawer-content.directive';
import {
  DRAWER_DEFAULT_SIZE,
  DRAWER_LARGE_SIZE,
  TRI_DRAWER_DATA,
  TriDrawerOptionsOfComponent,
  TriDrawerPlacement,
  TriDrawerSize
} from './drawer-options';
import { TriDrawerRef } from './drawer-ref';

export const DRAWER_ANIMATE_DURATION = 300;

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'drawer';

@Component({
  selector: '',
  exportAs: 'triDrawer',
  template: `
    <ng-template #drawerTemplate>
      <div
        class="tri-drawer"
        [noAnimation]="noAnimation"
        [class.tri-drawer-rtl]="dir === 'rtl'"
        [class.tri-drawer-open]="isOpen"
        [class.no-mask]="!mask"
        [class.tri-drawer-top]="placement === 'top'"
        [class.tri-drawer-bottom]="placement === 'bottom'"
        [class.tri-drawer-right]="placement === 'right'"
        [class.tri-drawer-left]="placement === 'left'"
        [style.transform]="offsetTransform"
        [style.transition]="placementChanging ? 'none' : null"
        [style.zIndex]="zIndex"
      >
        @if (mask && isOpen) {
          <div @drawerMaskMotion class="tri-drawer-mask" (click)="maskClick()" [style]="maskStyle"></div>
        }
        <div
          class="ant-drawer-content-wrapper {{ wrapClassName }}"
          [style.width]="width"
          [style.height]="height"
          [style.transform]="transform"
          [style.transition]="placementChanging ? 'none' : null"
        >
          <div class="tri-drawer-content">
            <div class="tri-drawer-wrapper-body" [style.height]="isLeftOrRight ? '100%' : null">
              @if (title || closable) {
                <div class="tri-drawer-header" [class.tri-drawer-header-close-only]="!title">
                  <div class="tri-drawer-header-title">
                    @if (closable) {
                      <button (click)="closeClick()" aria-label="Close" class="tri-drawer-close">
                        <ng-container *stringTemplateOutlet="closeIcon; let closeIcon">
                          <tri-icon [type]="closeIcon" />
                        </ng-container>
                      </button>
                    }

                    @if (title) {
                      <div class="tri-drawer-title">
                        <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
                      </div>
                    }
                  </div>
                  @if (extra) {
                    <div class="tri-drawer-extra">
                      <ng-container *stringTemplateOutlet="extra">{{ extra }}</ng-container>
                    </div>
                  }
                </div>
              }
              <div class="tri-drawer-body" [style]="bodyStyle" cdkScrollable>
                <ng-template cdkPortalOutlet />
                @if (content) {
                  @if (isTemplateRef(content)) {
                    <ng-container *ngTemplateOutlet="content; context: templateContext" />
                  }
                } @else {
                  @if (contentFromContentChild && (isOpen || inAnimation)) {
                    <ng-template [ngTemplateOutlet]="contentFromContentChild" />
                  }
                }
              </div>
              @if (footer) {
                <div class="tri-drawer-footer">
                  <ng-container *stringTemplateOutlet="footer">{{ footer }}</ng-container>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [drawerMaskMotion],
  imports: [TriNoAnimationDirective, TriOutletModule, TriIconModule, PortalModule, NgTemplateOutlet, CdkScrollable]
})
export class TriDrawerComponent<T extends {} = TriSafeAny, R = TriSafeAny, D extends Partial<T> = TriSafeAny>
  extends TriDrawerRef<T, R>
  implements OnInit, AfterViewInit, OnChanges, TriDrawerOptionsOfComponent
{
  private cdr = inject(ChangeDetectorRef);
  public configService = inject(TriConfigService);
  private renderer = inject(Renderer2);
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private focusTrapFactory = inject(FocusTrapFactory);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayKeyboardDispatcher = inject(OverlayKeyboardDispatcher);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input() content!: TemplateRef<{ $implicit: D; drawerRef: TriDrawerRef<R> }> | Type<T>;
  @Input() closeIcon: string | TemplateRef<void> = 'close';
  @Input({ transform: booleanAttribute }) closable: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() maskClosable: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() mask: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() closeOnNavigation: boolean = true;
  @Input({ transform: booleanAttribute }) noAnimation = false;
  @Input({ transform: booleanAttribute }) keyboard: boolean = true;
  @Input() title?: string | TemplateRef<{}>;
  @Input() extra?: string | TemplateRef<{}>;
  @Input() footer?: string | TemplateRef<{}>;
  @Input() placement: TriDrawerPlacement = 'right';
  @Input() size: TriDrawerSize = 'default';
  @Input() maskStyle: NgStyleInterface = {};
  @Input() bodyStyle: NgStyleInterface = {};
  @Input() wrapClassName?: string;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() zIndex = 1000;
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  private componentInstance: T | null = null;
  private componentRef: ComponentRef<T> | null = null;

  @Input({ transform: booleanAttribute })
  set visible(value: boolean) {
    this.isOpen = value;
  }

  get visible(): boolean {
    return this.isOpen;
  }

  @Output() readonly onViewInit = new EventEmitter<void>();
  @Output() readonly onClose = new EventEmitter<MouseEvent>();
  @Output() readonly visibleChange = new EventEmitter<boolean>();

  @ViewChild('drawerTemplate', { static: true }) drawerTemplate!: TemplateRef<void>;
  @ViewChild(CdkPortalOutlet, { static: false }) bodyPortalOutlet?: CdkPortalOutlet;
  @ContentChild(TriDrawerContentDirective, { static: true, read: TemplateRef })
  contentFromContentChild?: TemplateRef<TriSafeAny>;

  previouslyFocusedElement?: HTMLElement;
  placementChanging = false;
  placementChangeTimeoutId?: ReturnType<typeof setTimeout>;
  contentParams?: TriSafeAny; // only service
  data?: D;
  overlayRef?: OverlayRef | null;
  portal?: TemplatePortal;
  focusTrap?: FocusTrap;
  isOpen = false;
  inAnimation = false;
  templateContext: { $implicit: D | undefined; drawerRef: TriDrawerRef<R> } = {
    $implicit: undefined,
    drawerRef: this as TriDrawerRef<R>
  };
  protected isTemplateRef = isTemplateRef;

  get offsetTransform(): string | null {
    if (!this.isOpen || this.offsetX + this.offsetY === 0) {
      return null;
    }
    switch (this.placement) {
      case 'left':
        return `translateX(${this.offsetX}px)`;
      case 'right':
        return `translateX(-${this.offsetX}px)`;
      case 'top':
        return `translateY(${this.offsetY}px)`;
      case 'bottom':
        return `translateY(-${this.offsetY}px)`;
    }
  }

  get transform(): string | null {
    if (this.isOpen) {
      return null;
    }

    switch (this.placement) {
      case 'left':
        return `translateX(-100%)`;
      case 'right':
        return `translateX(100%)`;
      case 'top':
        return `translateY(-100%)`;
      case 'bottom':
        return `translateY(100%)`;
    }
  }

  get width(): string | null {
    if (this.isLeftOrRight) {
      const defaultWidth = this.size === 'large' ? DRAWER_LARGE_SIZE : DRAWER_DEFAULT_SIZE;
      return this.width === undefined ? toCssPixel(defaultWidth) : toCssPixel(this.width);
    }
    return null;
  }

  get height(): string | null {
    if (!this.isLeftOrRight) {
      const defaultHeight = this.size === 'large' ? DRAWER_LARGE_SIZE : DRAWER_DEFAULT_SIZE;
      return this.height === undefined ? toCssPixel(defaultHeight) : toCssPixel(this.height);
    }
    return null;
  }

  get isLeftOrRight(): boolean {
    return this.placement === 'left' || this.placement === 'right';
  }

  afterOpen = new Subject<void>();
  afterClose = new Subject<R | undefined>();

  get _afterOpen(): Observable<void> {
    return this.afterOpen.asObservable();
  }

  get _afterClose(): Observable<R | undefined> {
    return this.afterClose.asObservable();
  }

  get isNzContentTemplateRef(): boolean {
    return isTemplateRef(this.content);
  }

  // from service config
  @WithConfig() direction?: Direction = undefined;

  dir: Direction = 'ltr';
  private document: Document = inject(DOCUMENT);

  constructor() {
    super();
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.placementChangeTimeoutId);
      this.disposeOverlay();
    });
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.direction || this.directionality.value;

    this.attachOverlay();
    this.updateOverlayStyle();
    this.updateBodyOverflow();
    this.templateContext = { $implicit: this.data || this.contentParams, drawerRef: this as TriDrawerRef<R> };
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.attachBodyContent();
    // The `setTimeout` triggers change detection. There's no sense to schedule the DOM timer if anyone is
    // listening to the `nzOnViewInit` event inside the template, for instance `<nz-drawer (nzOnViewInit)="...">`.
    if (this.onViewInit.observers.length) {
      setTimeout(() => {
        this.onViewInit.emit();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzPlacement, nzVisible } = changes;
    if (nzVisible) {
      const value = changes.nzVisible.currentValue;
      if (value) {
        this.open();
      } else {
        this.close();
      }
    }
    if (nzPlacement && !nzPlacement.isFirstChange()) {
      this.triggerPlacementChangeCycleOnce();
    }
  }

  private getAnimationDuration(): number {
    return this.noAnimation ? 0 : DRAWER_ANIMATE_DURATION;
  }

  // Disable the transition animation temporarily when the placement changing
  private triggerPlacementChangeCycleOnce(): void {
    if (!this.noAnimation) {
      this.placementChanging = true;
      this.changeDetectorRef.markForCheck();
      clearTimeout(this.placementChangeTimeoutId);
      this.placementChangeTimeoutId = setTimeout(() => {
        this.placementChanging = false;
        this.changeDetectorRef.markForCheck();
      }, this.getAnimationDuration());
    }
  }

  close(result?: R): void {
    this.isOpen = false;
    this.inAnimation = true;
    this.visibleChange.emit(false);
    this.updateOverlayStyle();
    this.overlayKeyboardDispatcher.remove(this.overlayRef!);
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.updateBodyOverflow();
      this.restoreFocus();
      this.inAnimation = false;
      this.afterClose.next(result);
      this.afterClose.complete();
      this.componentInstance = null;
      this.componentRef = null;
    }, this.getAnimationDuration());
  }

  open(): void {
    this.attachOverlay();
    this.isOpen = true;
    this.inAnimation = true;
    this.visibleChange.emit(true);
    this.overlayKeyboardDispatcher.add(this.overlayRef!);
    this.updateOverlayStyle();
    this.updateBodyOverflow();
    this.savePreviouslyFocusedElement();
    this.trapFocus();
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.inAnimation = false;
      this.changeDetectorRef.detectChanges();
      this.afterOpen.next();
    }, this.getAnimationDuration());
  }

  getContentComponent(): T | null {
    return this.componentInstance;
  }

  override getContentComponentRef(): ComponentRef<T> | null {
    return this.componentRef;
  }

  closeClick(): void {
    this.onClose.emit();
  }

  maskClick(): void {
    if (this.maskClosable && this.mask) {
      this.onClose.emit();
    }
  }

  private attachBodyContent(): void {
    this.bodyPortalOutlet!.dispose();

    if (this.content instanceof Type) {
      const childInjector = Injector.create({
        parent: this.injector,
        providers: [
          { provide: TriDrawerRef, useValue: this },
          { provide: TRI_DRAWER_DATA, useValue: this.data }
        ]
      });
      const componentPortal = new ComponentPortal<T>(this.content, null, childInjector);
      this.componentRef = this.bodyPortalOutlet!.attachComponentPortal(componentPortal);

      this.componentInstance = this.componentRef.instance;
      /**TODO
       * When nzContentParam will be remove in the next major version, we have to remove the following line
       * **/
      Object.assign(this.componentRef.instance!, this.data || this.contentParams);
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  private attachOverlay(): void {
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.drawerTemplate, this.viewContainerRef);
      this.overlayRef = this.overlay.create(this.getOverlayConfig());

      overlayZIndexSetter(this.overlayRef, this.zIndex);
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
      this.overlayRef!.keydownEvents()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event: KeyboardEvent) => {
          if (event.keyCode === ESCAPE && this.isOpen && this.keyboard) {
            this.onClose.emit();
          }
        });
      this.overlayRef
        .detachments()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.close();
          this.disposeOverlay();
        });
    }
  }

  private disposeOverlay(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      disposeOnNavigation: this.closeOnNavigation,
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block()
    });
  }

  private updateOverlayStyle(): void {
    if (this.overlayRef && this.overlayRef.overlayElement) {
      this.renderer.setStyle(this.overlayRef.overlayElement, 'pointer-events', this.isOpen ? 'auto' : 'none');
    }
  }

  private updateBodyOverflow(): void {
    if (this.overlayRef) {
      if (this.isOpen) {
        this.overlayRef.getConfig().scrollStrategy!.enable();
      } else {
        this.overlayRef.getConfig().scrollStrategy!.disable();
      }
    }
  }

  savePreviouslyFocusedElement(): void {
    if (this.document && !this.previouslyFocusedElement) {
      this.previouslyFocusedElement = this.document.activeElement as HTMLElement;
      // We need the extra check, because IE's svg element has no blur method.
      if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.blur === 'function') {
        this.previouslyFocusedElement.blur();
      }
    }
  }

  private trapFocus(): void {
    if (!this.focusTrap && this.overlayRef && this.overlayRef.overlayElement) {
      this.focusTrap = this.focusTrapFactory.create(this.overlayRef!.overlayElement);
      this.focusTrap.focusInitialElement();
    }
  }

  private restoreFocus(): void {
    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = undefined;
    }
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
  }
}
