import { Component } from '@angular/core';

import type { editor } from 'monaco-editor';

import { TriCodeEditorModule } from 'ng-zorro-antd/code-editor';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
declare const monaco: any;

@Component({
  selector: 'tri-demo-code-editor-full-control',
  imports: [TriCodeEditorModule],
  template: `
    <tri-code-editor class="editor" [fullControl]="true" (editorInitialized)="onEditorInit($event)"></tri-code-editor>
  `,
  styles: [
    `
      .editor {
        height: 200px;
      }
    `
  ]
})
export class TriDemoCodeEditorFullControlComponent {
  editor?: editor.ICodeEditor | editor.IEditor;

  onEditorInit(e: editor.ICodeEditor | editor.IEditor): void {
    this.editor = e;
    this.editor.setModel(monaco.editor.createModel("console.log('Hello ng-zorro-antd')", 'typescript'));
  }
}
