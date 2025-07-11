import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-password-input',
  imports: [FormsModule, TriInputModule, TriIconModule],
  template: `
    <tri-input-group [suffix]="suffixTemplate">
      <input
        [type]="passwordVisible ? 'text' : 'password'"
        tri-input
        placeholder="input password"
        [(ngModel)]="password"
      />
    </tri-input-group>
    <ng-template #suffixTemplate>
      <tri-icon
        class="tri-input-password-icon"
        [type]="passwordVisible ? 'eye-invisible' : 'eye'"
        (click)="passwordVisible = !passwordVisible"
      />
    </ng-template>
  `
})
export class TriDemoInputPasswordInputComponent {
  passwordVisible = false;
  password?: string;
}
