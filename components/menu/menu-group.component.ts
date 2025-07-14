/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

import { TriIsMenuInsideDropDownToken } from './menu.token';

export function MenuGroupFactory(): boolean {
  const isMenuInsideDropDownToken = inject(TriIsMenuInsideDropDownToken, { optional: true, skipSelf: true });
  return isMenuInsideDropDownToken ?? false;
}
@Component({
  selector: '[tri-menu-group]',
  exportAs: 'triMenuGroup',
  providers: [
    /** check if menu inside dropdown-menu component **/
    {
      provide: TriIsMenuInsideDropDownToken,
      useFactory: MenuGroupFactory
    }
  ],
  template: `
    <div
      [class.tri-menu-item-group-title]="!isMenuInsideDropDown"
      [class.tri-dropdown-menu-item-group-title]="isMenuInsideDropDown"
      #titleElement
    >
      <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
      @if (!title) {
        <ng-content select="[title]" />
      }
    </div>
    <ng-content></ng-content>
  `,
  imports: [TriOutletModule],
  host: {
    '[class.tri-menu-item-group]': '!isMenuInsideDropDown',
    '[class.tri-dropdown-menu-item-group]': 'isMenuInsideDropDown'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriMenuGroupComponent implements AfterViewInit {
  private readonly renderer = inject(Renderer2);
  protected readonly isMenuInsideDropDown = inject(TriIsMenuInsideDropDownToken);

  @Input() title?: string | TemplateRef<void>;
  @ViewChild('titleElement') titleElement?: ElementRef;

  ngAfterViewInit(): void {
    const ulElement = this.titleElement!.nativeElement.nextElementSibling;
    if (ulElement) {
      /** add classname to ul **/
      const className = this.isMenuInsideDropDown ? 'ant-dropdown-menu-item-group-list' : 'ant-menu-item-group-list';
      this.renderer.addClass(ulElement, className);
    }
  }
}
