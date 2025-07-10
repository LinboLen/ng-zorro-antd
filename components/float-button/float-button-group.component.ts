/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { fadeMotion } from 'ng-zorro-antd/core/animation';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriFloatButtonTopComponent } from './float-button-top.component';
import { TriFloatButtonComponent } from './float-button.component';

@Component({
  selector: '',
  exportAs: 'triFloatButtonGroup',
  imports: [TriFloatButtonComponent, TriIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeMotion],
  template: `
    @if (!trigger || isOpen || open === true) {
      <div [class.tri-float-btn-group-wrap]="!!trigger" @fadeMotion><ng-content></ng-content></div>
    }
    @if (!!trigger) {
      @if (!isOpen && !open) {
        <tri-float-button
          [type]="type"
          [icon]="icon"
          [shape]="shape"
          [description]="description"
          (onClick)="clickOpenMenu()"
          (mouseover)="hoverOpenMenu()"
        ></tri-float-button>
      } @else {
        <tri-float-button
          [type]="type"
          [icon]="close"
          [shape]="shape"
          (onClick)="clickCloseMenu()"
        ></tri-float-button>
      }
    }
    <ng-template #close>
      <tri-icon type="close" theme="outline" />
    </ng-template>
  `,
  host: {
    class: 'tri-float-btn-group',
    '(mouseleave)': 'hoverCloseMenu()',
    '[class.tri-float-btn-group-circle]': `shape === 'circle'`,
    '[class.tri-float-btn-group-circle-shadow]': `shape === 'circle'`,
    '[class.tri-float-btn-group-square]': `shape === 'square'`,
    '[class.tri-float-btn-group-square-shadow]': `shape === 'square' && !trigger`,
    '[class.tri-float-btn-group-rtl]': `dir === 'rtl'`
  }
})
export class TriFloatButtonGroupComponent implements OnInit, AfterContentInit {
  private directionality = inject(Directionality);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ContentChildren(TriFloatButtonComponent) floatButtonComponent!: QueryList<TriFloatButtonComponent>;
  @ContentChildren(TriFloatButtonTopComponent) floatButtonTopComponents!: QueryList<TriFloatButtonTopComponent>;
  @Input() href: string | null = null;
  @Input() target: string | null = null;
  @Input() type: 'default' | 'primary' = 'default';
  @Input() icon: TemplateRef<void> | null = null;
  @Input() description: TemplateRef<void> | null = null;

  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() trigger: 'click' | 'hover' | null = null;
  @Input() open: boolean | null = null;
  @Output() readonly onOpenChange = new EventEmitter<boolean>();
  isOpen: boolean = false;
  dir: Direction = 'ltr';

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngAfterContentInit(): void {
    if (this.floatButtonComponent) {
      this.floatButtonComponent.forEach(item => {
        item.shape = this.shape;
      });
    }
    if (this.floatButtonTopComponents) {
      this.floatButtonTopComponents.forEach(item => {
        item.shape = this.shape;
        item.detectChanges();
      });
    }
  }

  clickOpenMenu(): void {
    if (this.trigger !== 'click' || this.open !== null) {
      return;
    }
    this.isOpen = true;
    this.onOpenChange.emit(true);
    this.cdr.markForCheck();
  }

  hoverOpenMenu(): void {
    if (this.trigger !== 'hover' || this.open !== null) {
      return;
    }
    this.isOpen = true;
    this.onOpenChange.emit(true);
    this.cdr.markForCheck();
  }

  clickCloseMenu(): void {
    if (this.trigger !== 'click') {
      return;
    }
    this.isOpen = false;
    this.onOpenChange.emit(false);
    this.cdr.markForCheck();
  }

  hoverCloseMenu(): void {
    if (this.trigger !== 'hover' || typeof this.open === 'boolean') {
      return;
    }
    this.isOpen = false;
    this.onOpenChange.emit(false);
    this.cdr.markForCheck();
  }
}
