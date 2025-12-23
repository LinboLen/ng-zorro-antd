import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-picture-style',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
      [(fileListChange)]="fileList"
    >
      <button tri-button>
        <tri-icon type="upload" />
        Upload
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadPictureStyleComponent {
  fileList: TriUploadFile[] = [
    {
      uid: '0',
      name: 'xxx.png',
      status: 'uploading',
      percent: 33
    },
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'zzz.png',
      status: 'error'
    }
  ];
}
