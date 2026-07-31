/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { CdkDrag, CdkDragEnd, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/overlay';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { TriPipesModule } from 'ng-zorro-antd/pipes';

import { TriModalCloseComponent } from './modal-close.component';
import { BaseModalContainerComponent } from './modal-container.directive';
import { TriModalFooterComponent } from './modal-footer.component';
import { TriModalTitleComponent } from './modal-title.component';

@Component({
  selector: 'tri-modal-container',
  exportAs: 'triModalContainer',
  imports: [
    TriModalCloseComponent,
    TriModalTitleComponent,
    PortalModule,
    TriModalFooterComponent,
    TriPipesModule,
    CdkDrag,
    CdkDragHandle
  ],
  hostDirectives: [CdkScrollable],
  template: `
    <div
      #modalElement
      cdkDrag
      cdkDragBoundary=".cdk-overlay-container"
      [cdkDragDisabled]="!draggable"
      (cdkDragEnded)="onDragEnded($event)"
      role="document"
      class="tri-modal"
      [class]="className!"
      [style]="style!"
      [style.width]="config?.nzWidth! | nzToCssUnit"
    >
      <div class="tri-modal-content">
        @if (closable) {
          <button tri-modal-close (click)="onCloseClick()"></button>
        }
        @if (title) {
          <div tri-modal-title cdkDragHandle [style.cursor]="draggable ? 'move' : 'auto'"></div>
        }

        <div class="tri-modal-body" [style]="bodyStyle!">
          <ng-template cdkPortalOutlet />
          @if (isStringContent) {
            <div [innerHTML]="content"></div>
          }
        </div>
        @if (footer !== null) {
          <div
            tri-modal-footer
            [modalRef]="modalRef"
            (cancelTriggered)="onCloseClick()"
            (okTriggered)="onOkClick()"
          ></div>
        }
      </div>
    </div>
  `,
  host: {
    tabindex: '-1',
    role: 'dialog',
    '[class]': 'config.nzWrapClassName ? "ant-modal-wrap " + config.nzWrapClassName : "ant-modal-wrap"',
    '[class.tri-modal-wrap-rtl]': `dir === 'rtl'`,
    '[class.tri-modal-centered]': 'centered',
    '[style.zIndex]': 'config.nzZIndex',
    '(click)': 'onContainerClick($event)'
  }
})
export class TriModalContainerComponent extends BaseModalContainerComponent implements OnInit {
  @ViewChild(CdkPortalOutlet, { static: true }) set _portalOutlet(portalOutlet: CdkPortalOutlet) {
    this.portalOutlet = portalOutlet;
  }
  @ViewChild('modalElement', { static: true }) set _modalElementRef(elementRef: ElementRef<HTMLDivElement>) {
    this.modalElementRef = elementRef;
  }
  @ViewChild(TriModalFooterComponent) private modalFooter?: TriModalFooterComponent;

  override markForCheck(): void {
    super.markForCheck();
    this.modalFooter?.markForCheck();
  }

  ngOnInit(): void {
    this.setupMouseListeners(this.modalElementRef);
  }

  protected onDragEnded(event: CdkDragEnd): void {
    const element = this.modalElementRef.nativeElement;
    const dragPosition = event.source.getFreeDragPosition();
    const { top, left } = getComputedStyle(element);
    // Persist the drag offset as layout offsets (the modal is `position: relative`) and clear
    // the CDK drag transform, otherwise the zoom-out exit animation would override the
    // `translate3d` transform and make the modal jump back to the center before closing.
    this.renderer.setStyle(element, 'top', coerceCssPixelValue((parseFloat(top) || 0) + dragPosition.y));
    this.renderer.setStyle(element, 'left', coerceCssPixelValue((parseFloat(left) || 0) + dragPosition.x));
    event.source.reset();
  }
}
