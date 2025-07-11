import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-readonly',
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions" style="margin-bottom: 8px">
      <textarea
        rows="1"
        placeholder="this is disabled Mention"
        mentionTrigger
        tri-input
        disabled
        [(ngModel)]="inputValue"
      ></textarea>
    </tri-mention>
    <tri-mention [suggestions]="suggestions">
      <textarea
        rows="1"
        placeholder="this is readOnly Mention"
        mentionTrigger
        tri-input
        readOnly
        [(ngModel)]="inputValue"
      ></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionReadonlyComponent {
  inputValue?: string;
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
}
