/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { animate, style, transition, trigger } from '@angular/animations';
import { Direction } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DOCUMENT,
  inject,
  Input,
  NgZone,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriProgressModule } from 'ng-zorro-antd/progress';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

import { TriIconRenderTemplate, TriShowUploadList, TriUploadFile, TriUploadListType } from './interface';

const isImageFileType = (type: string): boolean => !!type && type.indexOf('image/') === 0;

const MEASURE_SIZE = 200;

type UploadListIconType = '' | 'uploading' | 'thumbnail';

interface UploadListFile extends TriUploadFile {
  isImageUrl?: boolean;
  isUploading?: boolean;
  iconType?: UploadListIconType;
  showDownload?: boolean;
}

@Component({
  selector: 'tri-upload-list',
  exportAs: 'triUploadList',
  templateUrl: './upload-list.component.html',
  animations: [
    trigger('itemState', [
      transition(':enter', [
        style({ height: '0', width: '0', opacity: 0 }),
        animate(150, style({ height: '*', width: '*', opacity: 1 }))
      ]),
      transition(':leave', [animate(150, style({ height: '0', width: '0', opacity: 0 }))])
    ])
  ],
  host: {
    class: 'tri-upload-list',
    '[class.tri-upload-list-rtl]': `dir === 'rtl'`,
    '[class.tri-upload-list-text]': `listType === 'text'`,
    '[class.tri-upload-list-picture]': `listType === 'picture'`,
    '[class.tri-upload-list-picture-card]': `listType === 'picture-card'`
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriTooltipModule, NgTemplateOutlet, TriIconModule, TriButtonModule, TriProgressModule]
})
export class TriUploadListComponent implements OnChanges {
  list: UploadListFile[] = [];

  private get showPic(): boolean {
    return this.listType === 'picture' || this.listType === 'picture-card';
  }

  @Input() locale: TriSafeAny = {};
  @Input() listType!: TriUploadListType;
  @Input()
  set items(list: TriUploadFile[]) {
    this.list = list;
  }
  @Input() icons!: TriShowUploadList;
  @Input() onPreview?: (file: TriUploadFile) => void;
  @Input() onRemove!: (file: TriUploadFile) => void;
  @Input() onDownload?: (file: TriUploadFile) => void;
  @Input() previewFile?: (file: TriUploadFile) => Observable<string>;
  @Input() previewIsImage?: (file: TriUploadFile) => boolean;
  @Input() iconRender: TriIconRenderTemplate | null = null;
  @Input() dir: Direction = 'ltr';

  private document: Document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private platform = inject(Platform);

  private genErr(file: TriUploadFile): string {
    if (file.response && typeof file.response === 'string') {
      return file.response;
    }
    return (file.error && file.error.statusText) || this.locale.uploadError;
  }

  private extname(url: string): string {
    const temp = url.split('/');
    const filename = temp[temp.length - 1];
    const filenameWithoutSuffix = filename.split(/#|\?/)[0];
    return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
  }

  isImageUrl(file: TriUploadFile): boolean {
    if (isImageFileType(file.type!)) {
      return true;
    }
    const url: string = (file.thumbUrl || file.url || '') as string;
    if (!url) {
      return false;
    }
    const extension = this.extname(url);
    if (/^data:image\//.test(url) || /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg)$/i.test(extension)) {
      return true;
    } else if (/^data:/.test(url)) {
      // other file types of base64
      return false;
    } else if (extension) {
      // other file types which have extension
      return false;
    }
    return true;
  }

  private getIconType(file: UploadListFile): UploadListIconType {
    if (!this.showPic) {
      return '';
    }
    if (file.isUploading || (!file.thumbUrl && !file.url)) {
      return 'uploading';
    } else {
      return 'thumbnail';
    }
  }

  private previewImage(file: File | Blob): Observable<string> {
    if (!isImageFileType(file.type) || !this.platform.isBrowser) {
      return of('');
    }

    const canvas = this.document.createElement('canvas');
    canvas.width = MEASURE_SIZE;
    canvas.height = MEASURE_SIZE;
    canvas.style.cssText = `position: fixed; left: 0; top: 0; width: ${MEASURE_SIZE}px; height: ${MEASURE_SIZE}px; z-index: 9999; display: none;`;
    this.document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    return fromEventOutsideAngular(img, 'load').pipe(
      map(() => {
        const { width, height } = img;

        let drawWidth = MEASURE_SIZE;
        let drawHeight = MEASURE_SIZE;
        let offsetX = 0;
        let offsetY = 0;

        if (width < height) {
          drawHeight = height * (MEASURE_SIZE / width);
          offsetY = -(drawHeight - drawWidth) / 2;
        } else {
          drawWidth = width * (MEASURE_SIZE / height);
          offsetX = -(drawWidth - drawHeight) / 2;
        }

        try {
          ctx!.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        } catch {
          // noop
        }
        const dataURL = canvas.toDataURL();
        this.document.body.removeChild(canvas);

        URL.revokeObjectURL(objectUrl);
        return dataURL;
      })
    );
  }

  private genThumb(): void {
    if (!this.platform.isBrowser) {
      return;
    }

    const win = window as TriSafeAny;
    if (
      !this.showPic ||
      typeof document === 'undefined' ||
      typeof win === 'undefined' ||
      !win.FileReader ||
      !win.File
    ) {
      return;
    }
    this.list
      .filter(file => file.originFileObj instanceof File && file.thumbUrl === undefined)
      .forEach(file => {
        file.thumbUrl = '';
        // Caretaker note: we shouldn't use promises here since they're not cancellable.
        // A promise microtask can be resolved after the view is destroyed. Thus, running `detectChanges()`
        // will cause a runtime exception (`detectChanges()` cannot be run on destroyed views).
        const dataUrl$ = (this.previewFile ? this.previewFile(file) : this.previewImage(file.originFileObj!)).pipe(
          takeUntilDestroyed(this.destroyRef)
        );
        this.ngZone.runOutsideAngular(() => {
          dataUrl$.subscribe(dataUrl => {
            this.ngZone.run(() => {
              file.thumbUrl = dataUrl;
              this.detectChanges();
            });
          });
        });
      });
  }

  private showDownload(file: TriUploadFile): boolean {
    return !!(this.icons.showDownloadIcon && file.status === 'done');
  }

  private fixData(): void {
    this.list.forEach(file => {
      file.isUploading = file.status === 'uploading';
      file.message = this.genErr(file);
      file.linkProps = typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;
      file.isImageUrl = this.previewIsImage ? this.previewIsImage(file) : this.isImageUrl(file);
      file.iconType = this.getIconType(file);
      file.showDownload = this.showDownload(file);
    });
  }

  handlePreview(file: TriUploadFile, e: Event): void {
    if (!this.onPreview) {
      return;
    }

    e.preventDefault();
    return this.onPreview(file);
  }

  handleRemove(file: TriUploadFile, e: Event): void {
    e.preventDefault();
    if (this.onRemove) {
      this.onRemove(file);
    }
  }

  handleDownload(file: TriUploadFile): void {
    if (typeof this.onDownload === 'function') {
      this.onDownload(file);
    } else if (file.url) {
      window.open(file.url);
    }
  }

  // #endregion

  detectChanges(): void {
    this.fixData();
    this.cdr.detectChanges();
  }

  ngOnChanges(): void {
    this.fixData();
    this.genThumb();
  }
}
