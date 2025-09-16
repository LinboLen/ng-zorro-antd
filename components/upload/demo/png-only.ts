import { Component, inject } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriUploadModule, type TriUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-png-only',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload [beforeUpload]="beforeUpload">
      <button tri-button>
        <tri-icon type="upload" />
        Upload only png
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadPngOnlyComponent {
  readonly #messageService = inject(TriMessageService);
  beforeUpload = (file: TriUploadFile): boolean => {
    const isPng = file.type === 'image/png';
    if (!isPng) {
      this.#messageService.error('You can only upload png file!');
    }
    return isPng;
  };
}
