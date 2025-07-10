import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { TriPopoverModule } from 'ng-zorro-antd/popover';
import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: '',
  imports: [NgTemplateOutlet, TriStepsModule, TriPopoverModule],
  template: `
    <tri-steps [current]="1" [progressDot]="progressTemplate">
      <tri-step title="Finished" description="You can hover on the dot."></tri-step>
      <tri-step title="In Progress" description="You can hover on the dot."></tri-step>
      <tri-step title="Waiting" description="You can hover on the dot."></tri-step>
      <tri-step title="Waiting" description="You can hover on the dot."></tri-step>
    </tri-steps>
    <ng-template #progressTemplate let-dot let-status="status" let-index="index">
      <span tri-popover popoverContent="steps {{ index }} status: {{ status }}" style="margin-left: -100%;">
        <ng-template [ngTemplateOutlet]="dot"></ng-template>
      </span>
    </ng-template>
  `
})
export class TriDemoStepsCustomizedProgressDotComponent {}
