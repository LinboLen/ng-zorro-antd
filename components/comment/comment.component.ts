/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  inject,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

import { TriCommentActionComponent as CommentAction, TriCommentActionHostDirective } from './comment-cells';

@Component({
  selector: '',
  exportAs: 'triComment',
  template: `
    <div class="tri-comment-inner">
      <div class="tri-comment-avatar">
        <ng-content select="nz-avatar[nz-comment-avatar]"></ng-content>
      </div>
      <div class="tri-comment-content">
        <div class="tri-comment-content-author">
          @if (author) {
            <span class="tri-comment-content-author-name">
              <ng-container *stringTemplateOutlet="author">{{ author }}</ng-container>
            </span>
          }
          @if (datetime) {
            <span class="tri-comment-content-author-time">
              <ng-container *stringTemplateOutlet="datetime">{{ datetime }}</ng-container>
            </span>
          }
        </div>
        <ng-content select="nz-comment-content" />
        @if (actions?.length) {
          <ul class="tri-comment-actions">
            @for (action of actions; track action) {
              <li>
                <span><ng-template [commentActionHost]="action.content" /></span>
              </li>
            }
          </ul>
        }
      </div>
    </div>
    <div class="tri-comment-nested">
      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tri-comment]': `true`,
    '[class.tri-comment-rtl]': `dir === "rtl"`
  },
  imports: [TriOutletModule, TriCommentActionHostDirective]
})
export class TriCommentComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);

  @Input() author?: string | TemplateRef<void>;
  @Input() datetime?: string | TemplateRef<void>;
  dir: Direction = 'ltr';

  @ContentChildren(CommentAction) actions!: QueryList<CommentAction>;

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }
}
