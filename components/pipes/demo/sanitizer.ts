import { Component } from '@angular/core';

import { TriSanitizerPipe } from 'ng-zorro-antd/pipes';

@Component({
  selector: 'tri-demo-pipes-sanitizer',
  imports: [TriSanitizerPipe],
  template: `<div [innerHTML]="html | nzSanitizer: 'html'"></div>`
})
export class TriDemoPipesSanitizerComponent {
  html = `<span>I am <code>innerHTML</code></span>`;
}
