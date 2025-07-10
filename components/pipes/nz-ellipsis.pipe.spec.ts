/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriEllipsisPipe } from './nz-ellipsis.pipe';

describe('NzEllipsisPipe', () => {
  let pipe: TriEllipsisPipe;

  beforeEach(() => {
    pipe = new TriEllipsisPipe();
  });

  it('Should truncate', () => {
    expect(pipe.transform('Hello World', 4, '')).toEqual('Hell');
  });

  it('Should return the input', () => {
    expect(pipe.transform('Hello', 10)).toEqual('Hello');
  });
});
