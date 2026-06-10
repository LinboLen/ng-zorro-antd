import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-certain-category',
  imports: [FormsModule, TriAutocompleteModule, TriFlexModule, TriIconModule, TriInputModule],
  template: `
    <tri-input-search>
      <input placeholder="input here" tri-input size="large" [(ngModel)]="value" [autocomplete]="auto" />
    </tri-input-search>
    <tri-autocomplete #auto>
      @for (group of options; track group.title) {
        <tri-auto-optgroup [label]="groupTitle">
          <ng-template #groupTitle>
            <tri-flex justify="space-between">
              {{ group.title }}
              <a href="https://www.google.com/search?q=ng+zorro" rel="noopener noreferrer" target="_blank">More</a>
            </tri-flex>
          </ng-template>
          @for (option of group.children; track option.title) {
            <tri-auto-option [label]="option.title" [value]="option.title">
              <tri-flex justify="space-between">
                {{ option.title }}
                <span>
                  <tri-icon type="user" />
                  {{ option.count }}
                </span>
              </tri-flex>
            </tri-auto-option>
          }
        </tri-auto-optgroup>
      }
    </tri-autocomplete>
  `
})
export class TriDemoAutoCompleteCertainCategoryComponent {
  value?: string;
  readonly options = [
    {
      title: 'Libraries',
      children: [
        {
          title: 'AntDesign',
          count: 10000
        },
        {
          title: 'AntDesign UI',
          count: 10600
        }
      ]
    },
    {
      title: 'Solutions',
      children: [
        {
          title: 'AntDesign UI FAQ',
          count: 60100
        },
        {
          title: 'AntDesign FAQ',
          count: 30010
        }
      ]
    },
    {
      title: 'Articles',
      children: [
        {
          title: 'AntDesign design language',
          count: 100000
        }
      ]
    }
  ];
}
