import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: '',
  imports: [TriIconModule, TriTagModule],
  template: `
    <div>
      <h4>Without icon</h4>
      <tri-tag color="success">success</tri-tag>
      <tri-tag color="processing">processing</tri-tag>
      <tri-tag color="error">error</tri-tag>
      <tri-tag color="warning">warning</tri-tag>
      <tri-tag color="default">default</tri-tag>
    </div>
    <div>
      <h4>With icon</h4>
      <tri-tag color="success">
        <tri-icon type="check-circle" />
        <span>success</span>
      </tri-tag>
      <tri-tag color="processing">
        <tri-icon type="sync" spin />
        <span>processing</span>
      </tri-tag>
      <tri-tag color="error">
        <tri-icon type="close-circle" />
        <span>error</span>
      </tri-tag>
      <tri-tag color="warning">
        <tri-icon type="exclamation-circle" />
        <span>warning</span>
      </tri-tag>
      <tri-tag color="default">
        <tri-icon type="clock-circle" />
        <span>default</span>
      </tri-tag>
    </div>
  `
})
export class TriDemoTagStatusComponent {}
