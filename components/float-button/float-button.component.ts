/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriButtonModule } from 'ng-zorro-antd/button';

import { TriFloatButtonContentComponent } from './float-button-content.component';

@Component({
  selector: 'tri-float-button',
  exportAs: 'triFloatButton',
  imports: [TriButtonModule, TriFloatButtonContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!!href) {
      <a
        [target]="target"
        [href]="href"
        tri-button
        [type]="type"
        [class.tri-float-btn-default]="type === 'default'"
        class="tri-float-btn-inner"
        (click)="onClick.emit(true)"
      >
        <tri-float-button-content
          [icon]="icon"
          [description]="description"
          [shape]="shape"
        ></tri-float-button-content>
      </a>
    } @else {
      <button
        tri-button
        [type]="type"
        [class.tri-float-btn-default]="type === 'default'"
        class="tri-float-btn-inner"
        (click)="onClick.emit(true)"
      >
        <tri-float-button-content
          [icon]="icon"
          [description]="description"
          [shape]="shape"
        ></tri-float-button-content>
      </button>
    }
  `,
  host: {
    class: 'tri-float-btn',
    '[class.tri-float-btn-circle]': `shape === 'circle'`,
    '[class.tri-float-btn-square]': `shape === 'square'`,
    '[class.tri-float-btn-rtl]': `dir === 'rtl'`
  }
})
export class TriFloatButtonComponent implements OnInit {
  private directionality = inject(Directionality);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @Input() href: string | null = null;
  @Input() target: string | null = null;
  @Input() type: 'default' | 'primary' = 'default';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() icon: TemplateRef<void> | null = null;
  @Input() description: TemplateRef<void> | string | null = null;
  @Output() readonly onClick = new EventEmitter<boolean>();
  dir: Direction = 'ltr';

  constructor() {
    this.dir = this.directionality.value;
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }
}
