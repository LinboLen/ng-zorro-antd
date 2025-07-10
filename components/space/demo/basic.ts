import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriSpaceModule, TriPopconfirmModule, TriUploadModule],
  template: `
    <tri-space>
      <button *spaceItem tri-button type="primary">Button</button>
      <tri-upload *spaceItem action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
        <button tri-button>
          <tri-icon type="upload" />
          Click to Upload
        </button>
      </tri-upload>
      <button
        *spaceItem
        tri-button
        tri-popconfirm
        okText="Yes"
        cancelText="No"
        popconfirmTitle="Are you sure delete this task?"
      >
        Confirm
      </button>
    </tri-space>
  `
})
export class TriDemoSpaceBasicComponent {}
