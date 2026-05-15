/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { inject, Pipe, PipeTransform } from '@angular/core';

import { TriTreeNode } from 'ng-zorro-antd/tree';

import { TriCascaderTreeService } from './cascader-tree.service';
import { TriCascaderService } from './cascader.service';
import { TriCascaderOption, TriDisplayRenderContext } from './typings';

export const defaultDisplayRender = (labels: string[]): string => labels.join(' / ');

@Pipe({
  name: 'nzDisplayRender'
})
export class TriDisplayRenderPipe implements PipeTransform {
  private cascaderService = inject(TriCascaderService);
  private cascaderTreeService = inject(TriCascaderTreeService);

  transform(node: TriTreeNode, deprecatedDisplayWith?: (nodes: TriCascaderOption[]) => string | undefined): string {
    const ancestors = this.cascaderTreeService.getAncestorNodeList(node);
    const selectedOptions = this.cascaderTreeService.toOptions(ancestors);
    const labels = selectedOptions.map(o => this.cascaderService.getOptionLabel(o));
    return deprecatedDisplayWith ? deprecatedDisplayWith(selectedOptions)! : defaultDisplayRender(labels);
  }
}

@Pipe({
  name: 'nzDisplayRenderContext'
})
export class TriDisplayRenderContextPipe implements PipeTransform {
  private cascaderService = inject(TriCascaderService);
  private cascaderTreeService = inject(TriCascaderTreeService);

  transform(node: TriTreeNode): TriDisplayRenderContext {
    const ancestors = this.cascaderTreeService.getAncestorNodeList(node);
    const selectedOptions = this.cascaderTreeService.toOptions(ancestors);
    const labels = selectedOptions.map(o => this.cascaderService.getOptionLabel(o));
    return {
      labels,
      selectedOptions
    };
  }
}
