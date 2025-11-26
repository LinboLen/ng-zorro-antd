/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriFormSplitComponent } from './form-split.component';

describe('nz-form-split', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
  });

  it('should className correct', () => {
    const fixture = TestBed.createComponent(TriFormSplitComponent);
    expect(fixture.nativeElement.classList).toContain('ant-form-split');
  });
});
