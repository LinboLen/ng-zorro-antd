import { Component } from '@angular/core';
import { concatMap } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tri-demo-message-close',
  imports: [TriButtonModule],
  template: `<button tri-button type="default" (click)="startShowMessages()">Display a sequence of messages</button>`
})
export class TriDemoMessageCloseComponent {
  constructor(private message: TriMessageService) {}

  startShowMessages(): void {
    this.message
      .loading('Action in progress', { nzDuration: 2500 })
      .onClose!.pipe(
        concatMap(() => this.message.success('Loading finished', { nzDuration: 2500 }).onClose!),
        concatMap(() => this.message.info('Loading finished is finished', { nzDuration: 2500 }).onClose!)
      )
      .subscribe(() => {
        console.log('All completed!');
      });
  }
}
