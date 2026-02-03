import { Component, DOCUMENT, inject, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCodeEditorComponent, TriCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTooltipDirective, TriTooltipModule } from 'ng-zorro-antd/tooltip';
import { TriTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'tri-demo-code-editor-complex',
  imports: [FormsModule, TriCodeEditorModule, TriIconModule, TriTypographyModule, TriSwitchModule, TriTooltipModule],
  template: `
    <p tri-paragraph style="margin-bottom: 8px;">
      Loading
      <tri-switch [(ngModel)]="loading" />
    </p>
    <tri-code-editor
      class="editor"
      [class.full-screen]="fullScreen"
      [ngModel]="code"
      [loading]="loading"
      [toolkit]="toolkit"
      [editorOption]="{ language: 'javascript' }"
    />
    <ng-template #toolkit>
      <tri-icon
        [class.active]="fullScreen"
        tri-tooltip
        tooltipTitle="Toggle Fullscreen"
        [type]="fullScreen ? 'fullscreen-exit' : 'fullscreen'"
        (click)="toggleFullScreen()"
      />
    </ng-template>
  `,
  styles: `
    .editor {
      height: 200px;
    }

    .full-screen {
      position: fixed;
      z-index: 999;
      height: 100vh;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
  `
})
export class TriDemoCodeEditorComplexComponent {
  @ViewChild(TriCodeEditorComponent, { static: false }) editorComponent?: TriCodeEditorComponent;
  @ViewChild(TriTooltipDirective, { static: false }) tooltip?: TriTooltipDirective;

  loading = true;
  fullScreen = false;
  code = `function flatten(arr) {
  if (!(arr instanceof Array)) {
    throw new Error('The parameter must be an array.');
  }

  function partial(arr_) {
    return arr_.reduce((previous, current) => {
      if (current instanceof Array) {
        previous.push(...partial(current));
        return previous;
      } else {
        previous.push(current);
        return previous;
      }
    }, []);
  }

  return partial(arr);
}

console.log(flatten(['1', 2, [[3]]]))`;
  private document: Document = inject(DOCUMENT);
  private renderer: Renderer2 = inject(Renderer2);

  toggleFullScreen(): void {
    this.fullScreen = !this.fullScreen;
    this.renderer.setStyle(this.document.body, 'overflow-y', this.fullScreen ? 'hidden' : null);
    this.editorComponent?.layout();
    this.tooltip?.hide();
  }
}
