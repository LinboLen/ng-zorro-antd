import { Component, inject } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriUploadModule, type TriUploadChangeParam } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-max-count',
  imports: [TriUploadModule, TriButtonModule, TriFlexModule],
  template: `
    <div tri-flex vertical gap="2rem">
      <tri-upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        [headers]="{ authorization: 'authorization-text' }"
        [maxCount]="1"
        (change)="handleChange($event)"
      >
        <button tri-button>Upload (Max: 1)</button>
      </tri-upload>
      <tri-upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        [headers]="{ authorization: 'authorization-text' }"
        [maxCount]="3"
        (change)="handleChange($event)"
      >
        <button tri-button>Upload (Max: 3)</button>
      </tri-upload>
    </div>
  `
})
export class TriDemoUploadMaxCountComponent {
  readonly #messageService = inject(TriMessageService);
  handleChange(info: TriUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.#messageService.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.#messageService.error(`${info.file.name} file upload failed.`);
    }
  }
}
