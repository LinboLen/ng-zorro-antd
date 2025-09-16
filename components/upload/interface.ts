/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { IndexableObject, TriSafeAny } from 'ng-zorro-antd/core/types';

/** Status */
export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export type TriUploadType = 'select' | 'drag';

/** Built-in styles of the uploading list. */
export type TriUploadListType = 'text' | 'picture' | 'picture-card';

export interface TriUploadFile {
  uid: string;
  size?: number;
  name: string;
  filename?: string;
  lastModified?: string;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  originFileObj?: File;
  percent?: number;
  thumbUrl?: string;
  response?: TriSafeAny;
  error?: TriSafeAny;
  linkProps?: { download: string };
  type?: string;

  [key: string]: TriSafeAny;
}

export interface TriUploadChangeParam {
  file: TriUploadFile;
  fileList: TriUploadFile[];
  event?: { percent: number };
  /** Callback type. */
  type?: string;
}

export interface TriShowUploadList {
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean;
  showDownloadIcon?: boolean;
}

/**
 * @deprecated will be removed in v22.0.0
 * Use `NzBeforeUploadFileType` instead.
 */
export type TriUploadTransformFileType = string | Blob | TriUploadFile | Observable<string | Blob | File>;

export type TriBeforeUploadFileType =
  | boolean
  | Observable<boolean | TriUploadFile | Blob | File | boolean>
  | Promise<boolean | TriUploadFile | Blob | File | boolean>;

export interface ZipButtonOptions {
  disabled?: boolean;
  accept?: string | string[];
  action?: string | ((file: TriUploadFile) => string | Observable<string>);
  directory?: boolean;
  openFileDialogOnClick?: boolean;
  beforeUpload?(file: TriUploadFile, fileList: TriUploadFile[]): TriBeforeUploadFileType;
  customRequest?(item: TriSafeAny): Subscription;
  data?: {} | ((file: TriUploadFile) => {} | Observable<{}>);
  headers?: {} | ((file: TriUploadFile) => {} | Observable<{}>);
  name?: string;
  multiple?: boolean;
  withCredentials?: boolean;
  filters?: UploadFilter[];
  transformFile?(file: TriUploadFile): TriUploadTransformFileType;
  onStart?(file: TriUploadFile): void;
  onProgress?(e: TriSafeAny, file: TriUploadFile): void;
  onSuccess?(ret: TriSafeAny, file: TriUploadFile, xhr: TriSafeAny): void;
  onError?(err: TriSafeAny, file: TriUploadFile): void;
}

export interface UploadFilter {
  name: string;
  fn(fileList: TriUploadFile[]): TriUploadFile[] | Observable<TriUploadFile[]>;
}

export interface TriUploadXHRArgs {
  action?: string;
  name?: string;
  headers?: IndexableObject;
  file: TriUploadFile;
  postFile: string | Blob | File | TriUploadFile;
  data?: IndexableObject;
  withCredentials?: boolean;
  onProgress?(e: TriSafeAny, file: TriUploadFile): void;
  onSuccess?(ret: TriSafeAny, file: TriUploadFile, xhr: TriSafeAny): void;
  onError?(err: TriSafeAny, file: TriUploadFile): void;
}

export type TriIconRenderTemplate = TemplateRef<{ $implicit: TriUploadFile }>;
