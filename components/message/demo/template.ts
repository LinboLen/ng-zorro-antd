import { Component, TemplateRef, ViewChild } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageComponent, TriMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: '',
  imports: [TriButtonModule],
  template: `
    <button tri-button type="default" (click)="showMessage()">Display a custom template</button>
    <ng-template #customTemplate let-data="data">My Favorite Framework is {{ data }}</ng-template>
  `
})
export class TriDemoMessageTemplateComponent {
  @ViewChild('customTemplate', { static: true }) customTemplate!: TemplateRef<{
    $implicit: TriMessageComponent;
    data: string;
  }>;

  constructor(private message: TriMessageService) {}

  showMessage(): void {
    this.message.success(this.customTemplate, { nzData: 'Angular' });
  }
}
