import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-tag-control',
  imports: [FormsModule, TriIconModule, TriInputModule, TriTagModule, TriNoAnimationDirective],
  template: `
    @for (tag of tags(); track tag) {
      <tri-tag [mode]="$first ? 'default' : 'closeable'" (onClose)="handleClose(tag)">
        {{ sliceTagName(tag) }}
      </tri-tag>
    }

    @if (!inputVisible()) {
      <tri-tag class="editable-tag" noAnimation (click)="showInput()">
        <tri-icon type="plus" />
        New Tag
      </tri-tag>
    } @else {
      <input
        #inputElement
        tri-input
        size="small"
        type="text"
        [ngModel]="inputValue()"
        (ngModelChange)="inputValue.set($event)"
        style="width: 78px;"
        (blur)="handleInputConfirm()"
        (keydown.enter)="handleInputConfirm()"
      />
    }
  `,
  styles: `
    .editable-tag {
      background: rgb(255, 255, 255);
      border-style: dashed;
    }
  `
})
export class TriDemoTagControlComponent {
  readonly tags = signal(['Unremovable', 'Tag 2', 'Tag 3']);
  readonly inputVisible = signal(false);
  readonly inputValue = signal('');
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  handleClose(removedTag: string): void {
    this.tags.update(tags => tags.filter(tag => tag !== removedTag));
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible.set(true);
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    const inputValue = this.inputValue();
    if (inputValue && this.tags().indexOf(inputValue) === -1) {
      this.tags.update(tags => [...tags, inputValue]);
    }
    this.inputValue.set('');
    this.inputVisible.set(false);
  }
}
