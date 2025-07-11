import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'tri-demo-popover-basic',
  imports: [TriButtonModule, TriPopoverModule],
  template: `
    <button tri-button tri-popover type="primary" popoverTitle="Title" popoverContent="Content">Hover me</button>
  `
})
export class TriDemoPopoverBasicComponent {}
