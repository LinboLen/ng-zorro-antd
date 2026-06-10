import { Component } from '@angular/core';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-readonly',
  imports: [TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions" style="margin-bottom: 8px">
      <textarea rows="1" placeholder="this is disabled Mention" mentionTrigger tri-input disabled></textarea>
    </tri-mention>
    <tri-mention [suggestions]="suggestions">
      <textarea rows="1" placeholder="this is readOnly Mention" mentionTrigger tri-input readOnly></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionReadonlyComponent {
  readonly suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
}
