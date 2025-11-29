/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { TriTreeFlattener } from './flattener';
import { TriTreeView } from './tree';

export class TriTreeViewFlatDataSource<T, F> extends DataSource<F> {
  private _flattenedData = new BehaviorSubject<F[]>([]);
  private _data = new BehaviorSubject<T[]>([]);

  constructor(
    private readonly _tree: TriTreeView<F>,
    private readonly _treeFlattener: TriTreeFlattener<T, F>,
    readonly initialData: T[] = []
  ) {
    super();
    this.setData(initialData);
  }

  setData(data: T[]): void {
    this._data.next(data);
    this.setFlattenedData(this.flatten(data));
  }

  getData(): T[] {
    return this._data.getValue();
  }

  getFlattenData(): F[] {
    return this._flattenedData.getValue();
  }

  setFlattenedData(nodes: F[]): void {
    this._flattenedData.next(nodes);
    this.setDataNodes(nodes);
  }

  connect(collectionViewer: CollectionViewer): Observable<F[]> {
    return merge(collectionViewer.viewChange, this._flattenedData.asObservable()).pipe(
      map(() => this.getFlattenData())
    );
  }

  disconnect(): void {
    // no op
  }

  private setDataNodes(nodes: F[]): void {
    this._tree.dataNodes = nodes;
  }

  private flatten(data: T[]): F[] {
    return this._treeFlattener.flattenNodes(data);
  }
}
