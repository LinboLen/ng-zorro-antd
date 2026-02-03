/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Location } from '@angular/common';
import { Component, DebugElement, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriDemoPageHeaderBasicComponent } from './demo/basic';
import { TriDemoPageHeaderBreadcrumbComponent } from './demo/breadcrumb';
import { TriDemoPageHeaderContentComponent } from './demo/content';
import { TriDemoPageHeaderGhostComponent } from './demo/ghost';
import { TriDemoPageHeaderResponsiveComponent } from './demo/responsive';
import { TriPageHeaderComponent } from './page-header.component';

describe('page-header', () => {
  let location: Location;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideNzIconsTesting(), provideZoneChangeDetection()]
    });
    location = TestBed.inject(Location);
    spyOn(location, 'getState').and.returnValue({ navigationId: 2 });
  });

  it('should basic work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderBasicComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.classList).toContain('ant-page-header');
    expect(pageHeader.nativeElement.classList).toContain('ant-page-header-ghost');
    expect(pageHeader.nativeElement.querySelector('.ant-page-header-heading-title')).toBeTruthy();
    expect(pageHeader.nativeElement.querySelector('.ant-page-header-heading-sub-title')).toBeTruthy();
  });

  it('should displayed the back button if nzBack has observer', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderBasicComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back-button');
    expect(back).toBeTruthy();
  });

  it('should ghost work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderGhostComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.classList).toContain('ant-page-header');
    expect(pageHeader.nativeElement.classList).not.toContain('ant-page-header-ghost');
  });

  it('should breadcrumb work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderBreadcrumbComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.classList).toContain('has-breadcrumb');
    expect(pageHeader.nativeElement.querySelector('nz-breadcrumb[nz-page-header-breadcrumb]')).toBeTruthy();
  });

  it('should default call location back when nzBack not has observers', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderResponsiveComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    spyOn(location, 'back');
    fixture.detectChanges();
    expect(location.back).not.toHaveBeenCalled();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back');
    (back as HTMLElement).click();
    fixture.detectChanges();
    expect(location.back).toHaveBeenCalled();
  });

  it('should not show the back button if there is no history of navigation', fakeAsync(() => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderResponsiveComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    spyOn(location, 'getState').and.returnValue({ navigationId: 1 });
    fixture.detectChanges();
    pageHeader.componentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back-button');
    expect(back).toBeNull();
  }));

  it('should show the back button if there is history of navigation', fakeAsync(() => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderResponsiveComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    pageHeader.componentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back-button');
    expect(back as HTMLDivElement).toBeTruthy();
  }));

  it('should content work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderContentComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    const content = pageHeader.nativeElement.querySelector('nz-page-header-content.ant-page-header-content');
    expect(content).toBeTruthy();
    expect((content as HTMLElement).children.length > 0).toBe(true);
  });

  it('should actions work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderContentComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.querySelector('nz-page-header-extra.ant-page-header-heading-extra')).toBeTruthy();
    expect(pageHeader.nativeElement.querySelector('nz-page-header-tags.ant-page-header-heading-tags')).toBeTruthy();
  });

  it('should footer work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderResponsiveComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.classList).toContain('has-footer');
    expect(pageHeader.nativeElement.querySelector('nz-page-header-footer.ant-page-header-footer')).toBeTruthy();
  });

  it('should avatar work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderContentComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.querySelector('nz-avatar[nz-page-header-avatar]')).toBeTruthy();
  });

  it('should have an default back icon', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderBasicComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.querySelector('.ant-page-header-back .anticon-arrow-left')).toBeTruthy();
  });

  it('should does not have an default back icon', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderContentComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.detectChanges();
    expect(pageHeader.nativeElement.querySelector('.ant-page-header-back')).toBeFalsy();
  });

  it('should nzBack work', () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderBasicComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    const context = fixture.componentInstance;
    spyOn(context, 'onBack');
    fixture.detectChanges();
    expect(context.onBack).not.toHaveBeenCalled();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back');
    (back as HTMLElement).click();
    fixture.detectChanges();
    expect(context.onBack).toHaveBeenCalled();
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriDemoPageHeaderRtlComponent>;
    let pageHeader: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriDemoPageHeaderRtlComponent);
      pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(pageHeader.nativeElement.classList).toContain('ant-page-header-rtl');
    });

    it('should className correct after change Dir', () => {
      fixture.detectChanges();
      expect(pageHeader.nativeElement.classList).toContain('ant-page-header-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();

      expect(pageHeader.nativeElement.classList).not.toContain('ant-page-header-rtl');
    });

    it('should have an default back icon', () => {
      fixture.detectChanges();
      expect(pageHeader.nativeElement.querySelector('.ant-page-header-back .anticon-arrow-right')).toBeTruthy();
    });
  });
});

@Component({
  imports: [BidiModule, TriDemoPageHeaderBasicComponent],
  template: `
    <div [dir]="direction">
      <tri-demo-page-header-basic />
    </div>
  `
})
export class TriDemoPageHeaderRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
