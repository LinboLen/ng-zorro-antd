import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" directory>
      <button tri-button>
        <tri-icon type="upload" />
        Upload Directory
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadDirectoryComponent {}
