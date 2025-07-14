/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriEmptyI18nInterface, TriI18nService } from 'ng-zorro-antd/i18n';

import { TriEmptyDefaultComponent } from './partial/default';
import { TriEmptySimpleComponent } from './partial/simple';

const TriEmptyDefaultImages = ['default', 'simple'] as const;
type TriEmptyNotFoundImageType = (typeof TriEmptyDefaultImages)[number] | null | string | TemplateRef<void>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-empty',
  exportAs: 'triEmpty',
  template: `
    <div class="tri-empty-image">
      @if (!isImageBuildIn) {
        <ng-container *stringTemplateOutlet="notFoundImage">
          <img [src]="notFoundImage" [alt]="isContentString ? notFoundContent : 'empty'" />
        </ng-container>
      } @else {
        @if (notFoundImage === 'simple') {
          <tri-empty-simple />
        } @else {
          <tri-empty-default />
        }
      }
    </div>
    @if (notFoundContent !== null) {
      <p class="tri-empty-description">
        <ng-container *stringTemplateOutlet="notFoundContent">
          {{ isContentString ? nzNotFoundContent : locale['description'] }}
        </ng-container>
      </p>
    }

    @if (notFoundFooter) {
      <div class="tri-empty-footer">
        <ng-container *stringTemplateOutlet="notFoundFooter">
          {{ notFoundFooter }}
        </ng-container>
      </div>
    }
  `,
  host: {
    class: 'tri-empty'
  },
  imports: [TriOutletModule, TriEmptyDefaultComponent, TriEmptySimpleComponent]
})
export class TriEmptyComponent implements OnChanges, OnInit {
  private i18n = inject(TriI18nService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @Input() notFoundImage: TriEmptyNotFoundImageType = 'default';
  @Input() notFoundContent?: string | TemplateRef<void> | null;
  @Input() notFoundFooter?: string | TemplateRef<void>;

  isContentString = false;
  isImageBuildIn = true;
  locale!: TriEmptyI18nInterface;

  ngOnChanges(changes: SimpleChanges): void {
    const { nzNotFoundContent, nzNotFoundImage } = changes;

    if (nzNotFoundContent) {
      const content = nzNotFoundContent.currentValue;
      this.isContentString = typeof content === 'string';
    }

    if (nzNotFoundImage) {
      const image = nzNotFoundImage.currentValue || 'default';
      this.isImageBuildIn = TriEmptyDefaultImages.findIndex(i => i === image) > -1;
    }
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Empty');
      this.cdr.markForCheck();
    });
  }
}
