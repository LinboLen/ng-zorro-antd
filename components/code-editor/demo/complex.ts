import { Component, DOCUMENT, Renderer2, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCodeEditorComponent, TriCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

const CODE = `function flatten(arr) {
  if (!(arr instanceof Array)) {
    throw new Error('The parameter must be an array.');
  }

  function partial(_arr) {
    return _arr.reduce((previous, current) => {
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

@Component({
  selector: 'tri-demo-code-editor-complex',
  imports: [FormsModule, TriCodeEditorModule, TriIconModule, TriSwitchModule, TriTooltipModule],
  template: `
    <div>
      Loading
      <tri-switch [(ngModel)]="loading" />
    </div>
    <br />
    <tri-code-editor
      class="editor"
      [class.fullscreen]="fullscreen()"
      [ngModel]="code"
      [loading]="loading()"
      [toolkit]="toolkit"
      [editorOption]="{ language: 'javascript' }"
    />
    <ng-template #toolkit>
      <tri-icon
        [class.active]="fullscreen()"
        tri-tooltip
        tooltipTitle="Toggle Fullscreen"
        [type]="fullscreen() ? 'fullscreen-exit' : 'fullscreen'"
        (click)="toggleFullScreen()"
      />
    </ng-template>
  `,
  styles: `
    .editor {
      height: 200px;
    }

    .fullscreen {
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
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  @ViewChild(TriCodeEditorComponent, { static: false }) editorComponent?: TriCodeEditorComponent;

  readonly loading = signal(true);
  readonly fullscreen = signal(false);
  readonly code = CODE;

  toggleFullScreen(): void {
    this.fullscreen.set(!this.fullscreen());
    this.renderer.setStyle(this.document.body, 'overflow-y', this.fullscreen() ? 'hidden' : null);
    this.editorComponent?.layout();
  }
}
