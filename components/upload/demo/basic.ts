import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriUploadChangeParam, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-basic',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      [headers]="{ authorization: 'authorization-text' }"
      (change)="handleChange($event)"
    >
      <button tri-button>
        <tri-icon type="upload" />
        Click to Upload
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadBasicComponent {
  constructor(private messageService: TriMessageService) {}

  handleChange(info: TriUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.messageService.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }
}
