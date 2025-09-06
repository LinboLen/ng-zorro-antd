import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-auto-size',
  imports: [FormsModule, TriMentionModule, TriInputModule, CdkTextareaAutosize],
  template: `
    <tri-mention [suggestions]="suggestions" (onSelect)="onSelect($event)">
      <textarea
        tri-input
        placeholder="input here"
        mentionTrigger
        [(ngModel)]="inputValue"
        cdkTextareaAutosize
      ></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionAutoSizeComponent {
  readonly inputValue = model('@afc163');
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

  onSelect(suggestion: string): void {
    console.log(`onSelect ${suggestion}`);
  }
}
