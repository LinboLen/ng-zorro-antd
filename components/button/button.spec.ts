/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { ApplicationRef, Component, Input, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriButtonComponent, TriButtonModule, TriButtonShape, TriButtonSize, TriButtonType } from './index';

describe('button', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
  });

  describe('className', () => {
    let fixture: ComponentFixture<TestButtonComponent>;
    let component: TestButtonComponent;
    let buttonElement: HTMLButtonElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonComponent);
      component = fixture.componentInstance;
      buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    });

    it('should apply classname', () => {
      expect(buttonElement.className).toBe('ant-btn');
    });

    it('should apply classname based on nzDanger', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-dangerous');
      component.danger = true;
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-dangerous');
    });

    it('should apply classname based on nzGhost', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-background-ghost');
      component.ghost = true;
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-background-ghost');
    });

    it('should apply classname based on nzSearch', () => {
      expect(buttonElement.classList).not.toContain('ant-input-search-button');
      component.search = true;
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-input-search-button');
    });

    it('should apply classname based on nzLoading', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-loading');
      component.loading = true;
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-loading');
    });

    it('should apply classname based on nzBlock', () => {
      expect(buttonElement.classList).not.toContain('ant-btn-block');
      component.block = true;
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-block');
    });

    it('should apply classname based on nzType', () => {
      component.type = 'default';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-default');
      component.type = 'primary';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-primary');
      component.type = 'link';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-link');
      component.type = 'dashed';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-dashed');
      component.type = null;
      fixture.detectChanges();
      expect(buttonElement.className).toBe('ant-btn');
    });

    it('should apply classname based on nzShape', () => {
      component.shape = 'round';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-round');
      component.shape = 'circle';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-circle');
    });

    it('should apply classname based on nzSize', () => {
      component.size = 'large';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-lg');
      component.size = 'small';
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-sm');
      component.size = 'default';
      fixture.detectChanges();
      expect(buttonElement.className).toBe('ant-btn');
    });
  });

  describe('loading icon', () => {
    let fixture: ComponentFixture<TestButtonBindingComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonBindingComponent);
    });

    it('should hide icon when loading correct', fakeAsync(() => {
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      expect(buttonElement.classList.contains('ant-btn-loading')).toBe(false);
      expect(buttonElement.classList).not.toContain('ant-btn-icon-only');
      expect(buttonElement.firstElementChild.querySelector('svg')).not.toBe(null);
      expect(buttonElement.firstElementChild!.classList.contains('anticon-poweroff')).toBe(true);
      expect(buttonElement.firstElementChild!.classList.contains('anticon-loading')).toBe(false);
      buttonElement.click();
      fixture.detectChanges();
      expect(buttonElement.classList.contains('ant-btn-loading')).toBe(true);
      expect(buttonElement.firstElementChild!.classList.contains('ant-btn-loading-icon')).toBe(true);
      expect(buttonElement.querySelector('.anticon-poweroff').style.cssText).toBe('display: none;');
      tick(1000);
      fixture.detectChanges();
      expect(buttonElement.classList.contains('ant-btn-loading')).toBe(false);
      expect(buttonElement.firstElementChild!.classList.contains('ant-btn-loading-icon')).toBe(false);
      expect(buttonElement.querySelector('.anticon-poweroff').style.cssText).toBe('');
    }));
  });

  describe('insert span', () => {
    let fixture: ComponentFixture<TestButtonWithIconComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonWithIconComponent);
    });

    it('should insert span correctly', () => {
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.detectChanges();
      expect(buttonElement.firstElementChild.tagName).toBe('SPAN');
      expect(buttonElement.firstElementChild.innerText).toContain('text');
    });
  });

  describe('icon only', () => {
    it('should icon only works correctly', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly with any tag', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithAnyTagComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly with any comments', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithCommentComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly with any text', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithTextComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).not.toContain('ant-btn-icon-only');
    });

    it('should icon only works correctly without nz-icon', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyWithoutIconComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).not.toContain('ant-btn-icon-only');
    });

    it('should icon only loading works correctly', async () => {
      const fixture = TestBed.createComponent(TestButtonIconOnlyLoadingComponent);
      const buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(buttonElement.classList).toContain('ant-btn-icon-only');
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TestButtonRtlComponent>;
    let buttonElement: HTMLButtonElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonRtlComponent);
      buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    });

    it('should apply classname', () => {
      fixture.detectChanges();
      expect(buttonElement.classList).toContain('ant-btn-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(buttonElement.classList).not.toContain('ant-btn-rtl');
    });
  });

  describe('change detection', () => {
    let fixture: ComponentFixture<TestButtonComponent>;
    let buttonElement: HTMLButtonElement;
    let component: TestButtonComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestButtonComponent);
      buttonElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
      component = fixture.componentInstance;
    });

    it('should not trigger change detection when the button is clicked', () => {
      const appRef = TestBed.inject(ApplicationRef);
      const spy = spyOn(appRef, 'tick').and.callThrough();
      buttonElement.dispatchEvent(new MouseEvent('click'));
      buttonElement.dispatchEvent(new MouseEvent('click'));
      // Previously, it would've caused `tick()` to be called 2 times, because 2 click events have been triggered.
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('prevent default and stop propagation when the button state is loading', fakeAsync(() => {
      component.loading = true;
      fixture.detectChanges();
      const event = new MouseEvent('click');
      const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
      const stopImmediatePropagationSpy = spyOn(event, 'stopImmediatePropagation').and.callThrough();
      buttonElement.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopImmediatePropagationSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriButtonComponent>;
    let component: TriButtonComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriButtonComponent);
      component = fixture.componentInstance;
    });

    it('correct value for listOfNode', () => {
      component['elementRef'] = {
        nativeElement: {} as TriSafeAny
      };
      expect(component.iconOnly()).toBeFalsy();
    });
  });
});

describe('anchor', () => {
  let fixture: ComponentFixture<TestAnchorComponent>;
  let anchorElement: HTMLAnchorElement;
  let component: TestAnchorComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAnchorComponent);
    anchorElement = fixture.debugElement.query(By.directive(TriButtonComponent)).nativeElement;
    component = fixture.componentInstance;
  });

  it('should prevent default and stop propagation when the anchor is disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const event = new MouseEvent('click');
    const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
    const stopImmediatePropagationSpy = spyOn(event, 'stopImmediatePropagation').and.callThrough();
    anchorElement.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(stopImmediatePropagationSpy).toHaveBeenCalledTimes(1);
  });
});

@Component({
  imports: [TriButtonModule],
  template: `
    <button
      tri-button
      [type]="type"
      [ghost]="ghost"
      [search]="search"
      [loading]="loading"
      [danger]="danger"
      [shape]="shape"
      [block]="block"
      [size]="size"
    >
      button
    </button>
  `
})
export class TestButtonComponent {
  @Input() block: boolean = false;
  @Input() ghost: boolean = false;
  @Input() search: boolean = false;
  @Input() loading: boolean = false;
  @Input() danger: boolean = false;
  @Input() type: TriButtonType = null;
  @Input() shape: TriButtonShape = null;
  @Input() size: TriButtonSize = 'default';
}

// https://github.com/NG-ZORRO/ng-zorro-antd/issues/2191
@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button type="primary" (click)="load()" [loading]="loading">
      <tri-icon type="poweroff" />
      {{ 'Click me!' }}
    </button>
  `
})
export class TestButtonBindingComponent {
  loading = false;
  load(): void {
    this.loading = true;
    setTimeout(() => (this.loading = false), 1000);
  }
}

// https://github.com/NG-ZORRO/ng-zorro-antd/issues/3079
@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      text
      <tri-icon type="caret-down" />
    </button>
  `
})
export class TestButtonWithIconComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <tri-icon type="caret-down" />
    </button>
  `
})
export class TestButtonIconOnlyComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <u tri-icon type="up"></u>
    </button>
  `
})
export class TestButtonIconOnlyWithAnyTagComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <tri-icon type="down" />
      <!-- comment -->
    </button>
  `
})
export class TestButtonIconOnlyWithCommentComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button>
      <tri-icon type="down" />
      text
    </button>
  `
})
export class TestButtonIconOnlyWithTextComponent {}

@Component({
  imports: [TriButtonModule],
  template: `
    <button tri-button>
      <span>text</span>
    </button>
  `
})
export class TestButtonIconOnlyWithoutIconComponent {}

@Component({
  imports: [TriIconModule, TriButtonModule],
  template: `
    <button tri-button loading>
      <tri-icon type="caret-down" />
    </button>
  `
})
export class TestButtonIconOnlyLoadingComponent {}

@Component({
  imports: [BidiModule, TriButtonModule],
  template: `
    <div [dir]="direction">
      <button
        tri-button
        [type]="type"
        [ghost]="ghost"
        [search]="search"
        [loading]="loading"
        [danger]="danger"
        [shape]="shape"
        [block]="block"
        [size]="size"
      >
        button
      </button>
    </div>
  `
})
export class TestButtonRtlComponent extends TestButtonComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  imports: [TriButtonModule],
  template: '<a tri-button [disabled]="disabled">anchor</a>'
})
export class TestAnchorComponent {
  disabled = false;
}
