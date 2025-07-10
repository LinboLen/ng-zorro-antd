/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { TriMentionTriggerDirective } from './mention-trigger';

@Injectable()
export class TriMentionService {
  private trigger?: TriMentionTriggerDirective;
  private triggerChange$ = new Subject<TriMentionTriggerDirective>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.triggerChange$.complete();
    });
  }

  triggerChanged(): Observable<TriMentionTriggerDirective> {
    return this.triggerChange$.asObservable();
  }

  registerTrigger(trigger: TriMentionTriggerDirective): void {
    if (this.trigger !== trigger) {
      this.trigger = trigger;
      this.triggerChange$.next(trigger);
    }
  }
}
