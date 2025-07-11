import { Component } from '@angular/core';

import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-tag-checkable',
  imports: [TriTagModule],
  template: `
    <tri-tag mode="checkable" [checked]="true" (checkedChange)="checkChange($event)">Tag1</tri-tag>
    <tri-tag mode="checkable" [checked]="true" (checkedChange)="checkChange($event)">Tag2</tri-tag>
    <tri-tag mode="checkable" [checked]="true" (checkedChange)="checkChange($event)">Tag3</tri-tag>
  `
})
export class TriDemoTagCheckableComponent {
  checkChange(e: boolean): void {
    console.log(e);
  }
}
