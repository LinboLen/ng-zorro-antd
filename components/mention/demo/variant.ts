import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriVariant } from 'ng-zorro-antd/core/types';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionModule } from 'ng-zorro-antd/mention';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-mention-variant',
  imports: [FormsModule, TriInputModule, TriMentionModule, TriSegmentedModule],
  template: `
    <tri-segmented [options]="variants" [(ngModel)]="variant" />
    <tri-mention [suggestions]="suggestions" (onSelect)="onSelect($event)" [variant]="variant()">
      <textarea rows="1" placeholder="input here" mentionTrigger tri-input [(ngModel)]="inputValue"></textarea>
    </tri-mention>
  `,
  styles: `
    nz-segmented {
      margin-bottom: 1rem;
    }
  `
})
export class TriDemoMentionVariantComponent {
  inputValue = model('@afc163');
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
  variant = model<TriVariant>('outlined');
  variants = [
    { label: 'Outlined', value: 'outlined' },
    { label: 'Filled', value: 'filled' },
    { label: 'Borderless', value: 'borderless' },
    { label: 'Underlined', value: 'underlined' }
  ];

  onSelect(value: string): void {
    console.log(value);
  }
}
