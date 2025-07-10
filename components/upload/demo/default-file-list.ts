import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" [fileList]="fileList">
      <button tri-button>
        <tri-icon type="upload" />
        Upload
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadDefaultFileListComponent {
  fileList: TriUploadFile[] = [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png'
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png'
    }
  ];
}
