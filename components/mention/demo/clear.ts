import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-clear',
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions" (onSelect)="onSelect($event)" allowClear (onClear)="onClear()">
      <textarea rows="1" placeholder="input here" mentionTrigger tri-input [(ngModel)]="inputValue"></textarea>
    </tri-mention>
    <br />
    <br />
    <tri-mention [suggestions]="suggestions" (onSelect)="onSelect($event)" allowClear (onClear)="onClear()">
      <textarea rows="3" placeholder="input here" mentionTrigger tri-input [(ngModel)]="inputValue"></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionClearComponent {
  inputValue = model('@afc163');
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

  onSelect(e: string): void {
    console.log(e);
  }

  onClear(): void {
    console.log('onClear');
  }
}
