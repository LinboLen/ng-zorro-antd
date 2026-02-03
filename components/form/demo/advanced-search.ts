import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormRecord, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-form-advanced-search',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriIconModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" class="tri-advanced-search-form">
      <div tri-row [gutter]="24">
        @for (control of controlArray; track control) {
          <div tri-col [span]="8" [hidden]="!control.show">
            <tri-form-item>
              <tri-form-label [for]="'field' + control.index">Field {{ control.index }}</tri-form-label>
              <tri-form-control>
                <input
                  tri-input
                  placeholder="placeholder"
                  [formControlName]="'field' + control.index"
                  [attr.id]="'field' + control.index"
                />
              </tri-form-control>
            </tri-form-item>
          </div>
        }
      </div>
      <div tri-row>
        <div tri-col [span]="24" class="search-area">
          <button tri-button type="primary">Search</button>
          <button tri-button (click)="resetForm()">Clear</button>
          <a class="collapse" (click)="toggleCollapse()">
            Collapse
            <tri-icon [type]="isCollapse ? 'down' : 'up'" />
          </a>
        </div>
      </div>
    </form>
    <div class="search-result-list">Search Result List</div>
  `,
  styles: `
    .ant-advanced-search-form {
      padding: 24px;
      background: #fbfbfb;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    }

    .search-result-list {
      margin-top: 16px;
      border: 1px dashed #e9e9e9;
      border-radius: 6px;
      background-color: #fafafa;
      min-height: 200px;
      text-align: center;
      padding-top: 80px;
    }

    [nz-form-label] {
      overflow: visible;
    }

    button {
      margin-left: 8px;
    }

    .collapse {
      margin-left: 8px;
      font-size: 12px;
    }

    .search-area {
      text-align: right;
    }
  `
})
export class TriDemoFormAdvancedSearchComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  controlArray: Array<{ index: number; show: boolean }> = [];
  isCollapse = true;

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  resetForm(): void {
    this.validateForm.reset();
  }

  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      this.controlArray.push({ index: i, show: i < 6 });
      this.validateForm.addControl(`field${i}`, this.fb.control(''));
    }
  }
}
