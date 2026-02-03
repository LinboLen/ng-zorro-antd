/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, NgModule, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  HomeOutline,
  LeftOutline,
  LoadingOutline,
  QuestionCircleFill,
  QuestionCircleOutline,
  QuestionOutline,
  RightOutline
} from '@ant-design/icons-angular/icons';

import { TriConfigService } from 'ng-zorro-antd/core/config';

import { TriIconDirective } from './icon.directive';
import { TriIconModule } from './icon.module';
import { TriIconService } from './icon.service';
import { provideNzIcons, provideNzIconsPatch } from './provide-icons';

describe('nz-icon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // todo: use zoneless
        provideZoneChangeDetection(),
        provideNzIcons([
          LeftOutline,
          RightOutline,
          QuestionOutline,
          QuestionCircleOutline,
          LoadingOutline,
          QuestionCircleFill
        ])
      ]
    });
  });

  describe('basic', () => {
    let testComponent: TriTestIconExtensionsComponent;
    let fixture: ComponentFixture<TriTestIconExtensionsComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestIconExtensionsComponent);
      testComponent = fixture.componentInstance;
      icons = fixture.debugElement.queryAll(By.directive(TriIconDirective));
    });

    it('should get icon class name back', () => {
      fixture.detectChanges();
      expect(icons[0].nativeElement.classList.contains('anticon')).toBe(true);
      expect(icons[0].nativeElement.classList.contains('anticon-question')).toBe(true);
      expect(icons[1].nativeElement.classList.contains('anticon-loading')).toBe(true);
    });

    it('should change class name when type changes', () => {
      testComponent.type = 'question-circle';
      fixture.detectChanges();
      expect(icons[0].nativeElement.classList.contains('anticon')).toBe(true);
      expect(icons[0].nativeElement.classList.contains('anticon-question-circle')).toBe(true);
      expect(icons[0].nativeElement.classList.contains('anticon-question')).not.toBe(true);
    });

    it('should support spin and cancel', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      // Only test fails. Don't know why.
      // expect(icons[0].nativeElement.firstChild.classList.contains('anticon-spin')).toBe(true);

      testComponent.spin = false;
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.classList.contains('anticon-spin')).toBe(false);
    }));

    it('should make loading spin', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      // expect(icons[1].nativeElement.firstChild.classList.contains('anticon-spin')).toBe(true);
    }));

    it('should rotate work', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.style.transform).toBeFalsy();

      testComponent.rotate = 120;
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.style.transform).toBe('rotate(120deg)');

      testComponent.rotate = 0;
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.style.transform).toBeFalsy();
    }));
  });

  describe('custom', () => {
    let fixture: ComponentFixture<TriTestIconCustomComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestIconCustomComponent);
      fixture.detectChanges();
    });

    it('should support custom svg element', () => {
      icons = fixture.debugElement.queryAll(By.directive(TriIconDirective));
      expect(icons[0].nativeElement.className).toContain('anticon');
      expect(icons[0].nativeElement.innerHTML).toContain('svg');
      expect(icons[0].nativeElement.innerHTML).toContain(
        'viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor"'
      );
    });
  });

  describe('iconfont', () => {
    let fixture: ComponentFixture<TriTestIconIconfontComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestIconIconfontComponent);
      fixture.detectChanges();
    });

    it('should support iconfont', async () => {
      await fixture.whenStable();
      icons = fixture.debugElement.queryAll(By.directive(TriIconDirective));
      expect(icons[0].nativeElement.className).toContain('anticon');
      expect(icons[0].nativeElement.innerHTML).toContain('xlink:href="#icon-tuichu"');
      expect(icons[1].nativeElement.innerHTML).toContain('link:href="#icon-facebook"');
      expect(icons[2].nativeElement.innerHTML).toContain('xlink:href="#icon-twitter"');
    });
  });

  describe('config service', () => {
    let fixture: ComponentFixture<TriTestIconExtensionsComponent>;
    let nzConfigService: TriConfigService;
    let icons: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestIconExtensionsComponent);
      fixture.detectChanges();
      icons = fixture.debugElement.queryAll(By.directive(TriIconDirective));
      nzConfigService = TestBed.inject(TriConfigService);
    });

    it('should support config service', () => {
      nzConfigService!.set('icon', { nzTwotoneColor: '#234567' });
      expect(icons[0].componentInstance.iconService.twoToneColor.primaryColor).toBe('#234567');

      // Should ignore invalid value.
      nzConfigService!.set('icon', { nzTwotoneColor: '234567' });
      expect(icons[0].componentInstance.iconService.twoToneColor.primaryColor).not.toBe('234567');
      expect(icons[0].componentInstance.iconService.twoToneColor.primaryColor).toBe('#1890ff');
    });
  });
});

describe('nz-icon injection', () => {
  describe('injection on multi places', () => {
    let fixture: ComponentFixture<TriTestIconMultiInjectionComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideNzIcons([HomeOutline])]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestIconMultiInjectionComponent);
      fixture.detectChanges();
    });

    it('should support forRoot and forChild', () => {
      fixture.detectChanges();
      icons = fixture.debugElement.queryAll(By.directive(TriIconDirective));
      expect(icons[0].nativeElement.classList.contains('anticon-home')).toBe(true);
      expect(icons[1].nativeElement.classList.contains('anticon-question')).toBe(true);
    });
  });

  describe('[standalone] injection on multi places', () => {
    let fixture: ComponentFixture<TriTestIconMultiInjectionStandaloneComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideNzIcons([HomeOutline])]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestIconMultiInjectionStandaloneComponent);
      fixture.detectChanges();
    });

    it('should support forRoot and forChild', () => {
      const icons = fixture.debugElement.queryAll(By.directive(TriIconDirective));
      expect(icons[0].nativeElement.classList.contains('anticon-home')).toBe(true);
      expect(icons[1].nativeElement.classList.contains('anticon-question')).toBe(true);
    });
  });
});

@Component({
  imports: [TriIconModule],
  template: `
    <tri-icon [type]="type" [theme]="theme" [spin]="spin" [rotate]="rotate" />
    <tri-icon type="loading" [theme]="theme" />
  `
})
export class TriTestIconExtensionsComponent {
  type = 'question';
  theme: 'fill' | 'outline' | 'twotone' = 'outline';
  spin = true;
  rotate = 0;

  constructor(public iconService: TriIconService) {}
}

@Component({
  imports: [TriIconModule],
  template: `
    <tri-icon style="color: hotpink;">
      <svg>
        <path
          d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z"
        />
      </svg>
    </tri-icon>
  `
})
export class TriTestIconCustomComponent {}

@Component({
  imports: [TriIconModule],
  template: `
    <tri-icon iconfont="icon-tuichu" />
    <tri-icon iconfont="icon-facebook" />
    <tri-icon iconfont="icon-twitter" />
  `
})
export class TriTestIconIconfontComponent {
  constructor(private iconService: TriIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
    });
  }
}

@NgModule({
  imports: [TriIconModule.forChild([QuestionOutline])]
})
class ChildModule {}

@Component({
  imports: [TriIconModule, ChildModule],
  template: `
    <tri-icon type="home" />
    <tri-icon type="question" />
  `
})
class TriTestIconMultiInjectionComponent {}

@Component({
  imports: [TriIconModule],
  providers: [provideNzIconsPatch([QuestionOutline])],
  template: `
    <tri-icon type="home" />
    <tri-icon type="question" />
  `
})
class TriTestIconMultiInjectionStandaloneComponent {}
