/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriToCssUnitPipe } from './nz-css-unit.pipe';

describe('NzToCssUnitPipe', () => {
  let pipe: TriToCssUnitPipe;

  beforeEach(() => {
    pipe = new TriToCssUnitPipe();
  });

  describe('number', () => {
    it('Should ToCssUnit', () => {
      expect(pipe.transform(100)).toEqual('100px');
    });

    it('Should ToCssUnit', () => {
      expect(pipe.transform(100, 'px')).toEqual('100px');
    });

    it('Should ToCssUnit but defaultUnit is defined', () => {
      expect(pipe.transform(100, 'pt')).toEqual('100pt');
    });
  });

  describe('string', () => {
    it('Should ToCssUnit but typeof value is String', () => {
      expect(pipe.transform('100px')).toEqual('100px');
    });

    it('Should ToCssUnit but defaultUnit is defined and typeof value is String', () => {
      expect(pipe.transform('100px', 'pt')).toEqual('100px');
    });
  });
});
