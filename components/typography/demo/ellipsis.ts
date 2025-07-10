import { Component } from '@angular/core';

import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: '',
  imports: [TriTypographyModule],
  template: `
    <p
      tri-typography
      ellipsis
      copyable
      content="Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background
      applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
      Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background
      applications, is refined by Ant UED Team. Ant Design"
    ></p>
    <br />
    <p tri-typography ellipsis>
      Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design
      language for background applications, is refined by Ant UED Team. Ant Design, a design language for background
      applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by
      Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design
    </p>
    <br />
    <p tri-typography ellipsis expandable [ellipsisRows]="3">
      Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design
      language for background applications, is refined by Ant UED Team. Ant Design, a design language for background
      applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by
      Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
      design language for background applications, is refined by Ant UED Team.
    </p>
    <br />
    <p
      tri-typography
      ellipsis
      editable
      [ellipsisRows]="2"
      [content]="dynamicContent"
      (contentChange)="onChange($event)"
    ></p>
  `
})
export class TriDemoTypographyEllipsisComponent {
  dynamicContent =
    'Ant Design, a design language for background applications, is refined by Ant UED Team. ' +
    'Ant Design, a design language for background applications, is refined by Ant UED Team. ' +
    'Ant Design, a design language for background applications, is refined by Ant UED Team. ' +
    'Ant Design, a design language for background applications, is refined by Ant UED Team.';

  onChange(event: string): void {
    this.dynamicContent = event;
  }
}
