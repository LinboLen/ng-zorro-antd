/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DOCUMENT,
  EventEmitter,
  inject,
  input,
  Input,
  numberAttribute,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BooleanInput, TriSafeAny } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular, toBoolean } from 'ng-zorro-antd/core/util';
import { TriI18nService, TriUploadI18nInterface } from 'ng-zorro-antd/i18n';

import {
  TriIconRenderTemplate,
  TriShowUploadList,
  TriUploadChangeParam,
  TriUploadFile,
  TriUploadListType,
  TriUploadTransformFileType,
  TriUploadType,
  TriUploadXHRArgs,
  UploadFilter,
  ZipButtonOptions,
  type TriBeforeUploadFileType
} from './interface';
import { TriUploadBtnComponent } from './upload-btn.component';
import { TriUploadListComponent } from './upload-list.component';

@Component({
  selector: 'tri-upload',
  exportAs: 'triUpload',
  templateUrl: './upload.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tri-upload-picture-card-wrapper]': 'listType === "picture-card"'
  },
  imports: [TriUploadListComponent, NgTemplateOutlet, TriUploadBtnComponent]
})
export class TriUploadComponent implements OnInit, AfterViewInit, OnChanges {
  static ngAcceptInputType_nzShowUploadList: BooleanInput | TriShowUploadList;

  private cdr = inject(ChangeDetectorRef);
  private i18n = inject(TriI18nService);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @ViewChild('uploadComp', { static: false }) uploadComp!: TriUploadBtnComponent;
  @ViewChild('listComp', { static: false }) listComp!: TriUploadListComponent;

  locale!: TriUploadI18nInterface;
  dir: Direction = 'ltr';

  // #region fields

  @Input() type: TriUploadType = 'select';
  @Input({ transform: numberAttribute }) limit = 0;
  @Input({ transform: numberAttribute }) size = 0;

  @Input() fileType?: string;
  @Input() accept?: string | string[];
  @Input() action?: string | ((file: TriUploadFile) => string | Observable<string>);
  @Input({ transform: booleanAttribute }) directory = false;
  @Input({ transform: booleanAttribute }) openFileDialogOnClick = true;
  @Input() beforeUpload?: (file: TriUploadFile, fileList: TriUploadFile[]) => TriBeforeUploadFileType;
  @Input() customRequest?: (item: TriUploadXHRArgs) => Subscription;
  @Input() data?: {} | ((file: TriUploadFile) => {} | Observable<{}>);
  @Input() filter: UploadFilter[] = [];
  @Input() fileList: TriUploadFile[] = [];
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() headers?: {} | ((file: TriUploadFile) => {} | Observable<{}>);
  @Input() listType: TriUploadListType = 'text';
  @Input({ transform: booleanAttribute }) multiple = false;
  @Input() name = 'file';

  private _showUploadList: boolean | TriShowUploadList = true;
  private document: Document = inject(DOCUMENT);

  @Input()
  set showUploadList(value: boolean | TriShowUploadList) {
    this._showUploadList = typeof value === 'boolean' ? toBoolean(value) : value;
  }

  get showUploadList(): boolean | TriShowUploadList {
    return this._showUploadList;
  }

  @Input({ transform: booleanAttribute }) showButton = true;
  @Input({ transform: booleanAttribute }) withCredentials = false;

  @Input() remove?: (file: TriUploadFile) => boolean | Observable<boolean>;
  @Input() preview?: (file: TriUploadFile) => void;
  @Input() previewFile?: (file: TriUploadFile) => Observable<string>;
  @Input() previewIsImage?: (file: TriUploadFile) => boolean;
  /**
   * @deprecated will be removed in v22.0.0
   * Use `nzBeforeUpload` instead.
   */
  @Input() transformFile?: (file: TriUploadFile) => TriUploadTransformFileType;
  @Input() download?: (file: TriUploadFile) => void;
  @Input() iconRender: TriIconRenderTemplate | null = null;
  @Input() fileListRender: TemplateRef<{ $implicit: TriUploadFile[] }> | null = null;

  readonly maxCount = input<number>();

  @Output() readonly change: EventEmitter<TriUploadChangeParam> = new EventEmitter<TriUploadChangeParam>();
  @Output() readonly fileListChange: EventEmitter<TriUploadFile[]> = new EventEmitter<TriUploadFile[]>();

  _btnOptions?: ZipButtonOptions;

  private zipOptions(): this {
    if (typeof this.showUploadList === 'boolean' && this.showUploadList) {
      this.showUploadList = {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: true
      };
    }
    // filters
    const filters: UploadFilter[] = this.filter.slice();
    if (this.multiple && this.limit > 0 && filters.findIndex(w => w.name === 'limit') === -1) {
      filters.push({
        name: 'limit',
        fn: (fileList: TriUploadFile[]) => fileList.slice(-this.limit)
      });
    }
    if (this.size > 0 && filters.findIndex(w => w.name === 'size') === -1) {
      filters.push({
        name: 'size',
        fn: (fileList: TriUploadFile[]) => fileList.filter(w => w.size! / 1024 <= this.size)
      });
    }
    if (this.fileType && this.fileType.length > 0 && filters.findIndex(w => w.name === 'type') === -1) {
      const types = this.fileType.split(',');
      filters.push({
        name: 'type',
        fn: (fileList: TriUploadFile[]) => fileList.filter(w => ~types.indexOf(w.type!))
      });
    }
    this._btnOptions = {
      disabled: this.disabled,
      accept: this.accept,
      action: this.action,
      directory: this.directory,
      openFileDialogOnClick: this.openFileDialogOnClick,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest,
      data: this.data,
      headers: this.headers,
      name: this.name,
      multiple: this.multiple,
      withCredentials: this.withCredentials,
      filters,
      transformFile: this.transformFile,
      onStart: this.onStart,
      onProgress: this.onProgress,
      onSuccess: this.onSuccess,
      onError: this.onError
    };
    return this;
  }

  private readonly platform = inject(Platform);

  // #endregion

  // #region upload

  private fileToObject(file: TriUploadFile): TriUploadFile {
    return {
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      name: file.filename || file.name,
      size: file.size,
      type: file.type,
      uid: file.uid,
      response: file.response,
      error: file.error,
      percent: 0,
      originFileObj: file as TriSafeAny
    };
  }

  private getFileItem(file: TriUploadFile, fileList: TriUploadFile[]): TriUploadFile {
    return fileList.filter(item => item.uid === file.uid)[0];
  }

  private removeFileItem(file: TriUploadFile, fileList: TriUploadFile[]): TriUploadFile[] {
    return fileList.filter(item => item.uid !== file.uid);
  }

  private onStart = (file: TriUploadFile): void => {
    const maxCount = this.maxCount();
    if (!this.fileList) {
      this.fileList = [];
    }
    const targetItem = this.fileToObject(file);
    targetItem.status = 'uploading';
    if (maxCount === 1) {
      this.fileList = [targetItem];
    } else if (!maxCount || maxCount <= 0 || this.fileList.length < maxCount) {
      this.fileList = [...this.fileList, targetItem];
    }
    this.fileListChange.emit(this.fileList);
    this.change.emit({ file: targetItem, fileList: this.fileList, type: 'start' });
    this.detectChangesList();
  };

  private onProgress = (e: { percent: number }, file: TriUploadFile): void => {
    const fileList = this.fileList;
    const targetItem = this.getFileItem(file, fileList);

    if (!targetItem) {
      return;
    }

    targetItem.percent = e.percent;
    this.change.emit({
      event: e,
      file: targetItem,
      fileList: this.fileList,
      type: 'progress'
    });
    this.detectChangesList();
  };

  private onSuccess = (res: {}, file: TriUploadFile): void => {
    const fileList = this.fileList;
    const targetItem = this.getFileItem(file, fileList);
    if (!targetItem) {
      return;
    }
    targetItem.status = 'done';
    targetItem.response = res;
    this.change.emit({
      file: targetItem,
      fileList,
      type: 'success'
    });
    this.detectChangesList();
  };

  private onError = (err: {}, file: TriUploadFile): void => {
    const fileList = this.fileList;
    const targetItem = this.getFileItem(file, fileList);

    if (!targetItem) {
      return;
    }

    targetItem.error = err;
    targetItem.status = 'error';
    this.change.emit({
      file: { ...targetItem },
      fileList,
      type: 'error'
    });
    this.detectChangesList();
  };

  // #endregion

  // #region drag

  private dragState?: string;

  // skip safari bug
  fileDrop(e: DragEvent): void {
    if (e.type === this.dragState) {
      return;
    }
    this.dragState = e.type;
    this.setClassMap();
  }

  // #endregion

  // #region list

  private detectChangesList(): void {
    this.cdr.detectChanges();
    this.listComp?.detectChanges();
  }

  onRemove = (file: TriUploadFile): void => {
    this.uploadComp.abort(file);
    file.status = 'removed';
    const fnRes =
      typeof this.remove === 'function' ? this.remove(file) : this.remove == null ? true : this.remove;
    (fnRes instanceof Observable ? fnRes : of(fnRes)).pipe(filter((res: boolean) => res)).subscribe(() => {
      this.fileList = this.removeFileItem(file, this.fileList);
      this.change.emit({
        file,
        fileList: this.fileList,
        type: 'removed'
      });
      this.fileListChange.emit(this.fileList);
      this.cdr.detectChanges();
    });
  };

  // #endregion

  // #region styles

  private prefixCls = 'ant-upload';
  classList: string[] = [];

  private setClassMap(): void {
    let subCls: string[] = [];
    if (this.type === 'drag') {
      if (this.fileList.some(file => file.status === 'uploading')) {
        subCls.push(`${this.prefixCls}-drag-uploading`);
      }
      if (this.dragState === 'dragover') {
        subCls.push(`${this.prefixCls}-drag-hover`);
      }
    } else {
      subCls = [`${this.prefixCls}-select-${this.listType}`];
    }

    this.classList = [
      this.prefixCls,
      `${this.prefixCls}-${this.type}`,
      ...subCls,
      (this.disabled && `${this.prefixCls}-disabled`) || '',
      (this.dir === 'rtl' && `${this.prefixCls}-rtl`) || ''
    ].filter(item => !!item);

    this.cdr.detectChanges();
  }

  // #endregion

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.setClassMap();
      this.cdr.detectChanges();
    });

    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Upload');
      this.detectChangesList();
    });
  }

  ngAfterViewInit(): void {
    if (this.platform.FIREFOX) {
      // fix firefox drop open new tab
      fromEventOutsideAngular<MouseEvent>(this.document.body, 'drop')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(event => {
          event.preventDefault();
          event.stopPropagation();
        });
    }
  }

  ngOnChanges(): void {
    this.zipOptions().setClassMap();
  }
}
