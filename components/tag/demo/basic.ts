import { Component } from '@angular/core';

import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: '',
  imports: [TriTagModule],
  template: `
    <tri-tag>Tag 1</tri-tag>
    <tri-tag>
      <a href="https://github.com/NG-ZORRO/ng-zorro-antd">Link</a>
    </tri-tag>
    <tri-tag mode="closeable" (onClose)="onClose()">Tag 2</tri-tag>
    <tri-tag mode="closeable" (onClose)="preventDefault($event)">Prevent Default</tri-tag>
  `
})
export class TriDemoTagBasicComponent {
  onClose(): void {
    console.log('tag was closed.');
  }

  preventDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    console.log('tag can not be closed.');
  }
}
