import { Component } from '@angular/core';

import { TriIconModule, TriIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-icon-iconfont',
  imports: [TriIconModule],
  template: `
    <tri-icon iconfont="icon-tuichu" />
    <tri-icon iconfont="icon-facebook" />
    <tri-icon iconfont="icon-twitter" />
  `,
  styles: `
    nz-icon {
      margin-right: 6px;
      font-size: 24px;
    }
  `
})
export class TriDemoIconIconfontComponent {
  constructor(private iconService: TriIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
    });
  }
}
