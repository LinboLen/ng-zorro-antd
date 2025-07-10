import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: '',
  imports: [TriButtonModule, TriPopoverModule],
  template: `
    <ng-template #contentTemplate>
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    </ng-template>
    <button tri-button tri-popover popoverTitle="Title" [popoverContent]="contentTemplate" popoverTrigger="click">
      Click me
    </button>
    <button tri-button tri-popover popoverTitle="Title" [popoverContent]="contentTemplate" popoverTrigger="hover">
      Hover me
    </button>
    <button tri-button tri-popover popoverTitle="Title" [popoverContent]="contentTemplate" popoverTrigger="focus">
      Focus me
    </button>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoPopoverTriggerTypeComponent {}
