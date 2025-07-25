/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriElementPatchDirective } from './element-patch.directive';

describe('nz-element', () => {
  let fixture: ComponentFixture<TriTestElementPatchComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestElementPatchComponent);
    fixture.detectChanges();
  });

  it('should getters work', () => {
    const element = fixture.componentInstance.element.nativeElement as HTMLButtonElement;
    expect(element.tagName).toBe('BUTTON');
  });
});

@Component({
  imports: [TriElementPatchDirective],
  template: `<button tri-element>Action</button> `
})
export class TriTestElementPatchComponent {
  @ViewChild(TriElementPatchDirective) element!: TriElementPatchDirective;
}
