import { Component } from '@angular/core';

import { TriHashCodeModule } from 'ng-zorro-antd/hash-code';

@Component({
  selector: 'tri-demo-hash-code-copy',
  imports: [TriHashCodeModule],
  template: `<tri-hash-code [value]="value" (onCopy)="getCopy($event)" />`
})
export class TriDemoHashCodeCopyComponent {
  value = 'dfb5fe9ef7b99b2b1db102114a6d7d445d992f40a5d575f801c148990199a068';

  getCopy(value: string): void {
    console.log(`hashCode:${value}`);
  }
}
