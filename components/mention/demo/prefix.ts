import { Component, signal } from '@angular/core';

import { TriInputModule } from 'ng-zorro-antd/input';
import { MentionOnSearchTypes, TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-prefix',
  imports: [TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions()" (onSearchChange)="onSearchChange($event)" [prefix]="['#', '@']">
      <textarea rows="1" placeholder="input @ to mention people, # to mention tag" mentionTrigger tri-input></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionPrefixComponent {
  readonly suggestions = signal<string[]>([]);
  readonly users = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
  readonly tags = ['1.0', '2.0', '3.0'];

  onSearchChange({ value, prefix }: MentionOnSearchTypes): void {
    console.log('nzOnSearchChange', value, prefix);
    this.suggestions.set(prefix === '@' ? this.users : this.tags);
  }
}
