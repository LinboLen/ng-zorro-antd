import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-mention-preview',
  imports: [FormsModule, TriInputModule, TriMentionModule, TriTabsModule, CdkTextareaAutosize],
  template: `
    <tri-tabs>
      <tri-tab title="Write">
        <tri-mention [suggestions]="suggestions">
          <textarea
            tri-input
            cdkTextareaAutosize
            cdkAutosizeMinRows="4"
            cdkAutosizeMaxRows="4"
            [(ngModel)]="inputValue"
            (ngModelChange)="renderPreView()"
            mentionTrigger
          ></textarea>
        </tri-mention>
      </tri-tab>
      <tri-tab title="Preview">
        <pre [innerHTML]="preview()"></pre>
      </tri-tab>
    </tri-tabs>
  `
})
export class TriDemoMentionPreviewComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly inputValue = signal('Switch tab view preview @NG-ZORRO ');
  readonly preview = signal<SafeHtml | undefined>(undefined);
  readonly suggestions = ['NG-ZORRO', 'angular', 'Reactive-Extensions'];

  constructor() {
    this.renderPreView();
  }

  getRegExp(prefix: string | string[]): RegExp {
    const prefixArray = Array.isArray(prefix) ? prefix : [prefix];
    let prefixToken = prefixArray.join('').replace(/(\$|\^)/g, '\\$1');

    if (prefixArray.length > 1) {
      prefixToken = `[${prefixToken}]`;
    }

    return new RegExp(`(\\s|^)(${prefixToken})[^\\s]*`, 'g');
  }

  renderPreView(): void {
    const inputValue = this.inputValue();
    if (inputValue) {
      const regex = this.getRegExp('@');
      const previewValue = inputValue.replace(
        regex,
        match => `<a target="_blank" href="https://github.com/${match.trim().substring(1)}">${match}</a>`
      );
      this.preview.set(this.sanitizer.bypassSecurityTrustHtml(previewValue));
    }
  }
}
