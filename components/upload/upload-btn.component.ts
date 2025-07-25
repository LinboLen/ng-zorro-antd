/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ENTER } from '@angular/cdk/keycodes';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, ElementRef, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { warn } from 'ng-zorro-antd/core/logger';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriUploadFile, TriUploadXHRArgs, ZipButtonOptions } from './interface';

@Component({
  selector: '[tri-upload-btn]',
  exportAs: 'triUploadBtn',
  templateUrl: './upload-btn.component.html',
  host: {
    class: 'tri-upload',
    '[attr.tabindex]': '"0"',
    '[attr.role]': '"button"',
    '[class.tri-upload-disabled]': 'options.disabled',
    '(drop)': 'onFileDrop($event)',
    '(dragover)': 'onFileDrop($event)'
  },
  encapsulation: ViewEncapsulation.None
})
export class TriUploadBtnComponent implements OnInit {
  reqs: Record<string, Subscription> = {};
  private destroyed = false;
  @ViewChild('file', { static: true }) file!: ElementRef<HTMLInputElement>;
  @Input() options!: ZipButtonOptions;

  onClick(): void {
    if (this.options.disabled || !this.options.openFileDialogOnClick) {
      return;
    }
    this.file.nativeElement.click();
  }

  // skip safari bug
  onFileDrop(e: DragEvent): void {
    if (this.options.disabled || e.type === 'dragover') {
      e.preventDefault();
      return;
    }
    if (this.options.directory) {
      this.traverseFileTree(e.dataTransfer!.items);
    } else {
      const files: File[] = Array.prototype.slice
        .call(e.dataTransfer!.files)
        .filter((file: File) => this.attrAccept(file, this.options.accept));
      if (files.length) {
        this.uploadFiles(files);
      }
    }

    e.preventDefault();
  }

  onChange(e: Event): void {
    if (this.options.disabled) {
      return;
    }
    const hie = e.target as HTMLInputElement;
    this.uploadFiles(hie.files!);
    hie.value = '';
  }

  private traverseFileTree(files: DataTransferItemList): void {
    const _traverseFileTree = (item: TriSafeAny, path: string): void => {
      if (item.isFile) {
        item.file((file: File) => {
          if (this.attrAccept(file, this.options.accept)) {
            this.uploadFiles([file]);
          }
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();

        dirReader.readEntries((entries: TriSafeAny) => {
          for (const entrieItem of entries) {
            _traverseFileTree(entrieItem, `${path}${item.name}/`);
          }
        });
      }
    };

    for (const file of files as TriSafeAny) {
      _traverseFileTree(file.webkitGetAsEntry(), '');
    }
  }

  private attrAccept(file: File, acceptedFiles?: string | string[]): boolean {
    if (file && acceptedFiles) {
      const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
      const fileName = `${file.name}`;
      const mimeType = `${file.type}`;
      const baseMimeType = mimeType.replace(/\/.*$/, '');

      return acceptedFilesArray.some(type => {
        const validType = type.trim();
        if (validType.charAt(0) === '.') {
          return (
            fileName
              .toLowerCase()
              .indexOf(validType.toLowerCase(), fileName.toLowerCase().length - validType.toLowerCase().length) !== -1
          );
        } else if (/\/\*$/.test(validType)) {
          // This is something like an image/* mime type
          return baseMimeType === validType.replace(/\/.*$/, '');
        }
        return mimeType === validType;
      });
    }
    return true;
  }

  private attachUid(file: TriUploadFile): TriUploadFile {
    if (!file.uid) {
      file.uid = Math.random().toString(36).substring(2);
    }
    return file;
  }

  uploadFiles(fileList: FileList | File[]): void {
    let filters$: Observable<TriUploadFile[]> = of(Array.prototype.slice.call(fileList));
    if (this.options.filters) {
      this.options.filters.forEach(f => {
        filters$ = filters$.pipe(
          switchMap(list => {
            const fnRes = f.fn(list);
            return fnRes instanceof Observable ? fnRes : of(fnRes);
          })
        );
      });
    }
    filters$.subscribe({
      next: list => {
        list.forEach((file: TriUploadFile) => {
          this.attachUid(file);
          this.upload(file, list);
        });
      },
      error: e => {
        warn(`Unhandled upload filter error`, e);
      }
    });
  }

  private upload(file: TriUploadFile, fileList: TriUploadFile[]): void {
    if (!this.options.beforeUpload) {
      return this.post(file);
    }
    const before = this.options.beforeUpload(file, fileList);
    if (before instanceof Observable) {
      before.subscribe({
        next: (processedFile: TriUploadFile) => {
          const processedFileType = Object.prototype.toString.call(processedFile);
          if (processedFileType === '[object File]' || processedFileType === '[object Blob]') {
            this.attachUid(processedFile);
            this.post(processedFile);
          } else if (processedFile) {
            this.post(file);
          }
        },
        error: e => {
          warn(`Unhandled upload beforeUpload error`, e);
        }
      });
    } else if (before) {
      return this.post(file);
    }
  }

  private post(file: TriUploadFile): void {
    if (this.destroyed) {
      return;
    }
    let process$: Observable<string | Blob | File | TriUploadFile> = of(file);
    let transformedFile: string | Blob | File | TriUploadFile | undefined;
    const opt = this.options;
    const { uid } = file;
    const { action, data, headers, transformFile } = opt;

    const args: TriUploadXHRArgs = {
      action: typeof action === 'string' ? action : '',
      name: opt.name,
      headers,
      file,
      postFile: file,
      data,
      withCredentials: opt.withCredentials,
      onProgress: opt.onProgress
        ? e => {
            opt.onProgress!(e, file);
          }
        : undefined,
      onSuccess: (ret, xhr) => {
        this.clean(uid);
        opt.onSuccess!(ret, file, xhr);
      },
      onError: xhr => {
        this.clean(uid);
        opt.onError!(xhr, file);
      }
    };

    if (typeof action === 'function') {
      const actionResult = (action as (file: TriUploadFile) => string | Observable<string>)(file);
      if (actionResult instanceof Observable) {
        process$ = process$.pipe(
          switchMap(() => actionResult),
          map(res => {
            args.action = res;
            return file;
          })
        );
      } else {
        args.action = actionResult;
      }
    }

    if (typeof transformFile === 'function') {
      const transformResult = transformFile(file);
      process$ = process$.pipe(
        switchMap(() => (transformResult instanceof Observable ? transformResult : of(transformResult))),
        tap(newFile => (transformedFile = newFile))
      );
    }

    if (typeof data === 'function') {
      const dataResult = (data as (file: TriUploadFile) => {} | Observable<{}>)(file);
      if (dataResult instanceof Observable) {
        process$ = process$.pipe(
          switchMap(() => dataResult),
          map(res => {
            args.data = res;
            return transformedFile ?? file;
          })
        );
      } else {
        args.data = dataResult;
      }
    }

    if (typeof headers === 'function') {
      const headersResult = (headers as (file: TriUploadFile) => {} | Observable<{}>)(file);
      if (headersResult instanceof Observable) {
        process$ = process$.pipe(
          switchMap(() => headersResult),
          map(res => {
            args.headers = res;
            return transformedFile ?? file;
          })
        );
      } else {
        args.headers = headersResult;
      }
    }

    process$.subscribe(newFile => {
      args.postFile = newFile;
      const req$ = (opt.customRequest || this.xhr).call(this, args);
      if (!(req$ instanceof Subscription)) {
        warn(`Must return Subscription type in '[nzCustomRequest]' property`);
      }
      this.reqs[uid] = req$;
      opt.onStart!(file);
    });
  }

  private xhr(args: TriUploadXHRArgs): Subscription {
    const formData = new FormData();

    if (args.data) {
      Object.keys(args.data).map(key => {
        formData.append(key, args.data![key]);
      });
    }

    formData.append(args.name!, args.postFile as TriSafeAny);

    if (!args.headers) {
      args.headers = {};
    }
    if (args.headers['X-Requested-With'] !== null) {
      args.headers['X-Requested-With'] = `XMLHttpRequest`;
    } else {
      delete args.headers['X-Requested-With'];
    }
    const req = new HttpRequest('POST', args.action!, formData, {
      reportProgress: true,
      withCredentials: args.withCredentials,
      headers: new HttpHeaders(args.headers)
    });
    return this.http!.request(req).subscribe({
      next: (event: HttpEvent<TriSafeAny>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            (event as TriSafeAny).percent = (event.loaded / event.total!) * 100;
          }
          args.onProgress!(event, args.file);
        } else if (event instanceof HttpResponse) {
          args.onSuccess!(event.body, args.file, event);
        }
      },
      error: err => {
        this.abort(args.file);
        args.onError!(err, args.file);
      }
    });
  }

  private clean(uid: string): void {
    const req$ = this.reqs[uid];
    if (req$ instanceof Subscription) {
      req$.unsubscribe();
    }
    delete this.reqs[uid];
  }

  abort(file?: TriUploadFile): void {
    if (file) {
      this.clean(file && file.uid);
    } else {
      Object.keys(this.reqs).forEach(uid => this.clean(uid));
    }
  }

  private http = inject(HttpClient, { optional: true });
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    if (!this.http) {
      throw new Error(
        `Not found 'HttpClient', You can configure 'HttpClient' with 'provideHttpClient()' in your root module.`
      );
    }
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.abort();
    });
  }

  ngOnInit(): void {
    // Caretaker note: `input[type=file].click()` will open a native OS file picker,
    // it doesn't require Angular to run `ApplicationRef.tick()`.
    fromEventOutsideAngular(this.elementRef.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onClick());

    fromEventOutsideAngular<KeyboardEvent>(this.elementRef.nativeElement, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (this.options.disabled) {
          return;
        }
        if (event.key === 'Enter' || event.keyCode === ENTER) {
          this.onClick();
        }
      });
  }
}
