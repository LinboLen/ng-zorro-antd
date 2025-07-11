/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

@Directive({
  selector: 'tri-avatar[nz-comment-avatar]',
  exportAs: 'triCommentAvatar'
})
export class TriCommentAvatarDirective {}

@Directive({
  selector: 'tri-comment-content,[tri-comment-content]',
  exportAs: 'triCommentContent',
  host: { class: 'tri-comment-content-detail' }
})
export class TriCommentContentDirective {}

@Directive({
  selector: '[triCommentActionHost]',
  exportAs: 'triCommentActionHost'
})
export class TriCommentActionHostDirective extends CdkPortalOutlet implements OnInit, OnDestroy, AfterViewInit {
  @Input() commentActionHost?: TemplatePortal | null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngAfterViewInit(): void {
    this.attach(this.commentActionHost);
  }
}

@Component({
  selector: 'tri-comment-action',
  exportAs: 'triCommentAction',
  template: '<ng-template><ng-content /></ng-template>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriCommentActionComponent implements OnInit {
  @ViewChild(TemplateRef, { static: true }) implicitContent!: TemplateRef<void>;
  private viewContainerRef = inject(ViewContainerRef);
  private contentPortal: TemplatePortal | null = null;

  get content(): TemplatePortal | null {
    return this.contentPortal;
  }

  ngOnInit(): void {
    this.contentPortal = new TemplatePortal(this.implicitContent, this.viewContainerRef);
  }
}
