/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { EventEmitter } from '@angular/core';

import { TriGraphGroupNode, TriGraphNode } from './interface';

/**
 * https://angular.io/errors/NG3003
 * An intermediate interface for {@link NzGraphComponent} & {@link NzGraphNodeComponent}
 */
export abstract class TriGraph {
  abstract nodeClick: EventEmitter<TriGraphNode | TriGraphGroupNode>;
}
