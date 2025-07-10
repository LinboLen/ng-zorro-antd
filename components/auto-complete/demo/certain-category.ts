import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

interface AutocompleteOptionGroups {
  title: string;
  count?: number;
  children?: AutocompleteOptionGroups[];
}

@Component({
  selector: '',
  imports: [FormsModule, TriAutocompleteModule, TriIconModule, TriInputModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="example-input">
      <tri-input-group size="large" [suffix]="suffixIcon">
        <input
          placeholder="input here"
          tri-input
          [(ngModel)]="inputValue"
          (ngModelChange)="onChange($event)"
          [autocomplete]="auto"
        />
      </tri-input-group>
      <ng-template #suffixIcon>
        <tri-icon type="search" />
      </ng-template>
      <tri-autocomplete #auto>
        @for (group of optionGroups; track group.title) {
          <tri-auto-optgroup [label]="groupTitle">
            <ng-template #groupTitle>
              <span>
                {{ group.title }}
                <a class="more-link" href="https://www.google.com/search?q=ng+zorro" target="_blank">更多</a>
              </span>
            </ng-template>
            @for (option of group.children; track option.title) {
              <tri-auto-option [label]="option.title" [value]="option.title">
                {{ option.title }}
                <span class="certain-search-item-count">{{ option.count }} 人 关注</span>
              </tri-auto-option>
            }
          </tri-auto-optgroup>
        }
      </tri-autocomplete>
    </div>
  `,
  styles: [
    `
      .certain-search-item-count {
        position: absolute;
        color: #999;
        right: 16px;
      }

      .more-link {
        float: right;
      }
    `
  ]
})
export class TriDemoAutoCompleteCertainCategoryComponent implements OnInit {
  inputValue?: string;
  optionGroups: AutocompleteOptionGroups[] = [];

  onChange(value: string): void {
    console.log(value);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.optionGroups = [
        {
          title: '话题',
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
          title: '问题',
          children: [
            {
              title: 'AntDesign UI 有多好',
              count: 60100
            },
            {
              title: 'AntDesign 是啥',
              count: 30010
            }
          ]
        },
        {
          title: '文章',
          children: [
            {
              title: 'AntDesign 是一个设计语言',
              count: 100000
            }
          ]
        }
      ];
    }, 1000);
  }
}
