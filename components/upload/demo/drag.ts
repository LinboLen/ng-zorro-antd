import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriUploadChangeParam, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload
      type="drag"
      [multiple]="true"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      (change)="handleChange($event)"
    >
      <p class="tri-upload-drag-icon">
        <tri-icon type="inbox" />
      </p>
      <p class="tri-upload-text">Click or drag file to this area to upload</p>
      <p class="tri-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
      </p>
    </tri-upload>
  `
})
export class TriDemoUploadDragComponent {
  constructor(private messageService: TriMessageService) {}

  handleChange({ file, fileList }: TriUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.messageService.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.messageService.error(`${file.name} file upload failed.`);
    }
  }
}
