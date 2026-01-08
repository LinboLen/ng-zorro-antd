/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/overlay';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { TriPipesModule } from 'ng-zorro-antd/pipes';

import { TriModalCloseComponent } from './modal-close.component';
import { BaseModalContainerComponent } from './modal-container.directive';
import { TriModalFooterComponent } from './modal-footer.component';
import { TriModalTitleComponent } from './modal-title.component';

@Component({
  selector: 'tri-modal-container',
  exportAs: 'triModalContainer',
  hostDirectives: [CdkScrollable],
  template: `
    <div
      #modalElement
      cdkDrag
      cdkDragBoundary=".cdk-overlay-container"
      [cdkDragDisabled]="!draggable"
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
  // Using OnPush for modal caused footer can not to detect changes. we can fix it when 8.x.
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    tabindex: '-1',
    role: 'dialog',
    '[class]': 'config.nzWrapClassName ? "ant-modal-wrap " + config.nzWrapClassName : "ant-modal-wrap"',
    '[class.tri-modal-wrap-rtl]': `dir === 'rtl'`,
    '[class.tri-modal-centered]': 'centered',
    '[style.zIndex]': 'config.nzZIndex',
    '(click)': 'onContainerClick($event)'
  },
  imports: [
    TriModalCloseComponent,
    TriModalTitleComponent,
    PortalModule,
    TriModalFooterComponent,
    TriPipesModule,
    CdkDrag,
    CdkDragHandle
  ]
})
export class TriModalContainerComponent extends BaseModalContainerComponent implements OnInit {
  @ViewChild(CdkPortalOutlet, { static: true }) set _portalOutlet(portalOutlet: CdkPortalOutlet) {
    this.portalOutlet = portalOutlet;
  }
  @ViewChild('modalElement', { static: true }) set _modalElementRef(elementRef: ElementRef<HTMLDivElement>) {
    this.modalElementRef = elementRef;
  }

  ngOnInit(): void {
    this.setupMouseListeners(this.modalElementRef);
  }
}
