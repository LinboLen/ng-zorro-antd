import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-drawer-from-drawer',
  imports: [
    TriButtonModule,
    TriDrawerModule,
    TriDatePickerModule,
    TriFormModule,
    TriInputModule,
    TriSelectModule,
    CdkTextareaAutosize
  ],
  template: `
    <button tri-button type="primary" (click)="open()">Create</button>
    <tri-drawer
      [bodyStyle]="{ overflow: 'auto' }"
      [maskClosable]="false"
      [width]="720"
      [visible]="visible"
      title="Create"
      [footer]="footerTpl"
      (onClose)="close()"
    >
      <form tri-form *drawerContent>
        <div tri-row [gutter]="8">
          <div tri-col span="12">
            <tri-form-item>
              <tri-form-label>Name</tri-form-label>
              <tri-form-control>
                <input tri-input placeholder="please enter user name" />
              </tri-form-control>
            </tri-form-item>
          </div>
          <div tri-col span="12">
            <tri-form-item>
              <tri-form-label>Url</tri-form-label>
              <tri-form-control>
                <tri-input-wrapper addonBefore="http://" addonAfter=".com">
                  <input type="text" tri-input placeholder="please enter url" />
                </tri-input-wrapper>
              </tri-form-control>
            </tri-form-item>
          </div>
        </div>
        <div tri-row [gutter]="8">
          <div tri-col span="12">
            <tri-form-item>
              <tri-form-label>Owner</tri-form-label>
              <tri-form-control>
                <tri-select placeHolder="Please select an owner" />
              </tri-form-control>
            </tri-form-item>
          </div>
          <div tri-col span="12">
            <tri-form-item>
              <tri-form-label>Type</tri-form-label>
              <tri-form-control>
                <tri-select placeHolder="Please choose the type" />
              </tri-form-control>
            </tri-form-item>
          </div>
        </div>
        <div tri-row [gutter]="8">
          <div tri-col span="12">
            <tri-form-item>
              <tri-form-label>Approver</tri-form-label>
              <tri-form-control>
                <tri-select placeHolder="Please choose the approver" />
              </tri-form-control>
            </tri-form-item>
          </div>
          <div tri-col span="12">
            <tri-form-item>
              <tri-form-label>DateTime</tri-form-label>
              <tri-form-control>
                <tri-range-picker />
              </tri-form-control>
            </tri-form-item>
          </div>
        </div>
        <div tri-row [gutter]="8">
          <div tri-col span="24">
            <tri-form-item>
              <tri-form-label>Description</tri-form-label>
              <tri-form-control>
                <textarea
                  tri-input
                  placeholder="please enter url description"
                  cdkTextareaAutosize
                  cdkAutosizeMinRows="4"
                  cdkAutosizeMaxRows="4"
                ></textarea>
              </tri-form-control>
            </tri-form-item>
          </div>
        </div>
      </form>

      <ng-template #footerTpl>
        <div style="float: right">
          <button tri-button style="margin-right: 8px;" (click)="close()">Cancel</button>
          <button tri-button type="primary" (click)="close()">Submit</button>
        </div>
      </ng-template>
    </tri-drawer>
  `
})
export class TriDemoDrawerFromDrawerComponent {
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
