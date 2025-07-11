import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-typography-interactive',
  imports: [TriIconModule, TriTypographyModule],
  template: `
    <p tri-typography editable [(contentChange)]="editStr"></p>
    <p
      tri-typography
      editable
      editIcon="highlight"
      editTooltip="click to edit text"
      [(contentChange)]="customEditIconStr"
    ></p>
    <p tri-typography editable [editTooltip]="null" [(contentChange)]="hideEditTooltipStr"></p>
    <p tri-typography copyable editable [(contentChange)]="copyStr"></p>
    <p tri-typography copyable copyText="Hello, Ant Design!">Replace copy text.</p>
    <p
      tri-typography
      copyable
      content="Custom copy icons and tooltips text."
      [copyTooltips]="['click here', copedIcon]"
      [copyIcons]="['meh', 'smile']"
    ></p>
    <ng-template #copedIcon>
      <tri-icon type="smile" theme="fill" />
      you clicked!!
    </ng-template>
    <p tri-typography copyable [copyTooltips]="null" content="Hide copy tooltips."></p>
  `,
  styles: [
    `
      p[nz-typography] {
        margin-bottom: 1em;
      }
    `
  ]
})
export class TriDemoTypographyInteractiveComponent {
  editStr = 'This is an editable text.';
  customEditIconStr = 'Custom edit icon and tooltip text.';
  hideEditTooltipStr = 'Hide edit tooltip.';
  copyStr = 'This is a copyable text.';
}
