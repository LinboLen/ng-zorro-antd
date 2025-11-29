/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ENTER, TAB } from '@angular/cdk/keycodes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ApplicationRef,
  Component,
  DebugElement,
  provideZoneChangeDetection,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Observable, Observer, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { dispatchKeyboardEvent } from 'ng-zorro-antd/core/testing';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriI18nService } from 'ng-zorro-antd/i18n';
import en_US from 'ng-zorro-antd/i18n/languages/en_US';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';
import { TriUploadModule } from 'ng-zorro-antd/upload/upload.module';

import {
  TriIconRenderTemplate,
  TriShowUploadList,
  TriUploadChangeParam,
  TriUploadFile,
  TriUploadListType,
  TriUploadTransformFileType,
  TriUploadType,
  UploadFilter,
  ZipButtonOptions
} from './interface';
import { TriUploadBtnComponent } from './upload-btn.component';
import { TriUploadListComponent } from './upload-list.component';
import { TriUploadComponent } from './upload.component';

const FILE_CONTENT = [
  `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`
];
const FILE = new File(FILE_CONTENT, '');
const PNG_SMALL = {
  target: {
    files: [
      new File(FILE_CONTENT, 'test.png', {
        type: 'image/png'
      })
    ]
  }
};
const JPG_SMALL = {
  target: {
    files: [
      new File(FILE_CONTENT, 'test.jpg', {
        type: 'image/jpg'
      })
    ]
  }
};
const LARGE_FILE = {
  name: 'test.png',
  size: 500001,
  type: 'image/png'
};
const PNG_BIG = { target: { files: { 0: LARGE_FILE, length: 1, item: () => LARGE_FILE } } };

class Item {
  children?: Item[];
  constructor(public name: string) {}
}

describe('upload', () => {
  describe('component', () => {
    let fixture: ComponentFixture<TestUploadComponent>;
    let dl: DebugElement;
    let instance: TestUploadComponent;
    let pageObject: NzUploadPageObject;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          // todo: use zoneless
          provideZoneChangeDetection(),
          provideNzIconsTesting(),
          provideNoopAnimations(),
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting()
        ]
      });
      fixture = TestBed.createComponent(TestUploadComponent);
      dl = fixture.debugElement;
      instance = dl.componentInstance;
      fixture.detectChanges();
      pageObject = new NzUploadPageObject();
      httpMock = TestBed.inject(HttpTestingController);
    });

    describe('[default]', () => {
      it('should be upload a file', () => {
        expect(instance._nzChange).toBeUndefined();
        pageObject.postFile(FILE);
        const req = httpMock.expectOne(instance.action as string);
        pageObject.expectChange();
        req.flush({});
        pageObject.expectChange('success');
        httpMock.verify();
      });

      it('should notify progress when upload a large file', () => {
        pageObject.postLarge();
        const req = httpMock.expectOne(instance.action as string);
        req.event({ type: 1, loaded: 0, total: 0 });
        pageObject.expectChange('progress');
        req.event({ type: 1, loaded: 10, total: 100 });
        pageObject.expectChange('progress');
        expect(instance._nzChange.event!.percent).toBe(10);
        req.event({ type: 1, loaded: 20, total: 100 });
        expect(instance._nzChange.event!.percent).toBe(20);
        req.flush({ status: 'ok' });
        httpMock.verify();
      });

      it('should be error when using 404 http', () => {
        pageObject.postLarge();
        const req = httpMock.expectOne(instance.action as string);
        req.error(new ProgressEvent('network'), { status: 404, statusText: 'not found' });
        pageObject.expectChange('error');
        httpMock.verify();
      });

      it('should limit 2 file when allow multiple', () => {
        instance.limit = 2;
        instance.multiple = true;
        fixture.detectChanges();
        expect(instance._beforeUploadList.length).toBe(0);
        pageObject.postFile([...PNG_SMALL.target.files, ...PNG_SMALL.target.files, ...PNG_SMALL.target.files]);
        expect(instance._beforeUploadList.length).toBe(instance.limit);
      });

      it('should limit png file type', () => {
        instance.fileType = 'image/png';
        fixture.detectChanges();
        expect(instance._beforeUploadList.length).toBe(0);
        pageObject.postFile(JPG_SMALL.target.files);
        expect(instance._beforeUploadList.length).toBe(0);
      });

      it('should limit 1kb size', () => {
        instance.size = 1;
        fixture.detectChanges();
        expect(instance._beforeUploadList.length).toBe(0);
        pageObject.postLarge();
        expect(instance._beforeUploadList.length).toBe(0);
      });

      it('should be abort when user canceled', () => {
        pageObject.postLarge();
        const req = httpMock.expectOne(instance.action as string);
        req.event({ type: 1, loaded: 10, total: 100 });
        pageObject.expectLength(1);
        pageObject.getByCss('.anticon-delete').nativeElement.click();
        fixture.detectChanges();
        pageObject.expectLength(0);
        httpMock.verify();
      });

      it('should be removed via list', () => {
        instance.fileList = [
          {
            uid: 1,
            name: 'xxx.png',
            status: 'done',
            response: 'Server Error 500', // custom error message to show
            url: 'http://www.baidu.com/xxx.png'
          } as TriSafeAny
        ];
        fixture.detectChanges();
        pageObject.expectLength(1);
        pageObject.getByCss('.anticon-delete').nativeElement.click();
        fixture.detectChanges();
        pageObject.expectLength(0);
      });

      it('should be upload a file via drag', () => {
        instance.type = 'drag';
        fixture.detectChanges();
        instance.comp.fileDrop({ type: 'dragover' } as TriSafeAny);
        instance.comp.fileDrop({ type: 'dragover' } as TriSafeAny);
        fixture.detectChanges();
        expect(pageObject.getByCss('.ant-upload-drag-hover') != null).toBe(true);
      });

      it('should be show uploading status when via drag', () => {
        instance.type = 'drag';
        instance.fileList = [
          {
            uid: 1,
            name: 'xxx.png',
            status: 'uploading'
          } as TriSafeAny
        ];
        fixture.detectChanges();
        expect(pageObject.getByCss('.ant-upload-drag-uploading') != null).toBe(true);
      });

      it('#i18n', () => {
        instance.fileList = [
          {
            uid: 1,
            name: 'xxx.png',
            status: 'done',
            response: 'Server Error 500', // custom error message to show
            url: 'http://www.baidu.com/xxx.png'
          } as TriSafeAny
        ];
        fixture.detectChanges();
        TestBed.inject(TriI18nService).setLocale(en_US);
        fixture.detectChanges();
        const removeFileText = pageObject.getByCss('.ant-upload-list-item-card-actions-btn > .anticon-delete')
          .nativeElement as HTMLElement;
        expect(removeFileText.parentElement!.title).toBe(en_US.Upload.removeFile);
      });
    });

    describe('property', () => {
      describe('[nzActive]', () => {
        it('should be return string when is function', () => {
          const url = `/new-url`;
          instance.action = () => url;
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(() => true);
          expect(req.request.url).toBe(url);
        });

        it('should be return Observable when is function', () => {
          const url = `/new-url-with-observable`;
          instance.action = () => of(url);
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(() => true);
          expect(req.request.url).toBe(url);
        });
      });

      describe('[nzData]', () => {
        it('should custom form data vis function', () => {
          instance.data = () => ({ a: 1 });
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(instance.action as string);
          expect((req.request.body as FormData).get('a')).toBe('1');
          req.flush({});
          httpMock.verify();
        });

        it('should custom form data via object', () => {
          instance.data = { a: 1 };
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(instance.action as string);
          expect((req.request.body as FormData).get('a')).toBe('1');
          req.flush({});
          httpMock.verify();
        });

        it('should custom form data via Observable', () => {
          instance.data = () => of({ a: 1 });
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(instance.action as string);
          expect((req.request.body as FormData).get('a')).toBe('1');
          req.flush({});
          httpMock.verify();
        });

        it('should custom filter work', () => {
          instance.filter = [{ name: 'custom', fn: () => [] }];
          fixture.detectChanges();
          expect(instance._beforeUploadList.length).toBe(0);
          pageObject.postLarge();
          expect(instance._beforeUploadList.length).toBe(0);
        });
      });

      it('[nzDisabled]', () => {
        instance.disabled = true;
        fixture.detectChanges();
        expect(pageObject.getByCss('.ant-upload-disabled') != null).toBe(true);
      });

      describe('[nzHeaders]', () => {
        it('should custom form data vis function', () => {
          instance.headers = () => ({ a: '1' });
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(instance.action as string);
          expect(req.request.headers.get('a')).toBe('1');
          req.flush({});
          httpMock.verify();
        });

        it('should custom form data vis object', () => {
          instance.headers = { a: '1' };
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(instance.action as string);
          expect(req.request.headers.get('a')).toBe('1');
          req.flush({});
          httpMock.verify();
        });

        it('should custom form data vis Observable', () => {
          instance.headers = () => of({ a: '1' });
          fixture.detectChanges();
          pageObject.postSmall();
          const req = httpMock.expectOne(instance.action as string);
          expect(req.request.headers.get('a')).toBe('1');
          req.flush({});
          httpMock.verify();
        });

        it('should be allow null header', () => {
          instance.headers = null;
          fixture.detectChanges();
          pageObject.postSmall().expectChange();
        });
      });

      describe('[nzTransformFile]', () => {
        it('should be from small to big', () => {
          instance.transformFile = () => new File([`1`], `1.png`);
          fixture.detectChanges();
          pageObject.postLarge();
          const req = httpMock.expectOne(instance.action as string);
          expect((req.request.body.get('file') as TriUploadFile).size).toBe(1);
          req.flush({});
          httpMock.verify();
        });

        it('should return Observable', () => {
          instance.transformFile = () => of(new File([`123`], `1.png`));
          fixture.detectChanges();
          pageObject.postLarge();
          const req = httpMock.expectOne(instance.action as string);
          expect((req.request.body.get('file') as TriUploadFile).size).toBe(3);
          req.flush({});
          httpMock.verify();
        });
      });

      describe('when nzType is drag', () => {
        it('should working', () => {
          instance.type = 'drag';
          fixture.detectChanges();
          expect(pageObject.getByCss('.ant-upload-drag') != null).toBe(true);
        });

        it('should be remove item', () => {
          instance.type = 'drag';
          instance.fileList = [
            {
              uid: 1,
              name: 'xxx.png',
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: 'http://www.baidu.com/xxx.png'
            }
          ] as TriSafeAny[];
          fixture.detectChanges();
          expect(instance._onRemove).toBe(false);
          dl.query(By.css('.anticon-delete')).nativeElement.click();
          expect(instance._onRemove).toBe(true);
        });
      });

      it('[nzShowButton]', () => {
        instance.showButton = false;
        fixture.detectChanges();
        const btnAreaEl = pageObject.getByCss(`.ant-upload-${instance.type}`);
        expect(btnAreaEl.styles.display).toBe('none');
      });

      it('[nzWithCredentials]', () => {
        instance.withCredentials = true;
        fixture.detectChanges();
        pageObject.postSmall();
        const req = httpMock.expectOne(instance.action as string);
        expect(req.request.withCredentials).toBe(true);
        req.flush({});
        httpMock.verify();
      });

      describe('[nzBeforeUpload]', () => {
        it('should be allow null', () => {
          instance.beforeUpload = null;
          fixture.detectChanges();
          expect(instance._beforeUpload).toBe(false);
          pageObject.postSmall();
          expect(instance._beforeUpload).toBe(false);
        });

        describe('using observable', () => {
          it('can return true', () => {
            spyOn(instance, 'nzChange');
            instance.beforeUpload = (): Observable<TriSafeAny> => of(true);
            fixture.detectChanges();
            pageObject.postSmall();
            expect(instance.change).toHaveBeenCalled();
          });

          it('can return same file', () => {
            let ret = false;
            instance.beforeUpload = (file: TriUploadFile): Observable<TriSafeAny> => {
              ret = true;
              return of(file);
            };
            fixture.detectChanges();
            pageObject.postSmall();
            expect(ret).toBe(true);
          });

          it('can return a string file', () => {
            let ret = false;
            instance.beforeUpload = (): Observable<TriSafeAny> => {
              ret = true;
              return of('file');
            };
            fixture.detectChanges();
            pageObject.postSmall();
            expect(ret).toBe(true);
          });

          it('can return a blob file', () => {
            let ret = false;
            instance.beforeUpload = (): Observable<TriSafeAny> => {
              ret = true;
              return of(new Blob([JSON.stringify(1, null, 2)], { type: 'application/json' }));
            };
            fixture.detectChanges();
            pageObject.postSmall();
            expect(ret).toBe(true);
          });

          it('cancel upload when return a false value', () => {
            expect(instance._nzChange).toBeUndefined();
            instance.beforeUpload = (): Observable<TriSafeAny> => of(false);
            fixture.detectChanges();
            pageObject.postSmall();
            expect(instance._nzChange).toBeUndefined();
          });

          it('should be console.warn error', () => {
            let warnMsg = '';
            console.warn = jasmine.createSpy().and.callFake((...res: string[]) => (warnMsg = res.join(' ')));
            expect(instance._nzChange).toBeUndefined();
            instance.beforeUpload = (): Observable<TriSafeAny> => throwError(() => '');
            fixture.detectChanges();
            pageObject.postSmall();
            expect(warnMsg).toContain(`Unhandled upload beforeUpload error`);
          });
        });

        describe('using promise', () => {
          it('should upload when promise resolves to true', fakeAsync(() => {
            let hookExecuted = false;
            instance.beforeUpload = (): Promise<boolean> => {
              hookExecuted = true;
              return Promise.resolve(true);
            };
            fixture.detectChanges();
            pageObject.postSmall();
            tick();
            expect(hookExecuted).toBe(true);
          }));

          it('should upload when promise resolves to file', fakeAsync(() => {
            let hookExecuted = false;
            instance.beforeUpload = (file: TriUploadFile): Promise<TriUploadFile> => {
              hookExecuted = true;
              return Promise.resolve(file);
            };
            fixture.detectChanges();
            pageObject.postSmall();
            tick();
            expect(hookExecuted).toBe(true);
          }));

          it('should upload with blob when promise resolves to blob', fakeAsync(() => {
            let hookExecuted = false;
            const testBlob = new Blob(['test content'], { type: 'text/plain' });
            instance.beforeUpload = (): Promise<Blob> => {
              hookExecuted = true;
              return Promise.resolve(testBlob);
            };
            fixture.detectChanges();
            pageObject.postSmall();
            tick();
            expect(hookExecuted).toBe(true);
          }));

          it('should cancel upload when promise resolves to false', fakeAsync(() => {
            expect(instance._nzChange).toBeUndefined();
            instance.beforeUpload = (): Promise<boolean> => Promise.resolve(false);
            fixture.detectChanges();
            pageObject.postSmall();
            tick();
            expect(instance._nzChange).toBeUndefined();
          }));

          it('should work with promise that resolves to boolean true', fakeAsync(() => {
            let hookCalled = false;
            instance.beforeUpload = (): Promise<boolean> => {
              hookCalled = true;
              return Promise.resolve(true);
            };
            fixture.detectChanges();
            pageObject.postSmall();
            tick();
            expect(hookCalled).toBe(true);
          }));

          it('should cancel upload when promise rejects with false', fakeAsync(() => {
            expect(instance._nzChange).toBeUndefined();
            instance.beforeUpload = (): Promise<boolean> => Promise.reject(false);
            fixture.detectChanges();
            pageObject.postSmall();
            tick();
            expect(instance._nzChange).toBeUndefined();
          }));
        });
      });

      describe('[nzFilter]', () => {
        it('should be custom limit', () => {
          instance.multiple = true;
          instance.limit = 1;
          instance.filter = [
            {
              name: 'limit',
              fn: (fileList: TriUploadFile[]) => fileList.slice(-instance.limit)
            }
          ];
          fixture.detectChanges();
          expect(instance._beforeUploadList.length).toBe(0);
          pageObject.postFile([...PNG_SMALL.target.files, ...PNG_SMALL.target.files, ...PNG_SMALL.target.files]);
          expect(instance._beforeUploadList.length).toBe(instance.limit);
        });

        it('should be custom size', () => {
          instance.size = 1;
          instance.filter = [
            {
              name: 'size',
              fn: (fileList: TriUploadFile[]) => fileList.filter(w => w.size! / 1024 <= instance.size)
            }
          ];
          fixture.detectChanges();
          expect(instance._beforeUploadList.length).toBe(0);
          pageObject.postLarge();
          expect(instance._beforeUploadList.length).toBe(0);
        });

        it('should be custom type', () => {
          instance.fileType = 'image/png';
          instance.filter = [
            {
              name: 'type',
              fn: (fileList: TriUploadFile[]) => fileList.filter(w => ~[instance.fileType].indexOf(w.type))
            }
          ];
          fixture.detectChanges();
          expect(instance._beforeUploadList.length).toBe(0);
          pageObject.postFile(JPG_SMALL.target.files);
          expect(instance._beforeUploadList.length).toBe(0);
        });

        describe('with Observable', () => {
          it('should working', () => {
            instance.filter = [
              {
                name: 'f1',
                fn: (fileList: TriUploadFile[]) =>
                  new Observable((observer: Observer<TriUploadFile[]>) => {
                    observer.next(fileList.slice(1));
                    observer.complete();
                  })
              },
              {
                name: 'f2',
                fn: (fileList: TriUploadFile[]) =>
                  new Observable((observer: Observer<TriUploadFile[]>) => {
                    observer.next(fileList.slice(1));
                    observer.complete();
                  })
              }
            ];
            fixture.detectChanges();
            expect(instance._beforeUploadList.length).toBe(0);
            pageObject.postFile([...PNG_SMALL.target.files, ...PNG_SMALL.target.files, ...PNG_SMALL.target.files]);
            expect(instance._beforeUploadList.length).toBe(1);
          });

          it('should be console.warn error', () => {
            let warnMsg = '';
            console.warn = jasmine.createSpy().and.callFake((...res: string[]) => (warnMsg = res.join(' ')));
            instance.filter = [
              {
                name: 'f1',
                fn: () =>
                  new Observable((observer: Observer<TriUploadFile[]>) => {
                    observer.error('filter error');
                  })
              }
            ];
            fixture.detectChanges();
            pageObject.postFile(PNG_SMALL.target.files);
            expect(warnMsg).toContain(`Unhandled upload filter error`);
          });
        });
      });

      it('#nzFileList, should be allow empty', () => {
        instance.fileList = null!;
        fixture.detectChanges();
        expect(instance._nzChange).toBeUndefined();
        pageObject.postFile(FILE);
        const req = httpMock.expectOne(instance.action as string);
        pageObject.expectChange();
        req.flush({});
        pageObject.expectChange('success');
        httpMock.verify();
      });

      describe('[nzRemove]', () => {
        const count = 3;

        beforeEach(() => {
          instance.fileList = [
            {
              uid: 1,
              name: 'xxx.png',
              status: 'done',
              response: 'Server Error 500', // custom error message to show
              url: 'http://www.baidu.com/xxx.png'
            },
            {
              uid: 2,
              name: 'yyy.png',
              status: 'done',
              url: 'http://www.baidu.com/yyy.png'
            },
            {
              uid: 3,
              name: 'zzz.png',
              status: 'error',
              response: 'Server Error 500', // custom error message to show
              url: 'http://www.baidu.com/zzz.png'
            }
          ] as TriSafeAny[];
          fixture.detectChanges();
        });

        it('should be return a Observable', () => {
          instance.onRemove = () => of(false);
          fixture.detectChanges();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count);
          dl.query(By.css('.anticon-delete')).nativeElement.click();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count);
        });

        it('should be return a Observable includes a delay operation', (done: () => void) => {
          const DELAY = 20;
          instance.onRemove = () => of(true).pipe(delay(DELAY));
          fixture.detectChanges();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count);
          dl.query(By.css('.anticon-delete')).nativeElement.click();
          setTimeout(() => {
            expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count - 1);
            done();
          }, DELAY + 1);
        });

        it('should be return a truth value', () => {
          instance.onRemove = () => true;
          fixture.detectChanges();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count);
          dl.query(By.css('.anticon-delete')).nativeElement.click();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count - 1);
        });

        it('should be return a falsy value', () => {
          instance.onRemove = () => false;
          fixture.detectChanges();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count);
          dl.query(By.css('.anticon-delete')).nativeElement.click();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count);
        });

        it('should be with null', () => {
          instance.onRemove = undefined;
          fixture.detectChanges();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count);
          dl.query(By.css('.anticon-delete')).nativeElement.click();
          expect(dl.queryAll(By.css('.anticon-delete')).length).toBe(count - 1);
        });
      });

      describe('[nzListType]', () => {
        describe(`should be only allow type is picture or picture-card generate thumbnail`, () => {
          it('with text', () => {
            instance.listType = 'text';
            fixture.detectChanges();
            pageObject.postSmall();
            fixture.detectChanges();
            expect(instance.comp.fileList[0].thumbUrl).toBeUndefined();
          });

          it('with picture', () => {
            instance.listType = 'picture';
            fixture.detectChanges();
            pageObject.postSmall();
            fixture.detectChanges();
            expect(instance.comp.fileList[0].thumbUrl).not.toBeUndefined();
          });
        });
      });

      it('#nzIconRender', () => {
        instance.fileList = [
          {
            uid: 1,
            name: 'xxx.png',
            status: 'uploading'
          } as TriSafeAny
        ];
        instance.iconRender = instance.customIconRender;
        fixture.detectChanges();
        const el = pageObject.getByCss(`.customIconRender`);
        expect(el != null).toBe(true);
        expect((el.nativeElement as HTMLElement).textContent).toBe('asdf');
      });

      it('#nzFileListRender', () => {
        instance.fileList = [
          {
            uid: 1,
            name: 'xxx.png',
            status: 'uploading'
          } as TriSafeAny
        ];
        instance.fileListRender = instance._fileListRender;
        fixture.detectChanges();
        const el = pageObject.getByCss(`.fileListRender`);
        expect(el != null).toBe(true);
        expect((el.nativeElement as HTMLElement).textContent).toBe('asdf');
      });

      describe('[nzMaxCount]', () => {
        it('should replace existing file when nzMaxCount is 1', () => {
          instance.maxCount = 1;
          instance.fileList = [
            {
              uid: 1,
              name: 'existing.png',
              status: 'done'
            } as TriSafeAny
          ];
          fixture.detectChanges();

          expect(instance.fileList.length).toBe(1);
          expect(instance.fileList[0].name).toBe('existing.png');

          // Upload a new file
          pageObject.postSmall();
          const req = httpMock.expectOne(instance.action as string);
          req.flush({});

          // Should replace the existing file
          expect(instance.fileList.length).toBe(1);
          expect(instance.fileList[0].name).toBe('test.png');
        });

        it('should limit files when nzMaxCount is greater than 1', () => {
          instance.maxCount = 2;
          instance.fileList = [];
          fixture.detectChanges();

          // Upload first file
          pageObject.postSmall();
          let req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(1);

          // Upload second file
          pageObject.postFile([new File(['content'], 'second.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(2);

          // Upload third file - upload happens but file is not added to list due to max count
          pageObject.postFile([new File(['content'], 'third.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          // File list should still be 2 because max count prevents adding more files
          expect(instance.fileList.length).toBe(2);
        });

        it('should allow unlimited files when nzMaxCount is undefined', () => {
          instance.maxCount = undefined;
          instance.fileList = [];
          fixture.detectChanges();

          // Upload multiple files
          for (let i = 0; i < 5; i++) {
            pageObject.postFile([new File(['content'], `file${i}.png`, { type: 'image/png' })]);
            const req = httpMock.expectOne(instance.action as string);
            req.flush({});
          }

          expect(instance.fileList.length).toBe(5);
        });

        it('should only accept positive values for nzMaxCount', () => {
          // Test with positive value (should limit)
          instance.maxCount = 2;
          instance.fileList = [];
          fixture.detectChanges();

          // Upload first file
          pageObject.postSmall();
          let req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(1);

          // Upload second file
          pageObject.postFile([new File(['content'], 'second.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(2);

          // Upload third file - should not be added due to limit
          pageObject.postFile([new File(['content'], 'third.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(2); // Still 2, not 3
        });

        it('should handle edge cases for nzMaxCount', () => {
          // Test with 0 (should behave like undefined - no limit)
          instance.maxCount = 0;
          instance.fileList = [];
          fixture.detectChanges();

          pageObject.postSmall();
          let req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(1);

          // Add another file to confirm no limit with 0
          pageObject.postFile([new File(['content'], 'second.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(2);

          // Test with negative value (should behave like undefined - no limit)
          instance.maxCount = -1;
          fixture.detectChanges();

          pageObject.postFile([new File(['content'], 'third.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(3);
        });

        it('should work with existing nzLimit when both are set', () => {
          instance.maxCount = 3;
          instance.limit = 2; // This should be overridden by nzMaxCount logic
          instance.multiple = true;
          fixture.detectChanges();

          // Upload files one by one to test the maxCount behavior
          pageObject.postSmall();
          let req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(1);

          pageObject.postFile([new File(['content'], 'second.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(2);

          pageObject.postFile([new File(['content'], 'third.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          expect(instance.fileList.length).toBe(3);

          // Fourth file - upload happens but file is not added to list due to max count
          pageObject.postFile([new File(['content'], 'fourth.png', { type: 'image/png' })]);
          req = httpMock.expectOne(instance.action as string);
          req.flush({});
          // File list should still be 3 because max count prevents adding more files
          expect(instance.fileList.length).toBe(3);
        });
      });
    });

    describe('CORS', () => {
      it('should be auto setting [X-Requested-With]', () => {
        pageObject.postSmall();
        const req = httpMock.expectOne(instance.action as string);
        expect(req.request.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
        req.flush({});
        httpMock.verify();
      });

      it('should be allow override [X-Requested-With]', () => {
        instance.headers = {
          'X-Requested-With': null
        };
        fixture.detectChanges();
        pageObject.postSmall();
        const req = httpMock.expectOne(instance.action as string);
        expect(req.request.headers.has('X-Requested-With')).toBe(false);
        req.flush({});
        httpMock.verify();
      });
    });

    describe('[test boundary]', () => {
      it('clean a not exists request', () => {
        instance.comp.uploadComp.reqs = {};
        instance.show = false;
        fixture.detectChanges();
        expect(true).toBe(true);
      });
    });

    class NzUploadPageObject {
      private files: TriSafeAny;

      constructor() {
        spyOn(this.btnComp, 'onClick').and.callFake(() =>
          this.btnComp.onChange({ target: { files: this.files } } as TriSafeAny)
        );
      }

      get btnEl(): DebugElement {
        return dl.query(By.directive(TriUploadBtnComponent));
      }

      get btnComp(): TriUploadBtnComponent {
        return this.btnEl.injector.get(TriUploadBtnComponent) as TriUploadBtnComponent;
      }

      getByCss(css: string): DebugElement {
        return dl.query(By.css(css));
      }

      postFile(files: TriSafeAny): this {
        this.files = Array.isArray(files) ? files : [files];
        this.btnEl.nativeElement.click();
        return this;
      }

      postSmall(): this {
        this.postFile(PNG_SMALL.target.files);
        return this;
      }

      postLarge(): this {
        this.postFile(PNG_BIG.target.files);
        return this;
      }

      expectChange(type: string = 'start'): this {
        expect(instance._nzChange.type).toBe(type);
        return this;
      }

      expectLength(value: number = 0): this {
        expect(instance.fileList!.length).toBe(value);
        return this;
      }
    }
  });

  describe('list', () => {
    let fixture: ComponentFixture<TestUploadListComponent>;
    let dl: DebugElement;
    let instance: TestUploadListComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        // todo: use zoneless
        providers: [provideZoneChangeDetection(), provideNzIconsTesting(), provideNoopAnimations()]
      });
      fixture = TestBed.createComponent(TestUploadListComponent);
      dl = fixture.debugElement;
      instance = dl.componentInstance;
      fixture.detectChanges();
    });

    describe('[listType]', () => {
      for (const type of ['text', 'picture', 'picture-card']) {
        it(`with [${type}]`, () => {
          instance.listType = type as TriUploadListType;
          fixture.detectChanges();
          expect(dl.query(By.css(`.ant-upload-list-${type}`)) != null).toBe(true);
        });
      }
    });

    it('[items]', () => {
      expect(dl.queryAll(By.css(`.ant-upload-list-item`)).length).toBe(instance.items.length);
    });

    describe('[icons]', () => {
      it('should be show preview', () => {
        expect(instance._onPreview).toBe(false);
        const actions = dl.queryAll(By.css('.ant-upload-list-item-actions'));
        expect(actions.length).toBe(instance.items.length);
        actions[0].query(By.css('a')).nativeElement.click();
        fixture.detectChanges();
        expect(instance._onPreview).toBe(true);
      });

      it('should be hide preview', () => {
        instance.icons = {
          showPreviewIcon: false,
          showRemoveIcon: true
        };
        fixture.detectChanges();
        const actions = dl.queryAll(By.css('.ant-upload-list-item-actions a'));
        expect(actions.length).toBe(0);
        expect(instance._onPreview).toBe(false);
      });

      it('should be show remove', () => {
        expect(instance._onRemove).toBe(false);
        const actions = dl.queryAll(By.css('.ant-upload-list-item-actions'));
        expect(actions.length).toBe(instance.items.length);
        actions[0].query(By.css('.anticon-delete')).nativeElement.click();
        fixture.detectChanges();
        expect(instance._onRemove).toBe(true);
      });

      it('should be hide remove', () => {
        instance.icons = {
          showPreviewIcon: true,
          showRemoveIcon: false
        };
        fixture.detectChanges();
        const actions = dl.queryAll(By.css('.ant-upload-list-item-actions .anticon-delete'));
        expect(actions.length).toBe(0);
        expect(instance._onRemove).toBe(false);
      });
    });

    describe('[onPreview]', () => {
      it('should be handle preview', () => {
        expect(instance._onPreview).toBe(false);
        dl.query(By.css('.ant-upload-list-item-actions a')).nativeElement.click();
        expect(instance._onPreview).toBe(true);
      });

      it('should be invalid handle preview when is a null', () => {
        expect(instance._onPreview).toBe(false);
        instance.onPreview = undefined;
        fixture.detectChanges();
        dl.query(By.css('.ant-upload-list-item-actions a')).nativeElement.click();
        expect(instance._onPreview).toBe(false);
      });

      it('should support linkProps as object', fakeAsync(() => {
        instance.items = [
          {
            uid: '-1',
            name: 'foo.png',
            status: 'done',
            url: 'http://www.baidu.com/xxx.png',
            linkProps: {
              download: 'image'
            }
          }
        ];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        const el = dl.query(By.css('.ant-upload-list-item-name')).nativeElement as HTMLElement;
        expect(el.attributes.getNamedItem('download')!.textContent).toBe('image');
      }));

      it('should support linkProps as json stringify', fakeAsync(() => {
        const linkPropsString = JSON.stringify({ download: 'image' });
        instance.items = [
          {
            uid: '-1',
            name: 'foo.png',
            status: 'done',
            url: 'http://www.baidu.com/xxx.png',
            linkProps: linkPropsString
          }
        ];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        const el = dl.query(By.css('.ant-upload-list-item-name')).nativeElement as HTMLElement;
        expect(el.attributes.getNamedItem('download')!.textContent).toBe('image');
      }));
    });

    describe('[onRemove]', () => {
      it('should be handle remove', () => {
        expect(instance._onRemove).toBe(false);
        dl.query(By.css('.ant-upload-list-item-actions .anticon-delete')).nativeElement.click();
        expect(instance._onRemove).toBe(true);
      });

      it('should be invalid handle remove when is a null', () => {
        expect(instance._onRemove).toBe(false);
        instance.onRemove = null;
        fixture.detectChanges();
        dl.query(By.css('.ant-upload-list-item-actions .anticon-delete')).nativeElement.click();
        expect(instance._onRemove).toBe(false);
      });
    });

    describe('[isImageUrl]', () => {
      describe('via image type', () => {
        it('should be true when file object type value is a valid image', () => {
          expect(instance.comp.isImageUrl({ type: 'image/' } as TriSafeAny)).toBe(true);
        });
      });

      describe('via thumbUrl or url', () => {
        it('should be false when not found url & thumbUrl', () => {
          expect(instance.comp.isImageUrl({} as TriSafeAny)).toBe(false);
        });

        describe('via extension', () => {
          it('with valid image extension', () => {
            expect(instance.comp.isImageUrl({ url: '1.svg' } as TriSafeAny)).toBe(true);
          });

          it('with invalid image extension', () => {
            expect(instance.comp.isImageUrl({ url: '1.pdf' } as TriSafeAny)).toBe(false);
          });
        });

        describe('when url is base64', () => {
          it('with valid image base64', () => {
            expect(instance.comp.isImageUrl({ url: 'data:image/png;base64,1' } as TriSafeAny)).toBe(true);
          });

          it('with invalid image base64', () => {
            expect(instance.comp.isImageUrl({ url: 'data:application/pdf;base64,1' } as TriSafeAny)).toBe(false);
          });
        });
      });

      it('#previewIsImage', fakeAsync(() => {
        instance.previewIsImage = () => true;
        instance.listType = 'picture';
        instance.items = [{}];
        fixture.detectChanges();
        tick();
        expect(instance.items[0].isImageUrl).toBe(true);
      }));
    });

    describe('[genThumb]', () => {
      class MockImage {
        width = 1;
        height = 2;

        addEventListener(_name: string, callback: VoidFunction): void {
          callback();
        }
        removeEventListener(): void {}

        set src(_: string) {}
      }

      it('should be generate thumb when is valid image data', fakeAsync(() => {
        spyOn(window as TriSafeAny, 'Image').and.returnValue(new MockImage());

        instance.listType = 'picture';
        instance.items = [{ originFileObj: new File([''], '1.png', { type: 'image/' }), thumbUrl: undefined }];
        fixture.detectChanges();
        tick();
        expect(instance.items[0].thumbUrl.length).toBeGreaterThan(1);
      }));

      it('should be generate thumb when width greater than height', fakeAsync(() => {
        const img = new MockImage();
        img.width = 2;
        img.height = 1;
        spyOn(window as TriSafeAny, 'Image').and.returnValue(img);

        instance.listType = 'picture';
        instance.items = [{ originFileObj: new File([''], '1.png', { type: 'image/' }), thumbUrl: undefined }];
        fixture.detectChanges();
        tick();
        expect(instance.items[0].thumbUrl.length).toBeGreaterThan(1);
      }));

      it('should be ignore thumb when is invalid image data', () => {
        instance.listType = 'picture';
        instance.items = [{ originFileObj: new File([''], '1.pdf', { type: 'pdf' }), thumbUrl: undefined }];
        fixture.detectChanges();
        expect(instance.items[0].thumbUrl).toBe('');
      });

      it('should be customize preview file', fakeAsync(() => {
        instance.previewFile = () => of('11');
        instance.listType = 'picture';
        instance.items = [{ originFileObj: new File([''], '1.png', { type: 'image/' }), thumbUrl: undefined }];
        fixture.detectChanges();
        tick();
        expect(instance.items[0].thumbUrl).toBe('11');
      }));
    });
  });

  describe('btn', () => {
    describe('component', () => {
      let fixture: ComponentFixture<TestUploadBtnComponent>;
      let dl: DebugElement;
      let instance: TestUploadBtnComponent;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            // todo: use zoneless
            provideZoneChangeDetection(),
            provideNzIconsTesting(),
            provideNoopAnimations(),
            provideHttpClient(withInterceptorsFromDi()),
            provideHttpClientTesting()
          ]
        });
        fixture = TestBed.createComponent(TestUploadBtnComponent);
        dl = fixture.debugElement;
        instance = dl.componentInstance;
        fixture.detectChanges();
      });

      describe('should trigger upload', () => {
        describe('change detection', () => {
          it('should not run change detection when the <input type=file> is being clicked', () => {
            const appRef = TestBed.inject(ApplicationRef);
            spyOn(appRef, 'tick');
            spyOn(instance.comp.file.nativeElement, 'click');
            expect(instance.comp.file.nativeElement.click).not.toHaveBeenCalled();
            fixture.debugElement.query(By.css('div')).nativeElement.click();
            // Caretaker note: previously click events on the `nz-upload-btn` elements did trigger
            // change detection since they were added via the `host` property.
            expect(appRef.tick).toHaveBeenCalledTimes(0);
            expect(instance.comp.file.nativeElement.click).toHaveBeenCalled();
          });
        });

        describe('via onClick', () => {
          it('', () => {
            spyOn(instance.comp.file.nativeElement, 'click');
            expect(instance.comp.file.nativeElement.click).not.toHaveBeenCalled();
            instance.comp.onClick();
            expect(instance.comp.file.nativeElement.click).toHaveBeenCalled();
          });

          it(', when nzOpenFileDialogOnClick is false', () => {
            instance.options.openFileDialogOnClick = false;
            spyOn(instance.comp.file.nativeElement, 'click');
            expect(instance.comp.file.nativeElement.click).not.toHaveBeenCalled();
            instance.comp.onClick();
            expect(instance.comp.file.nativeElement.click).not.toHaveBeenCalled();
          });
        });

        describe('via onKeyDown', () => {
          it('normal', () => {
            const appRef = TestBed.inject(ApplicationRef);
            spyOn(appRef, 'tick');
            spyOn(instance.comp, 'onClick');
            expect(instance.comp.onClick).not.toHaveBeenCalled();
            const uploadBtn = fixture.debugElement.query(By.css('div')).nativeElement;
            dispatchKeyboardEvent(uploadBtn, 'keydown', ENTER);
            expect(instance.comp.onClick).toHaveBeenCalled();
            expect(appRef.tick).toHaveBeenCalledTimes(0);
          });

          it('when expect Enter', () => {
            const appRef = TestBed.inject(ApplicationRef);
            spyOn(appRef, 'tick');
            spyOn(instance.comp, 'onClick');
            expect(instance.comp.onClick).not.toHaveBeenCalled();
            const uploadBtn = fixture.debugElement.query(By.css('div')).nativeElement;
            dispatchKeyboardEvent(uploadBtn, 'keydown', TAB);
            expect(instance.comp.onClick).not.toHaveBeenCalled();
            expect(appRef.tick).toHaveBeenCalledTimes(0);
          });
        });

        describe('via Drop', () => {
          it('normal', () => {
            spyOn(instance.comp, 'uploadFiles');
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
            instance.comp.onFileDrop({
              type: 'dragend',
              dataTransfer: { files: [FILE] },
              preventDefault: () => {}
            } as TriSafeAny);
            expect(instance.comp.uploadFiles).toHaveBeenCalled();
          });

          it('when dragover event', () => {
            spyOn(instance.comp, 'uploadFiles');
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
            instance.comp.onFileDrop({ type: 'dragover', preventDefault: () => {} } as TriSafeAny);
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
          });

          it('limit gif using resource type', () => {
            instance.options.accept = 'image/gif';
            fixture.detectChanges();
            spyOn(instance.comp, 'uploadFiles');
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
            instance.comp.onFileDrop({
              type: 'dragend',
              dataTransfer: { files: PNG_SMALL.target.files },
              preventDefault: () => {}
            } as TriSafeAny);
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
          });

          it('limit gif using file name', () => {
            instance.options.accept = '.gif';
            fixture.detectChanges();
            spyOn(instance.comp, 'uploadFiles');
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
            instance.comp.onFileDrop({
              type: 'dragend',
              dataTransfer: { files: PNG_SMALL.target.files },
              preventDefault: () => {}
            } as TriSafeAny);
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
          });

          it('allow type image/*', () => {
            instance.options.accept = 'image/*';
            fixture.detectChanges();
            spyOn(instance.comp, 'uploadFiles');
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
            instance.comp.onFileDrop({
              type: 'dragend',
              dataTransfer: { files: PNG_SMALL.target.files },
              preventDefault: () => {}
            } as TriSafeAny);
            expect(instance.comp.uploadFiles).toHaveBeenCalled();
          });

          it(`allow type [ 'image/png', 'image/jpg' ]`, () => {
            instance.options.accept = ['image/png', 'image/jpg'];
            fixture.detectChanges();
            spyOn(instance.comp, 'uploadFiles');
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
            instance.comp.onFileDrop({
              type: 'dragend',
              dataTransfer: { files: PNG_SMALL.target.files },
              preventDefault: () => {}
            } as TriSafeAny);
            expect(instance.comp.uploadFiles).toHaveBeenCalled();
          });
        });

        it('via onChange', () => {
          spyOn(instance.comp, 'uploadFiles');
          expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
          instance.comp.onChange(PNG_SMALL as TriSafeAny);
          expect(instance.comp.uploadFiles).toHaveBeenCalled();
        });

        describe('via directory', () => {
          const makeFileSystemEntry = (item: Item): FileSystemEntry => {
            const isDirectory = Array.isArray(item.children);
            return {
              isDirectory,
              isFile: !isDirectory,
              file: (handle: TriSafeAny): void => {
                handle(new Item(item.name));
              },
              createReader: () => ({
                readEntries: (handle: TriSafeAny) => handle(item.children!.map(makeFileSystemEntry))
              })
            } as unknown as FileSystemEntry;
          };
          const makeDataTransferItem = (item: Item): DataTransferItem =>
            ({
              webkitGetAsEntry: () => makeFileSystemEntry(item)
            }) as DataTransferItem;

          beforeEach(() => (instance.options.directory = true));

          it('should working', () => {
            spyOn(instance.comp, 'uploadFiles');
            const files = {
              name: 'foo',
              children: [
                {
                  name: 'bar',
                  children: [
                    {
                      name: 'is.webp'
                    }
                  ]
                }
              ]
            };
            instance.comp.onFileDrop({
              type: 'dragend',
              dataTransfer: {
                items: [makeDataTransferItem(files)]
              },
              preventDefault: () => {}
            } as TriSafeAny);
            expect(instance.comp.uploadFiles).toHaveBeenCalled();
          });

          it('should be ignore invalid extension', () => {
            instance.options.accept = ['.webp'];
            spyOn(instance.comp, 'uploadFiles');
            const files = {
              name: 'foo',
              children: [
                {
                  name: 'is.jpg'
                }
              ]
            };
            instance.comp.onFileDrop({
              type: 'dragend',
              dataTransfer: {
                items: [makeDataTransferItem(files)]
              },
              preventDefault: () => {}
            } as TriSafeAny);
            expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
          });
        });
      });

      describe('should be disabled upload', () => {
        beforeEach(() => {
          instance.options.disabled = true;
          fixture.detectChanges();
        });

        it('[onClick]', () => {
          spyOn<TriSafeAny>(instance.comp, 'file');
          expect(instance.comp.file).not.toHaveBeenCalled();
          instance.comp.onClick();
          expect(instance.comp.file).not.toHaveBeenCalled();
        });

        it('[onKeyDown]', () => {
          spyOn(instance.comp, 'onClick');
          expect(instance.comp.onClick).not.toHaveBeenCalled();
          // instance.comp.onKeyDown(null);
          // expect(instance.comp.onClick).not.toHaveBeenCalled();
        });

        it('[onFileDrop]', () => {
          spyOn(instance.comp, 'uploadFiles');
          expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
          instance.comp.onFileDrop({ type: 'dragover', preventDefault: () => {} } as TriSafeAny);
          expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
        });

        it('[onChange]', () => {
          spyOn(instance.comp, 'uploadFiles');
          expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
          // instance.comp.onChange(null);
          // expect(instance.comp.uploadFiles).not.toHaveBeenCalled();
        });
      });

      describe('when has destroy', () => {
        it('should be abort all uploading file', () => {
          instance.comp.onChange({
            target: {
              files: [...PNG_SMALL.target.files, ...JPG_SMALL.target.files]
            }
          } as TriSafeAny);
          expect(Object.keys(instance.comp.reqs).length).toBe(2);
          fixture.destroy();
          expect(Object.keys(instance.comp.reqs).length).toBe(0);
        });

        it('should be subsequent uploading', () => {
          instance.comp.onChange(PNG_SMALL as TriSafeAny);
          expect(Object.keys(instance.comp.reqs).length).toBe(1);
          fixture.destroy();
          instance.comp.onChange(PNG_SMALL as TriSafeAny);
          expect(Object.keys(instance.comp.reqs).length).toBe(0);
        });
      });
    });

    describe('methods', () => {
      let fixture: ComponentFixture<TriUploadBtnComponent>;
      let comp: TriUploadBtnComponent;
      let http: HttpTestingController;

      beforeEach(() => {
        TestBed.configureTestingModule({
          // todo: use zoneless
          providers: [
            provideZoneChangeDetection(),
            provideHttpClient(withInterceptorsFromDi()),
            provideHttpClientTesting()
          ]
        });
        fixture = TestBed.createComponent(TriUploadBtnComponent);
        comp = fixture.debugElement.componentInstance;
        comp.options = {
          action: '/test',
          accept: 'image/png',
          filters: [],
          data: { a: 1 },
          headers: { token: 'asdf' },
          name: 'avatar',
          multiple: true,
          withCredentials: true,
          beforeUpload: () => true,
          onStart: () => {},
          onProgress: () => {},
          onSuccess: () => {},
          onError: () => {}
        } as ZipButtonOptions;
        http = TestBed.inject(HttpTestingController);
      });

      it('should uploading a png file', fakeAsync(() => {
        spyOn<TriSafeAny>(comp.options, 'onStart');
        spyOn<TriSafeAny>(comp.options, 'onProgress');
        spyOn<TriSafeAny>(comp.options, 'onSuccess');
        comp.onChange(PNG_SMALL as TriSafeAny);
        tick(1);
        const req = http.expectOne('/test');
        req.event({ type: 1, loaded: 10, total: 100 });
        req.flush('ok');
        expect(comp.options.onProgress).toHaveBeenCalled();
        expect(comp.options.onStart).toHaveBeenCalled();
        expect(comp.options.onSuccess).toHaveBeenCalled();
      }));

      it('should contain the parameters of http request', fakeAsync(() => {
        comp.onChange(PNG_SMALL as TriSafeAny);
        tick(1);
        const req = http.expectOne('/test');
        expect(req.request.withCredentials).toBe(true);
        expect(req.request.headers.get('token')).toBe('asdf');
        const body = req.request.body as FormData;
        expect(body.has('avatar')).toBe(true);
        expect(body.has('a')).toBe(true);
        req.flush('ok');
      }));

      it('should filter size', () => {
        spyOn<TriSafeAny>(comp.options, 'onStart');
        comp.options.filters = [
          {
            name: '',
            fn: (fileList: TriUploadFile[]) => fileList.filter(w => w.size! / 1024 <= 0)
          }
        ];
        comp.onChange(PNG_BIG as TriSafeAny);
        expect(comp.options.onStart).not.toHaveBeenCalled();
      });

      it('should be no request when beforeUpload is false', () => {
        spyOn<TriSafeAny>(comp.options, 'beforeUpload').and.returnValue(false);
        spyOn<TriSafeAny>(comp.options, 'onStart');
        comp.onChange(PNG_SMALL as TriSafeAny);
        expect(comp.options.beforeUpload).toHaveBeenCalled();
        expect(comp.options.onStart).not.toHaveBeenCalled();
      });

      it('should handle promise-based beforeUpload that resolves to true', fakeAsync(() => {
        spyOn<TriSafeAny>(comp.options, 'onStart');
        comp.options.beforeUpload = (): Promise<boolean> => Promise.resolve(true);
        comp.onChange(PNG_SMALL as TriSafeAny);
        tick();
        const req = http.expectOne('/test');
        expect(comp.options.onStart).toHaveBeenCalled();
        req.flush('ok');
      }));

      it('should not start upload when promise-based beforeUpload resolves to false', fakeAsync(() => {
        spyOn<TriSafeAny>(comp.options, 'onStart');
        comp.options.beforeUpload = (): Promise<boolean> => Promise.resolve(false);
        comp.onChange(PNG_SMALL as TriSafeAny);
        tick();
        expect(comp.options.onStart).not.toHaveBeenCalled();
        http.expectNone('/test');
      }));

      it('should handle promise-based beforeUpload with file transformation', fakeAsync(() => {
        spyOn<TriSafeAny>(comp.options, 'onStart');
        const baseFile = new File(['modified'], 'modified.txt', { type: 'text/plain' });
        const transformedFile: TriUploadFile = {
          ...baseFile,
          uid: 'test-uid',
          name: baseFile.name,
          size: baseFile.size,
          type: baseFile.type,
          lastModified: baseFile.lastModified.toString(),
          originFileObj: baseFile
        };
        comp.options.beforeUpload = (): Promise<TriUploadFile> => Promise.resolve(transformedFile);
        comp.onChange(PNG_SMALL as TriSafeAny);
        tick();
        const req = http.expectOne('/test');
        expect(comp.options.onStart).toHaveBeenCalled();
        req.flush('ok');
      }));

      it('should handle promise rejection in beforeUpload', fakeAsync(() => {
        let warnMsg = '';
        console.warn = jasmine.createSpy().and.callFake((...res: string[]) => (warnMsg = res.join(' ')));
        spyOn<TriSafeAny>(comp.options, 'onStart');
        comp.options.beforeUpload = (): Promise<boolean> => Promise.reject(new Error('Validation failed'));
        comp.onChange(PNG_SMALL as TriSafeAny);
        tick();
        expect(comp.options.onStart).not.toHaveBeenCalled();
        expect(warnMsg).toContain('Unhandled upload beforeUpload error');
        http.expectNone('/test');
      }));

      it('should error when request error', fakeAsync(() => {
        spyOn<TriSafeAny>(comp.options, 'onStart');
        spyOn<TriSafeAny>(comp.options, 'onSuccess');
        spyOn<TriSafeAny>(comp.options, 'onError');
        comp.onChange(PNG_SMALL as TriSafeAny);
        tick(1);
        http.expectOne('/test').error({ status: 403 } as unknown as ProgressEvent);
        expect(comp.options.onStart).toHaveBeenCalled();
        expect(comp.options.onError).toHaveBeenCalled();
        expect(comp.options.onSuccess).not.toHaveBeenCalled();
      }));

      it('should custom request', () => {
        comp.options.customRequest = () => of(true).subscribe(() => {});
        spyOn<TriSafeAny>(comp.options, 'customRequest');
        comp.onChange(PNG_SMALL as TriSafeAny);
        expect(comp.options.customRequest).toHaveBeenCalled();
      });

      it('should be warn "Must return Subscription type in [nzCustomRequest] property"', () => {
        let warnMsg = '';
        console.warn = jasmine.createSpy().and.callFake((...res: string[]) => (warnMsg = res.join(' ')));
        comp.options.customRequest = (() => {}) as TriSafeAny;
        comp.onChange(PNG_SMALL as TriSafeAny);
        expect(warnMsg).toContain(`Must return Subscription type in '[nzCustomRequest]' property`);
      });
    });
  });
});

@Component({
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    @if (show) {
      <tri-upload
        #upload
        [type]="type"
        [limit]="limit"
        [size]="size"
        [fileType]="fileType"
        [accept]="accept"
        [action]="action"
        [beforeUpload]="beforeUpload"
        [customRequest]="customRequest"
        [data]="data"
        [filter]="filter"
        [(fileListChange)]="fileList"
        [disabled]="disabled"
        [headers]="headers"
        [listType]="listType"
        [multiple]="multiple"
        [name]="name"
        [showUploadList]="showUploadList"
        [showButton]="showButton"
        [withCredentials]="withCredentials"
        [preview]="onPreview"
        [previewFile]="previewFile"
        [remove]="onRemove"
        [directory]="directory"
        [transformFile]="transformFile"
        [iconRender]="iconRender"
        [fileListRender]="fileListRender"
        [maxCount]="maxCount"
        (fileListChange)="fileListChange($event)"
        (change)="change($event)"
      >
        <button tri-button>
          <tri-icon type="upload" />
          <span>Click to Upload</span>
        </button>
      </tri-upload>
    }
    <ng-template #customIconRender>
      <span class="customIconRender">asdf</span>
    </ng-template>
    <ng-template #fileListRender>
      <span class="fileListRender">asdf</span>
    </ng-template>
  `
})
class TestUploadComponent {
  @ViewChild('upload', { static: false }) comp!: TriUploadComponent;
  @ViewChild('customIconRender', { static: false }) customIconRender!: TriIconRenderTemplate;
  @ViewChild('fileListRender', { static: false }) _fileListRender!: TemplateRef<{ $implicit: TriUploadFile[] }>;
  show = true;
  type: TriUploadType = 'select';
  limit = 0;
  size = 0;
  fileType: TriSafeAny;
  accept = 'image/png';
  action: string | ((file: TriUploadFile) => string | Observable<string>) = '/upload';
  _beforeUpload = false;
  _beforeUploadList: TriUploadFile[] = [];
  beforeUpload: TriSafeAny = (_file: TriUploadFile, fileList: TriUploadFile[]): TriSafeAny => {
    this._beforeUpload = true;
    this._beforeUploadList = fileList;
    return true;
  };
  customRequest: TriSafeAny;
  data: TriSafeAny;
  filter: UploadFilter[] = [];
  fileList: TriUploadFile[] = [];
  disabled = false;
  headers: TriSafeAny = {};
  listType: TriUploadListType = 'text';
  multiple = false;
  name = 'file';
  showUploadList: boolean | TriShowUploadList = true;
  showButton = true;
  withCredentials = false;
  transformFile!: (file: TriUploadFile) => TriUploadTransformFileType;
  iconRender: TriIconRenderTemplate | null = null;
  fileListRender: TemplateRef<{ $implicit: TriUploadFile[] }> | null = null;
  maxCount: number | undefined = undefined;
  _onPreview = false;
  onPreview = (): void => {
    this._onPreview = true;
  };
  previewFile!: (file: TriUploadFile) => Observable<string>;
  _onRemove = false;
  onRemove: undefined | ((file: TriUploadFile) => boolean | Observable<boolean>) = (): boolean => {
    this._onRemove = true;
    return true;
  };
  _nzChange!: TriUploadChangeParam;

  change(value: TriUploadChangeParam): void {
    this._nzChange = value;
  }

  fileListChange(value: TriSafeAny): void {
    this._nzChange = value;
  }

  directory = false;
}

@Component({
  imports: [TriUploadListComponent],
  template: `
    <tri-upload-list
      #list
      [listType]="listType"
      [items]="items"
      [icons]="icons"
      [onPreview]="onPreview"
      [previewFile]="previewFile"
      [previewIsImage]="previewIsImage"
      [onRemove]="onRemove"
    ></tri-upload-list>
  `
})
class TestUploadListComponent {
  @ViewChild('list', { static: false }) comp!: TriUploadListComponent;
  listType: TriUploadListType = 'picture-card';
  items: TriSafeAny[] = [
    {
      uid: 1,
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    },
    {
      uid: 2,
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png'
    },
    {
      uid: 3,
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png'
    }
  ];
  icons: TriShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true
  };
  _onPreview = false;
  onPreview: VoidFunction | undefined = (): void => {
    this._onPreview = true;
  };
  previewFile!: (file: TriUploadFile) => Observable<string>;
  previewIsImage!: (file: TriUploadFile) => boolean;
  _onRemove = false;
  onRemove: TriSafeAny = (): void => {
    this._onRemove = true;
  };
}

@Component({
  imports: [TriUploadBtnComponent],
  template: `<div tri-upload-btn #btn [options]="options" class="test">UPLOAD</div>`
})
class TestUploadBtnComponent {
  @ViewChild('btn', { static: false }) comp!: TriUploadBtnComponent;
  options: ZipButtonOptions = {
    disabled: false,
    openFileDialogOnClick: true,
    filters: [],
    customRequest: undefined,
    onStart: () => {},
    onError: () => {}
  };
}
