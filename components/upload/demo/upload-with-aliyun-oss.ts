import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadChangeParam, TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload
      name="file"
      [(fileListChange)]="files"
      [transformFile]="transformFile"
      [data]="getExtraData"
      [action]="mockOSSData.host"
      (change)="onChange($event)"
    >
      Photos:
      <button tri-button>
        <tri-icon type="upload" />
        Click to Upload
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadUploadWithAliyunOssComponent {
  files: TriUploadFile[] = [];
  mockOSSData = {
    dir: 'user-dir/',
    expire: '1577811661',
    host: '//www.mocky.io/v2/5cc8019d300000980a055e76',
    accessId: 'c2hhb2RhaG9uZw==',
    policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
    signature: 'ZGFob25nc2hhbw=='
  };

  transformFile = (file: TriUploadFile): TriUploadFile => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = this.mockOSSData.dir + filename;
    return file;
  };

  getExtraData = (file: TriUploadFile): {} => {
    const { accessId, policy, signature } = this.mockOSSData;

    return {
      key: file.url,
      OSSAccessKeyId: accessId,
      policy,
      Signature: signature
    };
  };

  onChange(e: TriUploadChangeParam): void {
    console.log('Aliyun OSS:', e.fileList);
  }
}
