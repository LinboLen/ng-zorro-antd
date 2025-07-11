import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCodeEditorModule } from 'ng-zorro-antd/code-editor';

@Component({
  selector: 'tri-demo-code-editor-basic',
  imports: [FormsModule, TriCodeEditorModule],
  template: `
    <tri-code-editor class="editor" [ngModel]="code" [editorOption]="{ language: 'typescript' }"></tri-code-editor>
  `,
  styles: [
    `
      .editor {
        height: 200px;
      }
    `
  ]
})
export class TriDemoCodeEditorBasicComponent {
  code = `import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor'

@Component({})
export class SomeComponent {}`;
}
