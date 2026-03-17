import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-advance-count',
  imports: [ReactiveFormsModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="form" layout="vertical">
      <tri-form-item>
        <tri-form-label><h4>ShowCount</h4></tri-form-label>
        <tri-form-control>
          <tri-input-wrapper allowClear showCount>
            <input tri-input formControlName="test_0" />
          </tri-input-wrapper>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label><h4>Exceed Max</h4></tri-form-label>
        <tri-form-control>
          <tri-input-wrapper showCount [count]="{ max: 10 }">
            <input tri-input formControlName="test_1" />
          </tri-input-wrapper>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label><h4>Emoji count as length 1</h4></tri-form-label>
        <tri-form-control>
          <tri-input-wrapper showCount [count]="{ max: 6, strategy: countStrategyFn }">
            <input tri-input formControlName="test_2" />
          </tri-input-wrapper>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label><h4>Not exceed max</h4></tri-form-label>
        <tri-form-control>
          <tri-input-wrapper
            showCount
            [count]="{ max: 10, strategy: countStrategyFn, exceedFormatter: exceedFormatterFn }"
          >
            <input tri-input formControlName="test_3" />
          </tri-input-wrapper>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label><h4>nz-input-password</h4></tri-form-label>
        <tri-form-control>
          <tri-input-password
            [visibilityToggle]="false"
            showCount
            [count]="{ max: 20, strategy: countStrategyFn, exceedFormatter: exceedFormatterFn }"
          >
            <input tri-input formControlName="test_4" />
          </tri-input-password>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label><h4>nz-input-search</h4></tri-form-label>
        <tri-form-control>
          <tri-input-search showCount [count]="{ max: 20, strategy: countStrategyFn }">
            <input tri-input formControlName="test_5" />
          </tri-input-search>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoInputAdvanceCountComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    test_0: ['Angular & NG-ZORRO'],
    test_1: ['Angular & NG-ZORRO'],
    test_2: ['🔥🔥🔥'],
    test_3: ['AAA🔥🔥🔥'],
    test_4: ['BBB'],
    test_5: ['CCC']
  });

  countStrategyFn: (v: string) => number = v => runes(v).length;
  exceedFormatterFn: (cur: string, config: { max: number }) => string = (v, { max }) => {
    const result = runes(v).slice(0, max).join('');
    return result;
  };
}

function runes(str: string): string[] {
  return [...str];
}
