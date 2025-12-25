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
  DestroyRef,
  ElementRef,
  EventEmitter,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  type AnimationCallbackEvent
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

import { TriNoAnimationDirective, slideAnimationEnter, slideAnimationLeave } from 'ng-zorro-antd/core/animation';
import { IndexableObject, TriSafeAny } from 'ng-zorro-antd/core/types';
import { MenuService, TriIsMenuInsideDropdownToken } from 'ng-zorro-antd/menu';

export type TriPlacementType = 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';

@Component({
  selector: `nz-dropdown-menu`,
  exportAs: `nzDropdownMenu`,
  providers: [
    MenuService,
    /** menu is inside dropdown-menu component **/
    {
      provide: TriIsMenuInsideDropdownToken,
      useValue: true
    }
  ],
  template: `
    <ng-template>
      <div
        class="tri-dropdown"
        [class.tri-dropdown-rtl]="dir === 'rtl'"
        [class.tri-dropdown-show-arrow]="arrow"
        [class.tri-dropdown-placement-bottomLeft]="placement === 'bottomLeft'"
        [class.tri-dropdown-placement-bottomRight]="placement === 'bottomRight'"
        [class.tri-dropdown-placement-bottom]="placement === 'bottom'"
        [class.tri-dropdown-placement-topLeft]="placement === 'topLeft'"
        [class.tri-dropdown-placement-topRight]="placement === 'topRight'"
        [class.tri-dropdown-placement-top]="placement === 'top'"
        [class]="overlayClassName"
        [style]="overlayStyle"
        [animate.enter]="dropdownAnimationEnter()"
        [animate.leave]="dropdownAnimationLeave()"
        (animate.leave)="onAnimationEvent($event)"
        [noAnimation]="!!noAnimation?.nzNoAnimation?.()"
        (mouseenter)="setMouseState(true)"
        (mouseleave)="setMouseState(false)"
      >
        @if (arrow) {
          <div class="tri-dropdown-arrow"></div>
        }
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriNoAnimationDirective]
})
export class TriDropdownMenuComponent implements AfterContentInit, OnInit {
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  public viewContainerRef = inject(ViewContainerRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });
  public menuService = inject(MenuService);

  isChildSubMenuOpen$ = this.menuService.isChildSubMenuOpen$;
  descendantMenuItemClick$ = this.menuService.descendantMenuItemClick$;
  mouseState$ = new BehaviorSubject<boolean>(false);
  animationStateChange$ = new EventEmitter<AnimationCallbackEvent>();
  @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<TriSafeAny>;

  overlayClassName: string = '';
  overlayStyle: IndexableObject = {};
  arrow: boolean = false;
  placement: TriPlacementType | 'bottom' | 'top' = 'bottomLeft';
  dir: Direction = 'ltr';

  protected readonly dropdownAnimationEnter = slideAnimationEnter();
  protected readonly dropdownAnimationLeave = slideAnimationLeave();

  onAnimationEvent(event: AnimationCallbackEvent): void {
    const element = event.target as HTMLElement;
    const onAnimationEnd = (): void => {
      element.removeEventListener('animationend', onAnimationEnd);
      this.animationStateChange$.emit(event);
    };
    element.addEventListener('animationend', onAnimationEnd);
  }

  setMouseState(visible: boolean): void {
    this.mouseState$.next(visible);
  }

  setValue<T extends keyof TriDropdownMenuComponent>(key: T, value: this[T]): void {
    this[key] = value;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngAfterContentInit(): void {
    this.renderer.removeChild(this.renderer.parentNode(this.elementRef.nativeElement), this.elementRef.nativeElement);
  }
}
