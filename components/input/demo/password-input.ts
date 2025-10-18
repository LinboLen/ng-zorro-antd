import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-password-input',
  imports: [FormsModule, TriInputModule, TriIconModule, TriFlexModule, TriButtonModule],
  template: `
    <tri-input-password>
      <input tri-input placeholder="input password" [(ngModel)]="password" />
    </tri-input-password>
    <br />
    <br />
    <tri-input-password>
      <input tri-input placeholder="input password" [(ngModel)]="password" />
      <ng-template inputPasswordIcon let-visible>
        @if (visible) {
          <tri-icon type="eye" theme="twotone" />
        } @else {
          <tri-icon type="eye-invisible" theme="outline" />
        }
      </ng-template>
    </tri-input-password>
    <br />
    <br />
    <tri-flex gap="8px">
      <tri-input-password [(visibleChange)]="passwordVisible" [style.flex]="1">
        <input tri-input placeholder="input password" [(ngModel)]="password" />
      </tri-input-password>
      <button tri-button (click)="passwordVisible.set(!passwordVisible())">
        {{ passwordVisible() ? 'Hide' : 'Show' }}
      </button>
    </tri-flex>
    <br />
    <tri-input-password>
      <input tri-input placeholder="input password" [(ngModel)]="password" disabled />
    </tri-input-password>
  `
})
export class TriDemoInputPasswordInputComponent {
  readonly passwordVisible = signal(false);
  readonly password = signal('');
}
