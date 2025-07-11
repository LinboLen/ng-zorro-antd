import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-upload-manually',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload [(fileListChange)]="fileList" [beforeUpload]="beforeUpload">
      <button tri-button>
        <tri-icon type="upload" />
        Select File
      </button>
    </tri-upload>
    <br />
    <br />
    <button
      tri-button
      type="primary"
      [loading]="uploading"
      (click)="handleUpload()"
      [disabled]="fileList.length === 0"
    >
      {{ uploading ? 'Uploading' : 'Start Upload' }}
    </button>
  `
})
export class TriDemoUploadUploadManuallyComponent {
  uploading = false;
  fileList: TriUploadFile[] = [];

  constructor(
    private http: HttpClient,
    private messageService: TriMessageService
  ) {}

  beforeUpload = (file: TriUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe({
        next: () => {
          this.uploading = false;
          this.fileList = [];
          this.messageService.success('upload successfully.');
        },
        error: () => {
          this.uploading = false;
          this.messageService.error('upload failed.');
        }
      });
  }
}
