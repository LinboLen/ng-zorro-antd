import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { TriConfigService } from 'ng-zorro-antd/core/config';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-code-editor-config',
  imports: [FormsModule, TriCodeEditorModule, TriIconModule, TriSwitchModule, TriTypographyModule],
  template: `
    <p tri-paragraph style="margin-bottom: 8px;">
      Change Theme
      <tri-switch
        [ngModel]="dark"
        (ngModelChange)="onDarkModeChange($event)"
        [unCheckedChildren]="unchecked"
        [checkedChildren]="checked"
      />
    </p>
    <ng-template #unchecked>
      <tri-icon type="bulb" />
    </ng-template>
    <ng-template #checked>
      <tri-icon type="poweroff" />
    </ng-template>
    <tri-code-editor style="height: 200px" [ngModel]="code" [editorOption]="{ language: 'markdown' }" />
  `
})
export class TriDemoCodeEditorConfigComponent {
  private configService = inject(TriConfigService);

  dark = false;

  code = `**All monaco editor instances on the same page always have the same color. It's a by-design of monaco editor.**

You can refer to [this issue](https://github.com/Microsoft/monaco-editor/issues/338).`;

  onDarkModeChange(dark: boolean): void {
    this.dark = dark;
    const defaultEditorOption = this.configService.getConfigForComponent('codeEditor')?.defaultEditorOption || {};
    this.configService.set('codeEditor', {
      defaultEditorOption: {
        ...defaultEditorOption,
        theme: dark ? 'vs-dark' : 'vs'
      }
    });
  }
}
