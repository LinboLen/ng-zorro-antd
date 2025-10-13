import { NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFormModule, type TriRequiredMark } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-form-required-style',
  imports: [FormsModule, TriFormModule, TriRadioModule, TriInputModule, NgTemplateOutlet, TriTagModule],
  template: `
    <form tri-form [requiredMark]="requiredMarkStyle()">
      <tri-radio-group [(ngModel)]="requiredMarkStyle" name="requiredMarkStyle">
        <label tri-radio-button [value]="true">Default</label>
        <label tri-radio-button value="optional">Optional</label>
        <label tri-radio-button [value]="false">Hidden</label>
        <label tri-radio-button [value]="customRequiredMark">Custom</label>
      </tri-radio-group>
      <tri-form-item>
        <tri-form-label for="fieldA" required>Field A</tri-form-label>
        <tri-form-control>
          <input type="text" tri-input id="fieldA" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label for="fieldB">Field B</tri-form-label>
        <tri-form-control>
          <input type="text" tri-input id="fieldB" />
        </tri-form-control>
      </tri-form-item>
    </form>

    <ng-template #customRequiredMark let-label let-required="required">
      @if (required) {
        <tri-tag color="red">Required</tri-tag>
      } @else {
        <tri-tag color="orange">Optional</tri-tag>
      }
      <ng-container *ngTemplateOutlet="label" />
    </ng-template>
  `,
  styles: `
    nz-radio-group {
      margin-bottom: 16px;
    }
    [nz-form] {
      max-width: 600px;
    }
  `
})
export class TriDemoFormRequiredStyleComponent {
  readonly requiredMarkStyle = signal<TriRequiredMark>('optional');
}
