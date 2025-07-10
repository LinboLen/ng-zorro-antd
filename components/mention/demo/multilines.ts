import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions">
      <textarea tri-input [autosize]="{ minRows: 4, maxRows: 4 }" [(ngModel)]="inputValue" mentionTrigger></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionMultilinesComponent {
  inputValue?: string;
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
}
