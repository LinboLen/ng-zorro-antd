/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TriCodeEditorModule } from 'ng-zorro-antd/code-editor';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
declare const monaco: any;

@Component({
  imports: [FormsModule, TriCodeEditorModule],
  template: `
    <tri-code-editor
      class="editor"
      [ngModel]="code"
      [fullControl]="true"
      (editorInitialized)="onEditorInit($event)"
    ></tri-code-editor>
  `
})
export class TriTestCodeEditorFullControlComponent {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  editor: any;

  code = '';

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  onEditorInit(e: any): void {
    this.editor = e;
    this.editor.setModel(monaco.editor.createModel("console.log('Hello ng-zorro-antd')", 'typescript'));
  }
}

describe('code editor', () => {
  // describe('basic', () => {
  //   // let fixture: ComponentFixture<NzDemoCodeEditorBasicComponent>;

  //   beforeEach(waitForAsync(() => {
  //     TestBed.configureTestingModule({
  //       imports: [FormsModule, NzCodeEditorModule],
  //       declarations: [NzDemoCodeEditorBasicComponent]
  //     });
  //   }));

  //   beforeEach(() => {
  //     // fixture = TestBed.createComponent(NzDemoCodeEditorBasicComponent);
  //   });
  // });

  describe('full control', () => {
    let fixture: ComponentFixture<TriTestCodeEditorFullControlComponent>;
    let testComponent: TriTestCodeEditorFullControlComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCodeEditorFullControlComponent);
      testComponent = fixture.debugElement.componentInstance;
    });

    // It seems that there is no way to waiting for monaco editor to load.
    xit('should raise error when user try to set value in full control mode', waitForAsync(() => {
      const spy = spyOn(console, 'warn');
      testComponent.code = '123';
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        '[NG-ZORRO]',
        'should not set value when you are using full control mode! It would result in ambiguous data flow!'
      );
    }));
  });
});
