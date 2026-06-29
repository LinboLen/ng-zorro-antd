/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { testDirectionality } from 'ng-zorro-antd/core/testing';
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
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation(), provideNzIconsTesting()]
    });
    location = TestBed.inject(Location);
    vi.spyOn(location, 'getState').mockReturnValue({ navigationId: 2 });
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
    vi.spyOn(location, 'back');
    fixture.detectChanges();
    expect(location.back).not.toHaveBeenCalled();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back');
    (back as HTMLElement).click();
    fixture.detectChanges();
    expect(location.back).toHaveBeenCalled();
  });

  it('should not show the back button if there is no history of navigation', async () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderResponsiveComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    vi.spyOn(location, 'getState').mockReturnValue({ navigationId: 1 });
    fixture.autoDetectChanges();
    pageHeader.componentInstance.ngAfterViewInit();
    await fixture.whenStable();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back-button');
    expect(back).toBeNull();
  });

  it('should show the back button if there is history of navigation', async () => {
    const fixture = TestBed.createComponent(TriDemoPageHeaderResponsiveComponent);
    const pageHeader = fixture.debugElement.query(By.directive(TriPageHeaderComponent));
    fixture.autoDetectChanges();
    pageHeader.componentInstance.ngAfterViewInit();
    await fixture.whenStable();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back-button');
    expect(back as HTMLDivElement).toBeTruthy();
  });

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
    vi.spyOn(context, 'onBack');
    fixture.detectChanges();
    expect(context.onBack).not.toHaveBeenCalled();
    const back = pageHeader.nativeElement.querySelector('.ant-page-header-back');
    (back as HTMLElement).click();
    fixture.detectChanges();
    expect(context.onBack).toHaveBeenCalled();
  });
});

testDirectionality(() => TriDemoPageHeaderBasicComponent, By.directive(TriPageHeaderComponent), 'ant-page-header', {
  providers: [provideNzNoAnimation(), provideNzIconsTesting()]
});
