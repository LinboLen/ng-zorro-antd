import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-avatar',
  imports: [TriIconModule, TriUploadModule],
  template: `
    <tri-upload
      class="avatar-uploader"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      name="avatar"
      listType="picture-card"
      [showUploadList]="false"
      [beforeUpload]="beforeUpload"
      (change)="handleChange($event)"
    >
      @if (!avatarUrl) {
        <tri-icon class="upload-icon" [type]="loading ? 'loading' : 'plus'" />
        <div class="tri-upload-text">Upload</div>
      } @else {
        <img [src]="avatarUrl" style="width: 100%" />
      }
    </tri-upload>
  `,
  styles: `
    :host ::ng-deep .avatar-uploader > .ant-upload {
      width: 128px;
      height: 128px;
    }
  `
})
export class TriDemoUploadAvatarComponent {
  loading = false;
  avatarUrl?: string;

  constructor(private messageService: TriMessageService) {}

  beforeUpload = (file: TriUploadFile, _fileList: TriUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.messageService.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.messageService.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: TriUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.messageService.error('Network error');
        this.loading = false;
        break;
    }
  }
}
