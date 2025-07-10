import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: '',
  imports: [FormsModule, TriAvatarModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="webFrameworks" [valueWith]="valueWith" (onSelect)="onSelect($event)">
      <textarea rows="1" tri-input mentionTrigger [(ngModel)]="inputValue"></textarea>
      <ng-container *mentionSuggestion="let framework">
        <tri-avatar size="small" [text]="framework.name" [src]="framework.icon"></tri-avatar>
        <span>{{ framework.name }} - {{ framework.type }}</span>
      </ng-container>
    </tri-mention>
  `,
  styles: [
    `
      .ant-avatar.ant-avatar-sm {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        position: relative;
      }
    `
  ]
})
export class TriDemoMentionAvatarComponent {
  inputValue?: string;
  webFrameworks = [
    { name: 'React', type: 'JavaScript', icon: 'https://zos.alipayobjects.com/rmsportal/LFIeMPzdLcLnEUe.svg' },
    { name: 'Angular', type: 'JavaScript', icon: 'https://zos.alipayobjects.com/rmsportal/PJTbxSvzYWjDZnJ.png' },
    { name: 'Dva', type: 'JavaScript', icon: 'https://zos.alipayobjects.com/rmsportal/EYPwSeEJKxDtVxI.png' },
    { name: 'Flask', type: 'Python', icon: 'https://zos.alipayobjects.com/rmsportal/xaypBUijfnpAlXE.png' }
  ];

  valueWith = (data: { name: string; type: string; icon: string }): string => data.name;

  onSelect(value: string): void {
    console.log(value);
  }
}
