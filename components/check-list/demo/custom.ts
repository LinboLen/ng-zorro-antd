import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckListModule, TriItemProps } from 'ng-zorro-antd/check-list';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-check-list-custom',
  imports: [
    TriCheckListModule,
    TriButtonModule,
    TriFormModule,
    ReactiveFormsModule,
    TriCheckboxModule,
    TriInputModule,
    TriSegmentedModule
  ],
  template: `
    <form tri-form layout="vertical" [formGroup]="form">
      <tri-form-item>
        <tri-form-label>Visible</tri-form-label>
        <tri-form-control>
          <label tri-checkbox formControlName="nzVisible"></label>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Show Progress</tri-form-label>
        <tri-form-control>
          <label tri-checkbox formControlName="nzProgress"></label>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Index</tri-form-label>
        <tri-form-control>
          <tri-segmented [options]="options" (valueChange)="handleIndexChange($event)"></tri-segmented>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Trigger Render</tri-form-label>
        <tri-form-control>
          <input tri-input formControlName="nzTriggerRender" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Title</tri-form-label>
        <tri-form-control>
          <input tri-input formControlName="nzTitle" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Footer</tri-form-label>
        <tri-form-control>
          <input tri-input formControlName="nzFooter" />
        </tri-form-control>
      </tri-form-item>
    </form>

    <tri-check-list
      [items]="items"
      [visible]="visible.value"
      [index]="index.value || 0"
      [progress]="progress.value"
      [triggerRender]="triggerRender.value"
      [title]="title.value"
      [footer]="footer.value"
      (hide)="hideCancel($event)"
    ></tri-check-list>
  `,
  styles: [
    `
      :host {
        position: relative;
      }
      form {
        width: 300px;
      }
      nz-check-list {
        position: absolute;
      }
    `
  ]
})
export class TriDemoCheckListCustomComponent {
  private fb = inject(NonNullableFormBuilder);
  readonly items: TriItemProps[] = [
    {
      description: 'step 1',
      onClick: () => console.log('step 1')
    },
    {
      description: 'Step 2',
      onClick: () => console.log('step 1')
    },
    {
      description: 'Step 3',
      onClick: () => console.log('step 3')
    },
    {
      description: 'Step 4',
      onClick: () => console.log('step 4')
    }
  ];
  readonly options = this.items.map((_, index) => index).concat(this.items.length + 1);
  form = this.fb.group({
    nzProgress: true,
    nzVisible: true,
    nzIndex: 0,
    nzTriggerRender: 'Open List',
    nzTitle: 'Customize task lists',
    nzFooter: 'Custom Footer Name'
  });

  handleIndexChange(num: number | string): void {
    this.form.controls.nzIndex.setValue(Number(num));
  }

  hideCancel(check: boolean): void {
    console.log(check);
    this.form.controls.nzVisible.setValue(false);
  }
}
