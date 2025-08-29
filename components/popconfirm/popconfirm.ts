/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
  QueryList,
  signal,
  TemplateRef,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, Observable, Subject } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

import { TriButtonModule, TriButtonType } from 'ng-zorro-antd/button';
import { zoomBigMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, WithConfig } from 'ng-zorro-antd/core/config';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriOverlayModule } from 'ng-zorro-antd/core/overlay';
import { NgStyleInterface, TriTSType } from 'ng-zorro-antd/core/types';
import { wrapIntoObservable } from 'ng-zorro-antd/core/util';
import { TriI18nModule } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTooltipBaseDirective, TriTooltipComponent, TriTooltipTrigger, PropertyMapping } from 'ng-zorro-antd/tooltip';

import { TriPopConfirmButtonProps } from './popconfirm-option';

export type TriAutoFocusType = null | 'ok' | 'cancel';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'popconfirm';

@Directive({
  selector: '[tri-popconfirm]',
  exportAs: 'triPopconfirm',
  host: {
    '[class.tri-popover-open]': 'visible'
  }
})
export class TriPopconfirmDirective extends TriTooltipBaseDirective {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  /* eslint-disable @angular-eslint/no-input-rename, @angular-eslint/no-output-rename */
  @Input({ alias: 'nzPopconfirmArrowPointAtCenter', transform: booleanAttribute })
  override arrowPointAtCenter?: boolean;
  @Input('nzPopconfirmTitle') override title?: TriTSType;
  @Input('nzPopconfirmTitleContext') titleContext?: object | null = null;
  @Input('nz-popconfirm') override directiveTitle?: TriTSType | null;
  @Input('nzPopconfirmTrigger') override trigger?: TriTooltipTrigger = 'click';
  @Input('nzPopconfirmPlacement') override placement?: string | string[] = 'top';
  @Input('nzPopconfirmOrigin') override origin?: ElementRef<HTMLElement>;
  @Input('nzPopconfirmMouseEnterDelay') override mouseEnterDelay?: number;
  @Input('nzPopconfirmMouseLeaveDelay') override mouseLeaveDelay?: number;
  @Input('nzPopconfirmOverlayClassName') override overlayClassName?: string;
  @Input('nzPopconfirmOverlayStyle') override overlayStyle?: NgStyleInterface;
  @Input('nzPopconfirmVisible') override visible?: boolean;
  @Input() beforeConfirm?: () => Observable<boolean> | Promise<boolean> | boolean;
  @Input() icon?: string | TemplateRef<void>;
  @Input({ transform: booleanAttribute }) condition: boolean = false;
  @Input({ transform: booleanAttribute }) popconfirmShowArrow: boolean = true;
  @Input() @WithConfig() popconfirmBackdrop?: boolean = false;
  @Input() @WithConfig() autofocus: TriAutoFocusType = null;

  okText = input<string | null>(null);
  okType = input<string>('primary');
  cancelText = input<string | null>(null);
  okButtonProps = input<null | TriPopConfirmButtonProps>(null);
  cancelButtonProps = input<null | TriPopConfirmButtonProps>(null);
  /**
   * @deprecated v21
   * please use the nzOkButton object input to describe option of the ok button
   */
  okDisabled = input(false, { transform: booleanAttribute });
  /**
   * @deprecated v21
   * please use the nzOkButton object input to describe option of the ok button
   */
  okDanger = input(false, { transform: booleanAttribute });

  #okButtonProps = computed(() => ({
    ...this.okButtonProps(),
    nzType: this.okButtonProps()?.nzType || this.okType() === 'danger' ? 'primary' : this.okType(),
    nzDanger: this.okDanger() || this.okButtonProps()?.nzDanger || this.okType() === 'danger',
    nzDisabled: this.okDisabled() || this.okButtonProps()?.nzDisabled
  }));
  #cancelButtonProps = computed(() => ({
    ...this.cancelButtonProps()
  }));

  override directiveContent?: TriTSType | null = null;
  override content?: TriTSType | null = null;
  override overlayClickable?: boolean;

  @Output('nzPopconfirmVisibleChange') override readonly visibleChange = new EventEmitter<boolean>();
  @Output() readonly onCancel = new EventEmitter<void>();
  @Output() readonly onConfirm = new EventEmitter<void>();

  protected override getProxyPropertyMap(): PropertyMapping {
    return {
      nzOkText: ['nzOkText', () => this.okText],
      nzCancelText: ['nzCancelText', () => this.cancelText],
      nzOkButtonProps: ['nzOkButtonProps', () => this.#okButtonProps],
      nzCancelButtonProps: ['nzCancelButtonProps', () => this.#cancelButtonProps],
      nzBeforeConfirm: ['nzBeforeConfirm', () => this.beforeConfirm],
      nzCondition: ['nzCondition', () => this.condition],
      nzIcon: ['nzIcon', () => this.icon],
      nzPopconfirmShowArrow: ['nzPopconfirmShowArrow', () => this.popconfirmShowArrow],
      nzPopconfirmBackdrop: ['nzBackdrop', () => this.popconfirmBackdrop],
      nzPopconfirmContext: ['nzTitleContext', () => this.titleContext],
      nzAutoFocus: ['nzAutoFocus', () => this.autofocus],
      ...super.getProxyPropertyMap()
    };
  }

  constructor() {
    super(TriPopconfirmComponent);
  }

  /**
   * @override
   */
  protected override createComponent(): void {
    super.createComponent();

    (this.component as TriPopconfirmComponent).onCancel.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.onCancel.emit();
    });
    (this.component as TriPopconfirmComponent).onConfirm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.onConfirm.emit();
    });
  }
}

@Component({
  selector: 'tri-popconfirm',
  exportAs: 'triPopconfirmComponent',
  animations: [zoomBigMotion],
  template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayHasBackdrop]="backdrop"
      [cdkConnectedOverlayOrigin]="origin"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayPush]="cdkConnectedOverlayPush"
      [arrowPointAtCenter]="arrowPointAtCenter"
    >
      <div
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="autoFocus !== null"
        class="tri-popover"
        [class]="_classMap"
        [class.tri-popover-rtl]="dir === 'rtl'"
        [style]="overlayStyle"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [noAnimation]="noAnimation?.nzNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        @if (popconfirmShowArrow) {
          <div class="tri-popover-arrow"></div>
        }
        <div class="tri-popover-content">
          <div class="tri-popover-inner">
            <div>
              <div class="tri-popover-inner-content">
                <div class="tri-popover-message">
                  @if (icon !== null) {
                    <span class="tri-popover-message-icon">
                      <ng-container *stringTemplateOutlet="icon; let icon">
                        <tri-icon [type]="icon || 'exclamation-circle'" theme="fill" />
                      </ng-container>
                    </span>
                  }
                  <div class="tri-popover-message-title">
                    <ng-container *stringTemplateOutlet="title; stringTemplateOutletContext: titleContext">
                      {{ title }}
                    </ng-container>
                  </div>
                </div>
                <div class="tri-popover-buttons">
                  <button
                    tri-button
                    #cancelBtn
                    [size]="'small'"
                    [danger]="cancelButtonProps()?.nzDanger"
                    (click)="onCancel()"
                    [disabled]="cancelButtonProps()?.nzDisabled"
                    [attr.cdkFocusInitial]="autoFocus === 'cancel' || null"
                  >
                    @let cancelText = nzCancelText() || ('Modal.cancelText' | nzI18n);
                    {{ cancelText }}
                  </button>
                  <button
                    tri-button
                    #okBtn
                    [size]="'small'"
        okButtonPropspe]="type"
          okButtonPropser]="danger"
                    [loading]="confirmLoading"
            okButtonPropsed]="disabled"
                    (click)="onConfirm()"
                    [attr.cdkFocusInitial]="autoFocus === 'ok' || null"
                  >
                    @let okText = nzOkText() || ('Modal.okText' | nzI18n);
                    {{ okText }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  imports: [
    OverlayModule,
    TriOverlayModule,
    A11yModule,
    TriNoAnimationDirective,
    TriOutletModule,
    TriIconModule,
    TriButtonModule,
    TriI18nModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriPopconfirmComponent extends TriTooltipComponent {
  @ViewChildren('okBtn', { read: ElementRef }) okBtn!: QueryList<ElementRef>;
  @ViewChildren('cancelBtn', { read: ElementRef }) cancelBtn!: QueryList<ElementRef>;

  condition = false;
  popconfirmShowArrow = true;
  icon?: string | TemplateRef<void> | null;
  autoFocus: TriAutoFocusType = null;
  beforeConfirm: (() => Observable<boolean> | Promise<boolean> | boolean) | null = null;

  okText = signal<string | null>(null);
  cancelText = signal<string | null>(null);
  okButtonProps = signal<TriPopConfirmButtonProps & { nzType: TriButtonType }>({ nzType: 'primary' });
  cancelButtonProps = signal<TriPopConfirmButtonProps | null>(null);

  readonly onCancel = new Subject<void>();
  readonly onConfirm = new Subject<void>();

  protected override _trigger: TriTooltipTrigger = 'click';
  private elementFocusedBeforeModalWasOpened: HTMLElement | null = null;
  private document: Document = inject(DOCUMENT);

  override _prefix = 'ant-popover';

  confirmLoading = false;

  constructor() {
    super();
    this.destroyRef.onDestroy(() => {
      this.visibleChange.complete();
    });
  }

  /**
   * @override
   */
  override show(): void {
    if (!this.condition) {
      this.capturePreviouslyFocusedElement();
      super.show();
    } else {
      this._onConfirm();
    }
  }

  override hide(): void {
    super.hide();
    this.restoreFocus();
  }

  handleConfirm(): void {
    this.onConfirm.next();
    super.hide();
  }

  _onCancel(): void {
    this.onCancel.next();
    super.hide();
  }

  _onConfirm(): void {
    if (this.beforeConfirm) {
      this.confirmLoading = true;
      this.cdr.markForCheck();

      wrapIntoObservable(this.beforeConfirm())
        .pipe(
          first(),
          filter(Boolean),
          finalize(() => {
            this.confirmLoading = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe(() => this.handleConfirm());
    } else {
      this.handleConfirm();
    }
  }

  private capturePreviouslyFocusedElement(): void {
    if (this.document) {
      this.elementFocusedBeforeModalWasOpened = this.document.activeElement as HTMLElement;
    }
  }

  private restoreFocus(): void {
    const toFocus = this.elementFocusedBeforeModalWasOpened as HTMLElement;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (toFocus && typeof toFocus.focus === 'function') {
      const activeElement = this.document.activeElement as Element;
      const element: HTMLElement = this.elementRef.nativeElement;

      if (
        !activeElement ||
        activeElement === this.document.body ||
        activeElement === element ||
        element.contains(activeElement)
      ) {
        toFocus.focus();
      }
    }
  }
}
