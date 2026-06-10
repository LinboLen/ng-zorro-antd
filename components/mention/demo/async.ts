import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { MentionOnSearchTypes, TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'tri-demo-mention-async',
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions()" [loading]="loading()" (onSearchChange)="onSearchChange($event)">
      <textarea rows="1" mentionTrigger tri-input [(ngModel)]="inputValue"></textarea>
    </tri-mention>
  `
})
export class TriDemoMentionAsyncComponent {
  readonly inputValue = signal('');
  readonly loading = signal(false);
  readonly suggestions = signal<string[]>([]);

  onSearchChange({ value }: MentionOnSearchTypes): void {
    console.log(`search: ${value}`);
    this.loading.set(true);
    this.fetchSuggestions(value, suggestions => {
      console.log(suggestions);
      this.suggestions.set(suggestions);
      this.loading.set(false);
    });
  }

  fetchSuggestions(value: string, callback: (suggestions: string[]) => void): void {
    const users = ['afc163', 'benjycui', 'yiminghe', 'jljsj33', 'dqaria', 'RaoHai'];
    setTimeout(() => callback(users.filter(item => item.indexOf(value) !== -1)), 500);
  }
}
