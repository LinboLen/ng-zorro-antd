import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-status',
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions" status="error" style="margin-bottom: 8px;">
      <textarea rows="1" tri-input placeholder="input here" [(ngModel)]="inputValue" mentionTrigger></textarea>
    </tri-mention>
    <tri-mention [suggestions]="suggestions" status="warning">
      <textarea rows="1" tri-input placeholder="input here" [(ngModel)]="inputValue" mentionTrigger></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionStatusComponent {
  inputValue: string = '@afc163';
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
}
