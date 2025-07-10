/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { EventEmitter, Injectable, NgZone } from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

/**
 * Mock synchronous NgZone implementation that can be used
 * to flush out `onStable` subscriptions in tests.
 *
 * via: https://github.com/angular/angular/blob/master/packages/core/testing/src/ng_zone_mock.ts
 *
 * @docs-private
 */
@Injectable()
export class MockNgZone extends NgZone {
  override onStable = new EventEmitter<TriSafeAny>(false);

  constructor() {
    super({ enableLongStackTrace: false });
  }

  override run(fn: () => TriSafeAny): TriSafeAny {
    return fn();
  }

  override runOutsideAngular(fn: () => TriSafeAny): TriSafeAny {
    return fn();
  }

  simulateZoneExit(): void {
    this.onStable.emit(null);
  }
}
