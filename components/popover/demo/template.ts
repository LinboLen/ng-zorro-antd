import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriPopoverModule],
  template: `
    <button tri-button tri-popover [popoverTitle]="titleTemplate" [popoverContent]="contentTemplate">
      Render Template
    </button>
    <ng-template #titleTemplate>
      <tri-icon type="close" />
      Title
    </ng-template>
    <ng-template #contentTemplate>
      <tri-icon type="check" />
      Content
    </ng-template>
  `
})
export class TriDemoPopoverTemplateComponent {}
