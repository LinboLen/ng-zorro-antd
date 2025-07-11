import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-textarea-with-character-count',
  imports: [ReactiveFormsModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="form" layout="vertical">
      <tri-form-item>
        <tri-form-control>
          <tri-textarea-count [maxCharacterCount]="100">
            <textarea rows="4" formControlName="comment" tri-input></textarea>
          </tri-textarea-count>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoInputTextareaWithCharacterCountComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({ comment: this.fb.control('', [Validators.maxLength(100)]) });
}
