/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriSkeletonModule } from './skeleton.module';
import {
  TriSkeletonAvatar,
  TriSkeletonAvatarShape,
  TriSkeletonAvatarSize,
  TriSkeletonButtonShape,
  TriSkeletonButtonSize,
  TriSkeletonInputSize,
  TriSkeletonParagraph,
  TriSkeletonTitle
} from './skeleton.type';

describe('skeleton', () => {
  let fixture: ComponentFixture<TriTestSkeletonComponent>;
  let testComp: TriTestSkeletonComponent;
  let dl: DebugElement;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestSkeletonComponent);
    testComp = fixture.componentInstance;
    dl = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('#nzActive', () => {
    it('should active work', () => {
      expect(dl.nativeElement.querySelector('.ant-skeleton-active')).toBeFalsy();
      testComp.active = true;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-active')).toBeTruthy();
    });
  });

  describe('#nzTitle', () => {
    it('should basic width prop work', () => {
      expect(dl.nativeElement.querySelector('.ant-skeleton-title')).toBeFalsy();
      testComp.title = true;
      testComp.avatar = false;
      testComp.paragraph = true;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-title').style.width).toBe('38%');
      testComp.avatar = true;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-title').style.width).toBe('50%');
      testComp.paragraph = false;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-title').style.width).toBe('');
    });
    it('should customize width props work', () => {
      testComp.title = true;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-title').style.width).toBe('');
      testComp.title = { width: '50%' };
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-title').style.width).toBe('50%');
      testComp.title = { width: 200 };
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-title').style.width).toBe('200px');
    });
  });

  describe('#nzAvatar', () => {
    it('should basic avatar props work', () => {
      testComp.title = true;
      testComp.avatar = true;
      testComp.paragraph = false;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-avatar-square')).toBeTruthy();
      expect(dl.nativeElement.querySelector('.ant-skeleton-with-avatar')).toBeTruthy();
      testComp.paragraph = true;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-avatar-circle')).toBeTruthy();
    });
    for (const type of ['square', 'circle']) {
      it(`should customize shape ${type} work`, () => {
        testComp.avatar = { shape: type } as TriSkeletonAvatar;
        fixture.detectChanges();
        expect(dl.query(By.css(`.ant-skeleton-avatar-${type}`)) !== null).toBe(true);
      });
    }
    for (const type of [
      { size: 'large', cls: 'lg' },
      { size: 'small', cls: 'sm' }
    ]) {
      it(`should customize size ${type.size} work`, () => {
        testComp.avatar = { size: type.size } as TriSkeletonAvatar;
        fixture.detectChanges();
        expect(dl.query(By.css(`.ant-skeleton-avatar-${type.cls}`)) !== null).toBe(true);
      });
    }
  });

  describe('#nzParagraph', () => {
    it('should basic rows and width work', () => {
      testComp.title = true;
      testComp.avatar = true;
      testComp.paragraph = true;
      fixture.detectChanges();
      let paragraphs = dl.nativeElement.querySelectorAll('.ant-skeleton-paragraph > li');
      expect(paragraphs.length).toBe(2);
      expect(paragraphs[0].style.width).toBe('');
      expect(paragraphs[1].style.width).toBe('');
      testComp.avatar = false;
      fixture.detectChanges();
      paragraphs = dl.nativeElement.querySelectorAll('.ant-skeleton-paragraph > li');
      expect(paragraphs.length).toBe(3);
      expect(paragraphs[1].style.width).toBe('');
      expect(paragraphs[2].style.width).toBe('61%');
    });
    it('should width type is string or number work', () => {
      testComp.paragraph = { width: 100 };
      fixture.detectChanges();
      let paragraphs = dl.nativeElement.querySelectorAll('.ant-skeleton-paragraph > li');
      expect(paragraphs[0].style.width).toBe('');
      expect(paragraphs[1].style.width).toBe('100px');
      expect(paragraphs[2]).toBeFalsy();
      testComp.paragraph = { width: 100, rows: 3 };
      fixture.detectChanges();
      paragraphs = dl.nativeElement.querySelectorAll('.ant-skeleton-paragraph > li');
      expect(paragraphs[1].style.width).toBe('');
      expect(paragraphs[2].style.width).toBe('100px');
    });
    it('should define width type is Array work', () => {
      testComp.paragraph = { width: [200, '100px', '90%'] };
      fixture.detectChanges();
      let paragraphs = dl.nativeElement.querySelectorAll('.ant-skeleton-paragraph > li');
      expect(paragraphs[0].style.width).toBe('200px');
      expect(paragraphs[1].style.width).toBe('100px');
      expect(paragraphs[2]).toBeFalsy();
      testComp.paragraph = { width: [200, '100px', '90%'], rows: 4 };
      fixture.detectChanges();
      paragraphs = dl.nativeElement.querySelectorAll('.ant-skeleton-paragraph > li');
      expect(paragraphs[2].style.width).toBe('90%');
      expect(paragraphs[3].style.width).toBe('');
    });
  });

  describe('#nzRound', () => {
    it('should round work', () => {
      expect(dl.nativeElement.querySelector('.ant-skeleton-round')).toBeFalsy();
      testComp.round = true;
      fixture.detectChanges();
      expect(dl.nativeElement.querySelector('.ant-skeleton-round')).toBeTruthy();
    });
  });
});

describe('skeleton element', () => {
  let fixture: ComponentFixture<TriTestSkeletonElementComponent>;
  let testComp: TriTestSkeletonElementComponent;
  let dl: DebugElement;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestSkeletonElementComponent);
    testComp = fixture.componentInstance;
    dl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should nzActive work', () => {
    expect(dl.nativeElement.querySelector('.ant-skeleton-active')).toBeFalsy();
    testComp.active = true;
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-active')).toBeTruthy();
    testComp.useSuite = 4;
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-active')).toBeTruthy();
  });

  it('should nzSize work', () => {
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar-lg')).toBeFalsy();
    testComp.size = 'large';
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar-lg')).toBeTruthy();
    testComp.size = 40;
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar').style.width).toBe('40px');
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar').style.height).toBe('40px');
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar').style.lineHeight).toBe('40px');
    // number size only work in 'avatar' type
    testComp.useSuite = 2;
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-button').style.width).toBeFalsy();
  });

  it('should nzShape work', () => {
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar-circle')).toBeNull();
    testComp.shape = 'circle';
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar-circle')).toBeTruthy();
    testComp.shape = 'square';
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-avatar-square')).toBeTruthy();

    testComp.useSuite = 2;
    testComp.shape = 'round';
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('.ant-skeleton-button-round')).toBeTruthy();
  });

  it('should image svg work', () => {
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('svg')).toBeNull();
    testComp.useSuite = 4;
    fixture.detectChanges();
    expect(dl.nativeElement.querySelector('svg')).toBeTruthy();
  });
});

@Component({
  imports: [TriSkeletonModule],
  template: `
    <tri-skeleton
      [active]="active"
      [avatar]="avatar"
      [title]="title"
      [paragraph]="paragraph"
      [round]="round"
    ></tri-skeleton>
  `
})
export class TriTestSkeletonComponent {
  active: boolean = false;
  round: boolean = false;
  avatar: TriSkeletonAvatar | boolean = false;
  title: TriSkeletonTitle | boolean = false;
  paragraph: TriSkeletonParagraph | boolean = false;
}

@Component({
  imports: [TriSkeletonModule],
  template: `
    @switch (useSuite) {
      @case (1) {
        <tri-skeleton-element
          type="avatar"
          [active]="active"
          [size]="size"
          [shape]="$any(shape)"
        ></tri-skeleton-element>
      }
      @case (2) {
        <tri-skeleton-element
          type="button"
          [active]="active"
          [size]="$any(size)"
          [shape]="shape"
        ></tri-skeleton-element>
      }
      @case (3) {
        <tri-skeleton-element type="input" [active]="active" [size]="$any(size)"></tri-skeleton-element>
      }
      @case (4) {
        <tri-skeleton-element type="image" [active]="active"></tri-skeleton-element>
      }
    }
  `
})
export class TriTestSkeletonElementComponent {
  useSuite = 1;
  active: boolean = false;
  size: TriSkeletonAvatarSize | TriSkeletonButtonSize | TriSkeletonInputSize = 'default';
  shape: TriSkeletonAvatarShape | TriSkeletonButtonShape = 'default';
}
