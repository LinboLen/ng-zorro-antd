import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCodeEditorModule } from 'ng-zorro-antd/code-editor';

@Component({
  selector: '',
  imports: [FormsModule, TriCodeEditorModule],
  template: `
    <tri-code-editor
      class="editor"
      [originalText]="originalCode"
      [editorMode]="'diff'"
      [ngModel]="code"
      [editorOption]="{ language: 'typescript' }"
    ></tri-code-editor>
  `,
  styles: [
    `
      .editor {
        height: 200px;
      }
    `
  ]
})
export class TriDemoCodeEditorDiffComponent {
  originalCode = `import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

@Component({})
export class SomeComponent {}`;

  code = `import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

@Component({})
export class SomeComponent {}`;
}
