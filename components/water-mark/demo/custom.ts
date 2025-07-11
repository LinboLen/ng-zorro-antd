import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TriColor, TriColorPickerModule } from 'ng-zorro-antd/color-picker';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriSliderModule } from 'ng-zorro-antd/slider';
import { TriTypographyModule } from 'ng-zorro-antd/typography';
import { FontType, TriWaterMarkModule } from 'ng-zorro-antd/water-mark';

@Component({
  selector: 'tri-demo-water-mark-custom',
  imports: [
    ReactiveFormsModule,
    TriColorPickerModule,
    TriDividerModule,
    TriFormModule,
    TriInputModule,
    TriInputNumberModule,
    TriSliderModule,
    TriTypographyModule,
    TriWaterMarkModule
  ],
  template: `
    <div style="display: flex;">
      <tri-water-mark
        [content]="form.value.content!"
        [rotate]="form.value.rotate!"
        [zIndex]="form.value.zIndex!"
        [gap]="gap"
        [offset]="offset"
        [font]="font"
      >
        <p tri-typography style="z-index: 10; position:relative;">
          The light-speed iteration of the digital world makes products more complex. However, human consciousness and
          attention resources are limited. Facing this design contradiction, the pursuit of natural interaction will be
          the consistent direction of Ant Design.
        </p>
        <p tri-typography style="z-index: 10; position:relative;">
          Natural user cognition: According to cognitive psychology, about 80% of external information is obtained
          through visual channels. The most important visual elements in the interface design, including layout, colors,
          illustrations, icons, etc., should fully absorb the laws of nature, thereby reducing the user&apos;s cognitive
          cost and bringing authentic and smooth feelings. In some scenarios, opportunely adding other sensory channels
          such as hearing, touch can create a richer and more natural product experience.
        </p>
        <p tri-typography style="z-index: 10; position:relative;">
          Natural user behavior: In the interaction with the system, the designer should fully understand the
          relationship between users, system roles, and task objectives, and also contextually organize system functions
          and services. At the same time, a series of methods such as behavior analysis, artificial intelligence and
          sensors could be applied to assist users to make effective decisions and reduce extra operations of users, to
          save users&apos; mental and physical resources and make human-computer interaction more natural.
        </p>
        <img
          style="z-index: 30; position:relative; width: 100%; max-width: 800px;"
          src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
          alt="示例图片"
        />
      </tri-water-mark>
      <tri-divider type="vertical"></tri-divider>
      <form tri-form layout="vertical" [formGroup]="form">
        <tri-form-item>
          <tri-form-label>Content</tri-form-label>
          <tri-form-control>
            <input tri-input type="text" formControlName="content" />
          </tri-form-control>
        </tri-form-item>
        <tri-form-item>
          <tri-form-label>Color</tri-form-label>
          <tri-form-control>
            <tri-color-picker [value]="color" (onChange)="changeColor($event)"></tri-color-picker>
          </tri-form-control>
        </tri-form-item>
        <tri-form-item>
          <tri-form-label>FontSize</tri-form-label>
          <tri-form-control>
            <tri-slider formControlName="fontSize"></tri-slider>
          </tri-form-control>
        </tri-form-item>
        <tri-form-item>
          <tri-form-label>zIndex</tri-form-label>
          <tri-form-control>
            <tri-slider formControlName="zIndex"></tri-slider>
          </tri-form-control>
        </tri-form-item>
        <tri-form-item>
          <tri-form-label>Rotate</tri-form-label>
          <tri-form-control>
            <tri-slider [min]="-180" [max]="180" formControlName="rotate"></tri-slider>
          </tri-form-control>
        </tri-form-item>
        <tri-form-item>
          <tri-form-label>Gap</tri-form-label>
          <tri-form-control>
            <tri-input-number formControlName="gapX"></tri-input-number>
            <tri-input-number formControlName="gapY"></tri-input-number>
          </tri-form-control>
        </tri-form-item>
        <tri-form-item>
          <tri-form-label>Offset</tri-form-label>
          <tri-form-control>
            <tri-input-number formControlName="offsetX"></tri-input-number>
            <tri-input-number formControlName="offsetY"></tri-input-number>
          </tri-form-control>
        </tri-form-item>
      </form>
    </div>
  `,
  styles: [
    `
      nz-water-mark {
        flex: 1 1 auto;
      }

      nz-divider {
        height: auto;
        margin: 0 20px;
      }

      form {
        flex: 0 0 280px;
      }

      nz-input-number {
        margin-right: 12px;
        width: 40%;
      }
    `
  ]
})
export class TriDemoWaterMarkCustomComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    content: 'NG Ant Design',
    fontSize: 16,
    zIndex: 11,
    rotate: -22,
    gapX: 100,
    gapY: 100,
    offsetX: 50,
    offsetY: 50
  });
  color: string = 'rgba(0,0,0,.15)';
  font: FontType = {
    color: 'rgba(0,0,0,.15)',
    fontSize: 16
  };
  gap: [number, number] = [100, 100];
  offset: [number, number] = [50, 50];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe(item => {
      this.font = {
        fontSize: item.fontSize,
        color: this.color
      };
      this.gap = [item.gapX!, item.gapY!];
      this.offset = [item.offsetX!, item.offsetY!];
      this.cdr.markForCheck();
    });
  }

  changeColor(value: { color: TriColor; format: string }): void {
    this.color = value.color.toRgbString();
    this.font = {
      fontSize: this.form.value.fontSize,
      color: value.color.toRgbString()
    };
    this.cdr.markForCheck();
  }
}
