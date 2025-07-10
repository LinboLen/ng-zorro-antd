import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      listType="picture"
      [(fileListChange)]="fileList1"
    >
      <button tri-button>
        <tri-icon type="upload" />
        Upload
      </button>
    </tri-upload>
    <br />
    <br />
    <tri-upload
      class="upload-list-inline"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      listType="picture"
      [(fileListChange)]="fileList2"
    >
      <button tri-button>
        <span>
          <tri-icon type="upload" />
          Upload
        </span>
      </button>
    </tri-upload>
  `,
  styles: [
    `
      :host ::ng-deep .upload-list-inline .ant-upload-list-item {
        float: left;
        width: 200px;
        margin-right: 8px;
      }
      :host ::ng-deep .upload-list-inline [class*='-upload-list-rtl'] .ant-upload-list-item {
        float: right;
      }
      :host ::ng-deep .upload-list-inline .ant-upload-animate-enter {
        animation-name: uploadAnimateInlineIn;
      }
      :host ::ng-deep .upload-list-inline .ant-upload-animate-leave {
        animation-name: uploadAnimateInlineOut;
      }
    `
  ]
})
export class TriDemoUploadPictureStyleComponent {
  defaultFileList: TriUploadFile[] = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'error'
    }
  ];

  fileList1 = [...this.defaultFileList];
  fileList2 = [...this.defaultFileList];
}
