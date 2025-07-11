import { Component } from '@angular/core';
import { merge, Observable, timer } from 'rxjs';
import { delay, finalize, map, scan } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriStepsModule } from 'ng-zorro-antd/steps';

interface SyncStep {
  id: number;
  title: string;
  description: string;
  async: false;
  percentage: null;
}

interface AsyncStep {
  id: number;
  title: string;
  description: string;
  async: true;
  percentage: number;
}

type Step = SyncStep | AsyncStep;

function mockAsyncStep(): Observable<number> {
  const subStep1 = timer(600).pipe(map(() => 25));
  const subStep2 = subStep1.pipe(delay(600));
  const subStep3 = subStep2.pipe(delay(600));
  const subStep4 = subStep3.pipe(delay(600));
  return merge(subStep1, subStep2, subStep3, subStep4).pipe(scan((a, b) => a + b));
}

@Component({
  selector: 'tri-demo-steps-progress',
  imports: [TriButtonModule, TriStepsModule],
  template: `
    <tri-steps [current]="current">
      @for (step of this.steps; track step.id) {
        <tri-step
          [title]="step.title"
          [description]="step.description"
          [percentage]="step.async ? step.percentage : null"
        ></tri-step>
      }
    </tri-steps>
    <div class="steps-action">
      @if (current > 0) {
        <button tri-button type="default" (click)="pre()">
          <span>Previous</span>
        </button>
      }
      @if (current < 2) {
        <button tri-button type="default" (click)="next()" [loading]="processing">
          <span>Next</span>
        </button>
      }
      @if (current === 2) {
        <button tri-button type="primary" (click)="done()" [loading]="processing">
          <span>Done</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      .steps-action {
        margin-top: 36px;
      }

      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoStepsProgressComponent {
  steps: Step[] = [
    {
      id: 1,
      title: `Step 1`,
      description: `This step is synchronous.`,
      async: false,
      percentage: null
    },
    {
      id: 2,
      title: `Step 2`,
      description: `This step is asynchronous.`,
      async: true,
      percentage: 0
    },
    {
      id: 3,
      title: `Step 3`,
      description: `This step is asynchronous.`,
      async: true,
      percentage: 0
    }
  ];
  current = 0;
  processing = false;

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.loadingAndStep();
  }

  done(): void {
    this.loadingAndStep();
    console.log('done');
  }

  loadingAndStep(): void {
    if (this.current < this.steps.length) {
      const step = this.steps[this.current];
      if (step.async) {
        this.processing = true;
        mockAsyncStep()
          .pipe(
            finalize(() => {
              step.percentage = 0;
              this.processing = false;
              this.current += 1;
            })
          )
          .subscribe(p => {
            step.percentage = p;
          });
      } else {
        this.current += 1;
      }
    }
  }
}
