import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule, TriMentionModule, TriTabsModule],
  template: `
    <tri-tabs>
      <tri-tab title="Write">
        <tri-mention [suggestions]="suggestions">
          <textarea
            tri-input
            [autosize]="{ minRows: 4, maxRows: 4 }"
            [(ngModel)]="inputValue"
            (ngModelChange)="renderPreView()"
            mentionTrigger
          ></textarea>
        </tri-mention>
      </tri-tab>
      <tri-tab title="Preview">
        <pre [innerHTML]="preview"></pre>
      </tri-tab>
    </tri-tabs>
  `
})
export class TriDemoMentionPreviewComponent {
  inputValue: string = 'Switch tab view preview @NG-ZORRO ';
  preview?: SafeHtml;
  suggestions = ['NG-ZORRO', 'angular', 'Reactive-Extensions'];

  constructor(private sanitizer: DomSanitizer) {
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
    if (this.inputValue) {
      const regex = this.getRegExp('@');
      const previewValue = this.inputValue.replace(
        regex,
        match => `<a target="_blank" href="https://github.com/${match.trim().substring(1)}">${match}</a>`
      );
      this.preview = this.sanitizer.bypassSecurityTrustHtml(previewValue);
    }
  }
}
