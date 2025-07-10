/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriDirectionVHType, TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriAnchorComponent } from './anchor.component';

@Component({
  selector: '',
  exportAs: 'triLink',
  imports: [NgTemplateOutlet],
  template: `
    <a
      #linkTitle
      class="tri-anchor-link-title"
      [href]="href"
      [attr.title]="titleStr"
      [target]="target"
      (click)="goToClick($event)"
    >
      @if (titleStr) {
        <span>{{ titleStr }}</span>
      } @else {
        <ng-template [ngTemplateOutlet]="titleTpl || template" />
      }
    </a>
    @if (direction === 'vertical') {
      <ng-content></ng-content>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-anchor-link'
  }
})
export class TriAnchorLinkComponent implements OnInit {
  public elementRef = inject(ElementRef<HTMLElement>);
  private anchorComp = inject(TriAnchorComponent);
  private platform = inject(Platform);
  private renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  @Input() href = '#';
  @Input() target?: string;

  titleStr: string | null = '';
  titleTpl?: TemplateRef<TriSafeAny>;
  direction: TriDirectionVHType = 'vertical';

  @Input()
  set title(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this.titleStr = null;
      this.titleTpl = value;
    } else {
      this.titleStr = value;
    }
  }

  @ContentChild('nzTemplate', { static: false }) template!: TemplateRef<void>;
  @ViewChild('linkTitle') linkTitle!: ElementRef<HTMLAnchorElement>;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.anchorComp.unregisterLink(this);
    });
  }

  ngOnInit(): void {
    this.anchorComp.registerLink(this);
    this.direction = this.anchorComp.direction;
  }

  getLinkTitleElement(): HTMLAnchorElement {
    return this.linkTitle.nativeElement;
  }

  setActive(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'ant-anchor-link-active');
  }

  unsetActive(): void {
    this.renderer.removeClass(this.elementRef.nativeElement, 'ant-anchor-link-active');
  }

  goToClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.platform.isBrowser) {
      this.anchorComp.handleScrollTo(this);
    }
  }
}
