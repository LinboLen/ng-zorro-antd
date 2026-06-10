import { Component } from '@angular/core';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-placement',
  imports: [TriInputModule, TriMentionModule],
  template: `
    <tri-mention placement="top" [suggestions]="suggestions" (onSelect)="onSelect($event)">
      <textarea rows="1" mentionTrigger tri-input></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionPlacementComponent {
  readonly suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

  onSelect(suggestion: string): void {
    console.log(`onSelect ${suggestion}`);
  }
}
