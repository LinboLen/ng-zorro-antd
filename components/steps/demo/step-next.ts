import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: '',
  imports: [TriButtonModule, TriStepsModule],
  template: `
    <tri-steps [current]="current">
      <tri-step title="Finished"></tri-step>
      <tri-step title="In Progress"></tri-step>
      <tri-step title="Waiting"></tri-step>
    </tri-steps>

    <div class="steps-content">{{ index }}</div>
    <div class="steps-action">
      @if (current > 0) {
        <button tri-button type="default" (click)="pre()">
          <span>Previous</span>
        </button>
      }
      @if (current < 2) {
        <button tri-button type="default" (click)="next()">
          <span>Next</span>
        </button>
      }
      @if (current === 2) {
        <button tri-button type="primary" (click)="done()">
          <span>Done</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      .steps-content {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 80px;
      }

      .steps-action {
        margin-top: 24px;
      }

      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoStepsStepNextComponent {
  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }
}
