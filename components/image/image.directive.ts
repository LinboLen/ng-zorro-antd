/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';

import { TriImageGroupComponent } from './image-group.component';
import { TRI_DEFAULT_SCALE_STEP } from './image-preview.component';
import { TriImageService } from './image.service';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'image';

export type ImageStatusType = 'error' | 'loading' | 'normal';
export type TriImageUrl = string;
export type TriImageScaleStep = number;

@Directive({
  selector: '',
  exportAs: 'triImage',
  host: {
    '(click)': 'onPreview()'
  }
})
export class TriImageDirective implements OnInit, OnChanges {
  private document: Document = inject(DOCUMENT);
  public configService = inject(TriConfigService);
  private elementRef = inject(ElementRef);
  private imageService = inject(TriImageService);
  protected cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input() src = '';
  @Input() srcset = '';
  @Input({ transform: booleanAttribute }) @WithConfig() disablePreview: boolean = false;
  @Input() @WithConfig() fallback: string | null = null;
  @Input() @WithConfig() placeholder: string | null = null;
  @Input() @WithConfig() scaleStep: number | null = null;

  dir?: Direction;
  backLoadImage!: HTMLImageElement;
  status: ImageStatusType = 'normal';
  private backLoadDestroy$ = new Subject<void>();

  private parentGroup = inject(TriImageGroupComponent, { optional: true });

  get previewable(): boolean {
    return !this.disablePreview && this.status !== 'error';
  }
  ngOnInit(): void {
    this.backLoad();
    if (this.parentGroup) {
      this.parentGroup.addImage(this);
    }
    if (this.directionality) {
      this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
        this.dir = direction;
        this.cdr.detectChanges();
      });
      this.dir = this.directionality.value;
    }
  }

  onPreview(): void {
    if (!this.previewable) {
      return;
    }

    if (this.parentGroup) {
      // preview inside image group
      const previewAbleImages = this.parentGroup.images.filter(e => e.previewable);
      const previewImages = previewAbleImages.map(e => ({ src: e.src, srcset: e.srcset }));
      const previewIndex = previewAbleImages.findIndex(el => this === el);
      const scaleStepMap = new Map<TriImageUrl, TriImageScaleStep>();
      previewAbleImages.forEach(imageDirective => {
        scaleStepMap.set(
          imageDirective.src ?? imageDirective.srcset,
          imageDirective.scaleStep ?? this.parentGroup!.scaleStep ?? this.scaleStep ?? TRI_DEFAULT_SCALE_STEP
        );
      });
      const previewRef = this.imageService.preview(
        previewImages,
        {
          direction: this.dir
        },
        scaleStepMap
      );
      previewRef.switchTo(previewIndex);
    } else {
      // preview not inside image group
      const previewImages = [{ src: this.src, srcset: this.srcset }];
      this.imageService.preview(previewImages, {
        direction: this.dir,
        scaleStep: this.scaleStep ?? TRI_DEFAULT_SCALE_STEP
      });
    }
  }

  getElement(): ElementRef<HTMLImageElement> {
    return this.elementRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzSrc } = changes;
    if (nzSrc) {
      this.getElement().nativeElement.src = nzSrc.currentValue;
      this.backLoad();
    }
  }

  /**
   * use internal Image object handle fallback & placeholder
   *
   * @private
   */
  private backLoad(): void {
    this.backLoadImage = this.document.createElement('img');
    this.backLoadImage.src = this.src;
    this.backLoadImage.srcset = this.srcset;
    this.status = 'loading';

    // unsubscribe last backLoad
    this.backLoadDestroy$.next();
    this.backLoadDestroy$.complete();
    this.backLoadDestroy$ = new Subject();
    if (this.backLoadImage.complete) {
      this.status = 'normal';
      this.getElement().nativeElement.src = this.src;
      this.getElement().nativeElement.srcset = this.srcset;
    } else {
      if (this.placeholder) {
        this.getElement().nativeElement.src = this.placeholder;
        this.getElement().nativeElement.srcset = '';
      } else {
        this.getElement().nativeElement.src = this.src;
        this.getElement().nativeElement.srcset = this.srcset;
      }

      // The `nz-image` directive can be destroyed before the `load` or `error` event is dispatched,
      // so there's no sense to keep capturing `this`.
      fromEvent(this.backLoadImage, 'load')
        .pipe(takeUntil(this.backLoadDestroy$), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.status = 'normal';
          this.getElement().nativeElement.src = this.src;
          this.getElement().nativeElement.srcset = this.srcset;
        });

      fromEvent(this.backLoadImage, 'error')
        .pipe(takeUntil(this.backLoadDestroy$), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.status = 'error';
          if (this.fallback) {
            this.getElement().nativeElement.src = this.fallback;
            this.getElement().nativeElement.srcset = '';
          }
        });
    }
  }
}
