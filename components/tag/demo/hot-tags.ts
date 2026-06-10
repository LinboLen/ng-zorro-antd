import { Component, signal } from '@angular/core';

import { TriTagModule } from 'ng-zorro-antd/tag';

const tagsFromServer = ['Movie', 'Books', 'Music', 'Sports'];

@Component({
  selector: 'tri-demo-tag-hot-tags',
  imports: [TriTagModule],
  template: `
    <strong>Categories:</strong>
    @for (tag of hotTags; track $index) {
      <tri-tag
        mode="checkable"
        [checked]="selectedTags().indexOf(tag) > -1"
        (checkedChange)="handleChange($event, tag)"
      >
        {{ tag }}
      </tri-tag>
    }
  `
})
export class TriDemoTagHotTagsComponent {
  readonly hotTags = tagsFromServer;
  readonly selectedTags = signal<string[]>([]);

  handleChange(checked: boolean, tag: string): void {
    if (checked) {
      this.selectedTags.update(tags => [...tags, tag]);
    } else {
      this.selectedTags.update(tags => tags.filter(t => t !== tag));
    }
    console.log('You are interested in: ', this.selectedTags());
  }
}
