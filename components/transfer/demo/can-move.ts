import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TriTransferModule, TransferCanMove, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-can-move',
  imports: [TriTransferModule],
  template: `
    <tri-transfer
      [dataSource]="list"
      [canMove]="canMove"
      (selectChange)="select($event)"
      (change)="change($event)"
    />
  `
})
export class TriDemoTransferCanMoveComponent {
  readonly list: TransferItem[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    disabled: i % 3 < 1,
    direction: [2, 3].includes(i) ? 'right' : undefined
  }));

  canMove(arg: TransferCanMove): Observable<TransferItem[]> {
    if (arg.direction === 'right' && arg.list.length > 0) {
      arg.list.splice(0, 1);
    }
    // or
    // if (arg.direction === 'right' && arg.list.length > 0) delete arg.list[0];
    return of(arg.list).pipe(delay(1000));
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: {}): void {
    console.log('nzChange', ret);
  }
}
