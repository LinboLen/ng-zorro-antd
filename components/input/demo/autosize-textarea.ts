import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-autosize-textarea',
  imports: [TriInputModule, CdkTextareaAutosize],
  template: `
    <textarea tri-input placeholder="Autosize height based on content lines" cdkTextareaAutosize></textarea>
    <br />
    <br />
    <textarea
      tri-input
      placeholder="Autosize height with minimum and maximum number of lines"
      cdkTextareaAutosize
      cdkAutosizeMinRows="2"
      cdkAutosizeMaxRows="6"
    ></textarea>
    <br />
    <br />
    <textarea
      tri-input
      placeholder="Controlled autosize"
      cdkTextareaAutosize
      cdkAutosizeMinRows="3"
      cdkAutosizeMaxRows="5"
    ></textarea>
  `
})
export class TriDemoInputAutosizeTextareaComponent {}
