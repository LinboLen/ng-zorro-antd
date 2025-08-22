/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

import { TriConfigService, onConfigChangeEventForComponent } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TRI_EMPTY_COMPONENT_NAME, TriEmptyCustomContent, TriEmptySize } from './config';
import { TriEmptyComponent } from './empty.component';

function getEmptySize(componentName: string): TriEmptySize {
  switch (componentName) {
    case 'table':
    case 'list':
      return 'normal';
    case 'select':
    case 'tree-select':
    case 'cascader':
    case 'transfer':
      return 'small';
    default:
      return '';
  }
}

type TriEmptyContentType = 'component' | 'template' | 'string';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-embed-empty',
  exportAs: 'triEmbedEmpty',
  template: `
    @if (content) {
      @if (contentType === 'template' || contentType === 'string') {
        <ng-container *stringTemplateOutlet="content; stringTemplateOutletContext: { $implicit: componentName }">{{
          content
        }}</ng-container>
      } @else {
        <ng-template [cdkPortalOutlet]="contentPortal" />
      }
    } @else {
      @if (specificContent !== null) {
        @switch (size) {
          @case ('normal') {
            <tri-empty class="tri-empty-normal" notFoundImage="simple" />
          }
          @case ('small') {
            <tri-empty class="tri-empty-small" notFoundImage="simple" />
          }
          @default {
            <tri-empty />
          }
        }
      }
    }
  `,
  imports: [TriEmptyComponent, PortalModule, TriOutletModule]
})
export class TriEmbedEmptyComponent implements OnChanges, OnInit {
  private configService = inject(TriConfigService);
  private viewContainerRef = inject(ViewContainerRef);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);

  @Input() componentName?: string;
  @Input() specificContent?: TriEmptyCustomContent;

  content?: TriEmptyCustomContent;
  contentType: TriEmptyContentType = 'string';
  contentPortal?: Portal<TriSafeAny>;
  size: TriEmptySize = '';

  constructor() {
    onConfigChangeEventForComponent('empty', () => {
      this.content = this.specificContent || this.getUserDefaultEmptyContent();
      this.renderEmpty();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzComponentName) {
      this.size = getEmptySize(changes.nzComponentName.currentValue);
    }

    if (changes.specificContent && !changes.specificContent.isFirstChange()) {
      this.content = changes.specificContent.currentValue;
      this.renderEmpty();
    }
  }

  ngOnInit(): void {
    this.content = this.specificContent || this.getUserDefaultEmptyContent();
    this.renderEmpty();
  }

  private renderEmpty(): void {
    const content = this.content;

    if (typeof content === 'string') {
      this.contentType = 'string';
    } else if (content instanceof TemplateRef) {
      this.contentType = 'template';
      this.contentPortal = undefined;
    } else if (content instanceof Type) {
      const injector = Injector.create({
        parent: this.injector,
        providers: [{ provide: TRI_EMPTY_COMPONENT_NAME, useValue: this.componentName }]
      });
      this.contentType = 'component';
      this.contentPortal = new ComponentPortal(content, this.viewContainerRef, injector);
    } else {
      this.contentType = 'string';
      this.contentPortal = undefined;
    }

    this.cdr.detectChanges();
  }

  private getUserDefaultEmptyContent(): Type<TriSafeAny> | TemplateRef<string> | string | undefined {
    return (this.configService.getConfigForComponent('empty') || {}).nzDefaultEmptyContent;
  }
}
