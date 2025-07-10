/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { TriConfigService } from 'ng-zorro-antd/core/config';
import { TriSizeDSType } from 'ng-zorro-antd/core/types';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriCardComponent } from './card.component';
import { TriCardModule } from './card.module';
import { TriDemoCardBasicComponent } from './demo/basic';
import { TriDemoCardBorderLessComponent } from './demo/border-less';
import { TriDemoCardFlexibleContentComponent } from './demo/flexible-content';
import { TriDemoCardGridCardComponent } from './demo/grid-card';
import { TriDemoCardInColumnComponent } from './demo/in-column';
import { TriDemoCardInnerComponent } from './demo/inner';
import { TriDemoCardLoadingComponent } from './demo/loading';
import { TriDemoCardMetaComponent } from './demo/meta';
import { TriDemoCardSimpleComponent } from './demo/simple';
import { TriDemoCardTabsComponent } from './demo/tabs';

describe('card', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideNzIconsTesting()],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));
  it('should basic work', () => {
    const fixture = TestBed.createComponent(TriDemoCardBasicComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).toContain('ant-card');
    expect(card.nativeElement.classList).toContain('ant-card-bordered');
    expect(card.nativeElement.querySelector('.ant-card-head-title').innerText).toBe('Card title');
    expect(card.nativeElement.querySelector('.ant-card-extra').innerText).toBe('More');
  });
  it('should border-less work', () => {
    const fixture = TestBed.createComponent(TriDemoCardBorderLessComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).toContain('ant-card');
    expect(card.nativeElement.classList).not.toContain('ant-card-bordered');
  });
  it('should simple work', () => {
    const fixture = TestBed.createComponent(TriDemoCardSimpleComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.firstElementChild!.classList).toContain('ant-card-body');
  });
  it('should flexible content work', () => {
    const fixture = TestBed.createComponent(TriDemoCardFlexibleContentComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).toContain('ant-card-hoverable');
    expect(card.nativeElement.firstElementChild!.classList).toContain('ant-card-cover');
    expect(card.nativeElement.querySelector('.ant-card-meta-title').innerText).toBe('Europe Street beat');
    expect(card.nativeElement.querySelector('.ant-card-meta-description').innerText).toBe('www.instagram.com');
  });
  it('should in column work', () => {
    const fixture = TestBed.createComponent(TriDemoCardInColumnComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).toContain('ant-card');
  });
  it('should loading work', () => {
    const fixture = TestBed.createComponent(TriDemoCardLoadingComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).toContain('ant-card-loading');
    const skeleton = card.nativeElement.querySelector('nz-skeleton');
    expect(skeleton).toBeTruthy();
    expect(skeleton.classList).toContain('ant-skeleton-active');
  });
  it('should grid work', () => {
    const fixture = TestBed.createComponent(TriDemoCardGridCardComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).toContain('ant-card-contain-grid');
    expect(card.nativeElement.querySelector('.ant-card-body').firstElementChild!.classList).toContain('ant-card-grid');
  });
  it('should inner work', () => {
    const fixture = TestBed.createComponent(TriDemoCardInnerComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).not.toContain('ant-card-type-inner');
    expect(card.nativeElement.querySelectorAll('.ant-card-type-inner').length).toBe(2);
  });
  it('should card work', () => {
    const fixture = TestBed.createComponent(TriDemoCardTabsComponent);
    const cards = fixture.debugElement.queryAll(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(cards[0].nativeElement.classList).toContain('ant-card-contain-tabs');
    expect(cards[0].nativeElement.firstElementChild.firstElementChild!.classList).toContain('ant-card-head-wrapper');
    expect(cards[1].nativeElement.classList).toContain('ant-card-contain-tabs');
    expect(cards[1].nativeElement.firstElementChild.firstElementChild!.classList).toContain('ant-card-head-wrapper');
  });
  it('should meta work', () => {
    const fixture = TestBed.createComponent(TriDemoCardMetaComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.querySelector('.ant-card-actions').children.length).toBe(3);
  });
  it('should size work', () => {
    const fixture = TestBed.createComponent(TestCardSizeComponent);
    const card = fixture.debugElement.query(By.directive(TriCardComponent));
    fixture.detectChanges();
    expect(card.nativeElement.classList).not.toContain('ant-card-small');
    fixture.componentInstance.size = 'small';
    fixture.detectChanges();
    expect(card.nativeElement.classList).toContain('ant-card-small');
  });

  describe('RTL', () => {
    it('should card className correct on dir change', () => {
      const fixture = TestBed.createComponent(TriTestCardRtlComponent);
      const card = fixture.debugElement.query(By.directive(TriCardComponent));
      fixture.detectChanges();
      expect(card.nativeElement.classList).toContain('ant-card-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(card.nativeElement.classList).not.toContain('ant-card-rtl');
    });
  });
});

@Component({
  imports: [TriCardModule],
  template: `
    <tri-card [size]="size">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </tri-card>
  `
})
class TestCardSizeComponent {
  size: TriSizeDSType = 'default';
}

@Component({
  imports: [BidiModule, TriCardModule],
  template: `
    <div [dir]="direction">
      <tri-card>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </tri-card>
    </div>
  `
})
export class TriTestCardRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

describe('card component', () => {
  let fixture: ComponentFixture<TriCardComponent>;
  let component: TriCardComponent;
  let configChangeEvent$: Subject<void>;

  beforeEach(() => {
    configChangeEvent$ = new Subject<void>();
    const nzConfigServiceSpy = jasmine.createSpyObj('NzConfigService', {
      getConfigChangeEventForComponent: configChangeEvent$.asObservable(),
      getConfigForComponent: {}
    });

    TestBed.configureTestingModule({
      imports: [TriCardModule, TriCardModule],
      providers: [{ provide: TriConfigService, useValue: nzConfigServiceSpy }]
    });

    fixture = TestBed.createComponent(TriCardComponent);
    component = fixture.componentInstance;
  });

  it('should call markForCheck when changing nzConfig', fakeAsync(() => {
    spyOn(component['cdr'], 'markForCheck');
    fixture.detectChanges();
    configChangeEvent$.next();
    tick();
    expect(component['cdr'].markForCheck).toHaveBeenCalled();
  }));
});
