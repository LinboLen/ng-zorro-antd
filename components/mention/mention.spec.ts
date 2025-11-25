/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Direction, Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, RIGHT_ARROW, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ApplicationRef, Component, DebugElement, NgZone, signal, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import {
  createKeyboardEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  MockNgZone,
  typeInElement
} from 'ng-zorro-antd/core/testing';
import { TriStatus } from 'ng-zorro-antd/core/types';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFormControlStatusType, TriFormModule } from '../form';
import { TriInputModule } from '../input';
import { TriMentionTriggerDirective } from './mention-trigger';
import { TriMentionComponent } from './mention.component';
import { TriMentionModule } from './mention.module';

describe('mention', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideNzIconsTesting(),
        { provide: Directionality, useClass: MockDirectionality },
        { provide: ScrollDispatcher, useFactory: () => ({ scrolled: () => scrolledSubject }) },
        {
          provide: NgZone,
          useFactory: () => new MockNgZone()
        }
      ]
    });

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }));

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestDirMentionComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestDirMentionComponent);
      fixture.detectChanges();
    });

    it('should classname correct', () => {
      expect(fixture.debugElement.nativeElement.querySelector('nz-mention').classList).not.toContain(
        'ant-mentions-rtl'
      );
      fixture.componentInstance.direction = 'rtl';
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('nz-mention').classList).toContain('ant-mentions-rtl');
    });
  });

  describe('toggling', () => {
    let fixture: ComponentFixture<TriTestSimpleMentionComponent>;
    let textarea: HTMLTextAreaElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestSimpleMentionComponent);
      fixture.detectChanges();
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      textarea.value = '@angular';
      tick();
    }));

    it('should open the dropdown when the input is click', () => {
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      expect(fixture.componentInstance.mention.isOpen).toBe(true);
    });

    it('should not open the dropdown when the input is click but empty content', () => {
      textarea.value = '';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      expect(fixture.componentInstance.mention.isOpen).toBe(false);
    });

    it('should not open the dropdown on click if the input is readonly', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      textarea.readOnly = true;
      fixture.detectChanges();

      expect(mention.isOpen).toBe(false);
      dispatchFakeEvent(textarea, 'click');
      flush();

      fixture.detectChanges();
      expect(mention.isOpen).toBe(false);
    }));

    it('should not open the dropdown on click if the input is disabled', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      textarea.disabled = true;
      fixture.detectChanges();

      expect(mention.isOpen).toBe(false);
      dispatchFakeEvent(textarea, 'click');
      flush();

      fixture.detectChanges();
      expect(mention.isOpen).toBe(false);
    }));

    it('should close the dropdown when the user clicks away', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      flush();
      expect(mention.isOpen).toBe(true);
      dispatchFakeEvent(document.body, 'click');
      expect(mention.isOpen).toBe(false);
    }));

    it('should close the dropdown when the user taps away on a touch device', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      flush();
      dispatchFakeEvent(document, 'touchend');
      expect(mention.isOpen).toBe(false);
    }));

    it('should close the dropdown when an option is clicked', fakeAsync(() => {
      const mention = fixture.componentInstance.mention;
      textarea.value = '@a';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelector('.ant-mentions-dropdown-menu-item') as HTMLElement;
      option.click();
      fixture.detectChanges();

      tick(500);
      expect(mention.isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
      expect(textarea.value).toEqual('@angular ');
    }));

    it('should prevent default on the mousedown event when an option is clicked and should not run change detection', fakeAsync(() => {
      textarea.value = '@a';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      flush();

      const appRef = TestBed.inject(ApplicationRef);
      const option = overlayContainerElement.querySelector('.ant-mentions-dropdown-menu-item') as HTMLElement;
      const event = new MouseEvent('mousedown');

      spyOn(appRef, 'tick');
      spyOn(event, 'preventDefault').and.callThrough();

      option.dispatchEvent(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(appRef.tick).not.toHaveBeenCalled();
    }));

    it('should support switch trigger', fakeAsync(() => {
      fixture.componentInstance.inputTrigger = true;
      fixture.detectChanges();
      tick(); // Wait for afterNextRender
      const textareaWithSingleLine = fixture.debugElement.query(By.css('textarea')).nativeElement;
      const mention = fixture.componentInstance.mention;
      expect(textareaWithSingleLine).toBeTruthy();

      textareaWithSingleLine.value = '@a';
      fixture.detectChanges();
      dispatchFakeEvent(textareaWithSingleLine, 'click');
      fixture.detectChanges();
      flush();

      expect(mention.isOpen).toBe(true);

      const option = overlayContainerElement.querySelector('.ant-mentions-dropdown-menu-item') as HTMLElement;
      expect(option).toBeTruthy(); // Ensure option exists before clicking
      option.click();
      fixture.detectChanges();

      tick(500);
      expect(mention.isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));
  });

  describe('keyboard events', () => {
    let fixture: ComponentFixture<TriTestSimpleMentionComponent>;
    let textarea: HTMLTextAreaElement;
    let DOWN_ARROW_EVENT: KeyboardEvent;
    let UP_ARROW_EVENT: KeyboardEvent;
    let ENTER_EVENT: KeyboardEvent;
    // let LEFT_EVENT: KeyboardEvent;
    let RIGHT_EVENT: KeyboardEvent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestSimpleMentionComponent);
      fixture.detectChanges();
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;

      DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);
      UP_ARROW_EVENT = createKeyboardEvent('keydown', UP_ARROW);
      ENTER_EVENT = createKeyboardEvent('keydown', ENTER);
      // LEFT_EVENT = createKeyboardEvent('keydown', LEFT_ARROW);
      RIGHT_EVENT = createKeyboardEvent('keydown', RIGHT_ARROW);

      fixture.detectChanges();
      flush();
    }));

    it('should set the active item to the second option when DOWN key is pressed', () => {
      textarea.value = '@a';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();

      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.ant-mentions-dropdown-menu-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);
      fixture.componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(optionEls[0].classList).not.toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[1].classList).toContain('ant-mentions-dropdown-menu-item-active');
    });

    it('should set the active item to the first option when DOWN key is pressed in last item', () => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.ant-mentions-dropdown-menu-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);

      [1, 2, 3, 4, 5].forEach(() => fixture.componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT));
      fixture.detectChanges();

      expect(optionEls[1].classList).not.toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[4].classList).not.toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[0].classList).toContain('ant-mentions-dropdown-menu-item-active');
    });

    it('should set the active item to the last option when UP key is pressed', () => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.ant-mentions-dropdown-menu-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);

      fixture.componentInstance.trigger.onKeydown.emit(UP_ARROW_EVENT);
      fixture.detectChanges();

      expect(optionEls[0].classList).not.toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[4].classList).toContain('ant-mentions-dropdown-menu-item-active');
    });

    it('should set the active item to the previous option when UP key is pressed', () => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const mention = fixture.componentInstance.mention;
      const optionEls = overlayContainerElement.querySelectorAll(
        '.ant-mentions-dropdown-menu-item'
      ) as NodeListOf<HTMLElement>;

      expect(mention.isOpen).toBe(true);

      [1, 2, 3].forEach(() => fixture.componentInstance.trigger.onKeydown.emit(UP_ARROW_EVENT));
      fixture.detectChanges();

      expect(optionEls[0].classList).not.toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[2].classList).toContain('ant-mentions-dropdown-menu-item-active');
    });

    it('should set the active item properly after filtering', () => {
      const componentInstance = fixture.componentInstance;

      typeInElement('@a', textarea);
      fixture.detectChanges();

      componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll(
        '.ant-mentions-dropdown-menu-item'
      ) as NodeListOf<HTMLElement>;

      expect(optionEls[0].classList).not.toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[1].classList).toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[1].innerText).toEqual('ant-design');
    });

    it('should set the active after filtering item when RIGHT/LEFT key is pressed', () => {
      textarea.value = '@a @t';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      const componentInstance = fixture.componentInstance;
      [1, 2, 3, 4].forEach(() => componentInstance.trigger.onKeydown.emit(RIGHT_EVENT));
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll(
        '.ant-mentions-dropdown-menu-item'
      ) as NodeListOf<HTMLElement>;

      expect(optionEls[0].classList).toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[1].classList).not.toContain('ant-mentions-dropdown-menu-item-active');
      expect(optionEls[0].innerText).toEqual('ant-design');
      expect(optionEls[1].innerText).toEqual('mention');
    });

    it('should fill the text field when an option is selected with ENTER', fakeAsync(() => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      const componentInstance = fixture.componentInstance;
      componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      flush();
      fixture.detectChanges();

      componentInstance.trigger.onKeydown.emit(ENTER_EVENT);
      fixture.detectChanges();

      expect(componentInstance.inputValue).toContain('@ant-design ');

      expect(textarea.value).toContain('@ant-design ');
    }));

    it('should prevent the default enter key action', fakeAsync(() => {
      textarea.value = '@';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.componentInstance.trigger.onKeydown.emit(DOWN_ARROW_EVENT);
      flush();

      fixture.componentInstance.trigger.onKeydown.emit(ENTER_EVENT);
      // TODO: ivy fix
      expect(ENTER_EVENT.defaultPrevented).toBe(true);
      // expect(false).toBe(true);
    }));

    it('should not prevent the default enter action for a closed dropdown', () => {
      textarea.value = 'ABC';
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      fixture.componentInstance.trigger.onKeydown.emit(ENTER_EVENT);
      // TODO: ivy fix
      expect(ENTER_EVENT.defaultPrevented).toBe(false);
      // expect(true).toBe(false);
    });

    it('should close the dropdown when tabbing', fakeAsync(() => {
      textarea.value = '@';
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('.ant-mentions-dropdown')).toBeTruthy();
      dispatchKeyboardEvent(textarea, 'keydown', TAB);
      fixture.detectChanges();
      tick(500);
      expect(overlayContainerElement.querySelector('.ant-mentions-dropdown')).toBeFalsy();
    }));

    it('should close the dropdown when pressing escape', fakeAsync(() => {
      textarea.value = '@';
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.ant-mentions-dropdown')).toBeTruthy();

      dispatchKeyboardEvent(textarea, 'keydown', ESCAPE);
      fixture.detectChanges();

      tick(500);
      expect(overlayContainerElement.querySelector('.ant-mentions-dropdown')).toBeFalsy();
    }));
  });

  describe('property', () => {
    let fixture: ComponentFixture<TriTestPropertyMentionComponent>;
    let textarea: HTMLTextAreaElement;
    let spyNzOnSearch: jasmine.Spy;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestPropertyMentionComponent);
      fixture.detectChanges();
      tick();
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      spyNzOnSearch = spyOn(fixture.componentInstance, 'onSearchChange');
    }));

    afterEach(() => {
      spyNzOnSearch.calls.reset();
    });

    it('should open the dropdown when the async load suggestions', fakeAsync(() => {
      fixture.detectChanges();
      dispatchFakeEvent(textarea, 'click');
      typeInElement('@', textarea);
      fixture.detectChanges();
      fixture.componentInstance.fetchSuggestions();
      fixture.detectChanges();

      tick();
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('.ant-mentions-dropdown .anticon-loading')).toBeTruthy();
      fixture.detectChanges();
      flush(500);
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('.ant-mentions-dropdown .anticon-loading')).toBeFalsy();
    }));

    it('should open the dropdown when the type in @ prefix', () => {
      fixture.componentInstance.setArrayPrefix();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('@', textarea);
      fixture.detectChanges();

      const mention = fixture.componentInstance.mention;

      expect(mention.isOpen).toBe(true);
    });

    it('should emit nzOnSearchChange when type in @ prefix', () => {
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('@test', textarea);
      fixture.detectChanges();

      expect(spyNzOnSearch).toHaveBeenCalledTimes(1);

      typeInElement('@test  @', textarea);
      fixture.detectChanges();

      expect(spyNzOnSearch).toHaveBeenCalledTimes(2);

      typeInElement('@test  @ @', textarea);
      fixture.detectChanges();

      expect(spyNzOnSearch).toHaveBeenCalledTimes(3);
    });

    it('should open the dropdown when the type in # prefix', () => {
      fixture.componentInstance.setArrayPrefix();
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('#', textarea);
      fixture.detectChanges();

      const mention = fixture.componentInstance.mention;

      expect(mention.isOpen).toBe(true);
    });

    it('should has the custom template in the dropdown', () => {
      dispatchFakeEvent(textarea, 'click');
      fixture.detectChanges();
      typeInElement('@', textarea);
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector('.ant-mentions-dropdown .custom')).toBeTruthy();
    });

    it('should correct parsing the trigger content', () => {
      fixture.componentInstance.setArrayPrefix();
      typeInElement(
        'ABC @Angular 123 @ant-design @你好 foo ant@gmail.com @@ng 123 .@.@ /@hello \\@hello #ng',
        textarea
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.mention.getMentions().join(',')).toBe('@Angular,@ant-design,@你好,@@ng,#ng');
    });
  });

  describe('status', () => {
    let fixture: ComponentFixture<TriTestStatusMentionComponent>;
    let mention: DebugElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestStatusMentionComponent);
      mention = fixture.debugElement.query(By.directive(TriMentionComponent));
      fixture.detectChanges();
      tick();
    }));

    it('should className with status correct', () => {
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-status-error');

      fixture.componentInstance.status = 'warning';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-status-warning');

      fixture.componentInstance.status = '';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-status-warning');
    });
  });

  describe('in form', () => {
    let fixture: ComponentFixture<TriTestMentionInFormComponent>;
    let mention: DebugElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestMentionInFormComponent);
      mention = fixture.debugElement.query(By.directive(TriMentionComponent));
      fixture.detectChanges();
      tick();
    }));

    it('should className correct', () => {
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-status-error');
      expect(mention.nativeElement.querySelector('nz-form-item-feedback-icon')).toBeTruthy();

      fixture.componentInstance.status = 'warning';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-status-warning');

      fixture.componentInstance.status = 'success';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-status-success');

      fixture.componentInstance.feedback = false;
      fixture.detectChanges();
      expect(mention.nativeElement.querySelector('nz-form-item-feedback-icon')).toBeNull();
    });
  });

  describe('variant', () => {
    let fixture: ComponentFixture<TriTestVariantMentionComponent>;
    let mention: DebugElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestVariantMentionComponent);
      mention = fixture.debugElement.query(By.directive(TriMentionComponent));
      fixture.detectChanges();
      tick();
    }));

    it('should have default outlined variant', () => {
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-borderless');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-filled');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-underlined');
    });

    it('should apply borderless variant correctly', () => {
      fixture.componentInstance.variant = 'borderless';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-borderless');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-filled');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-underlined');
    });

    it('should apply filled variant correctly', () => {
      fixture.componentInstance.variant = 'filled';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-filled');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-borderless');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-underlined');
    });

    it('should apply underlined variant correctly', () => {
      fixture.componentInstance.variant = 'underlined';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-underlined');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-borderless');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-filled');
    });

    it('should switch between variants correctly', () => {
      fixture.componentInstance.variant = 'filled';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-filled');

      fixture.componentInstance.variant = 'borderless';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).toContain('ant-mentions-borderless');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-filled');

      fixture.componentInstance.variant = 'outlined';
      fixture.detectChanges();
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-borderless');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-filled');
      expect(mention.nativeElement.classList).not.toContain('ant-mentions-underlined');
    });

    it('should maintain functionality across different variants', fakeAsync(() => {
      const variants: Array<'outlined' | 'filled' | 'borderless' | 'underlined'> = [
        'outlined',
        'filled',
        'borderless',
        'underlined'
      ];

      variants.forEach(variant => {
        fixture.componentInstance.variant = variant;
        fixture.detectChanges();

        const textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
        textarea.value = '@angular';
        fixture.detectChanges();

        dispatchFakeEvent(textarea, 'click');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.mention.isOpen).toBe(true);

        const option = overlayContainerElement.querySelector('.ant-mentions-dropdown-menu-item') as HTMLElement;
        if (option) {
          option.click();
          fixture.detectChanges();
          tick(500);

          expect(fixture.componentInstance.mention.isOpen).toBe(false);
        }
      });
    }));
  });

  describe('clear button', () => {
    let fixture: ComponentFixture<TriTestClearMentionComponent>;
    let textarea: HTMLTextAreaElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TriTestClearMentionComponent);
      fixture.detectChanges();
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      tick();
    }));

    it('should not show clear button when nzAllowClear is false', fakeAsync(() => {
      fixture.componentInstance.allowClear = false;
      fixture.detectChanges();
      typeInElement('test value', textarea);
      fixture.detectChanges();
      tick();
      expect(fixture.debugElement.query(By.css('.ant-mentions-clear-icon'))).toBeNull();
    }));

    it('should show clear button when nzAllowClear is true and has value', fakeAsync(() => {
      fixture.componentInstance.allowClear = true;
      fixture.detectChanges();
      typeInElement('test value', textarea);
      fixture.detectChanges();
      tick();
      expect(fixture.debugElement.query(By.css('.ant-mentions-clear-icon'))).toBeTruthy();
    }));

    it('should not show clear button when nzAllowClear is true but has no value', fakeAsync(() => {
      fixture.componentInstance.allowClear = true;
      fixture.detectChanges();
      typeInElement('', textarea);
      fixture.detectChanges();
      tick();
      expect(fixture.debugElement.query(By.css('.ant-mentions-clear-icon'))).toBeNull();
    }));

    it('should clear input value when clear button is clicked', fakeAsync(() => {
      fixture.componentInstance.allowClear = true;
      fixture.detectChanges();
      typeInElement('test value', textarea);
      fixture.detectChanges();
      tick();

      const clearButton = fixture.debugElement.query(By.css('.ant-mentions-clear-icon')).nativeElement;
      clearButton.click();
      fixture.detectChanges();
      tick();

      expect(textarea.value).toBe('');
      expect(fixture.componentInstance.inputValue).toBe('');
    }));

    it('should emit nzOnClear when clear button is clicked', fakeAsync(() => {
      const spy = spyOn(fixture.componentInstance, 'onClear');
      fixture.componentInstance.allowClear = true;
      fixture.detectChanges();
      typeInElement('test value', textarea);
      fixture.detectChanges();
      tick();

      const clearButton = fixture.debugElement.query(By.css('.ant-mentions-clear-icon')).nativeElement;
      clearButton.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    }));

    it('should use custom clear icon when provided', fakeAsync(() => {
      fixture.componentInstance.allowClear = true;
      fixture.componentInstance.useCustomClearIcon = true;
      fixture.detectChanges();
      typeInElement('test value', textarea);
      fixture.detectChanges();
      tick();

      const clearIcon = fixture.debugElement.query(By.css('.custom-clear-icon'));
      expect(clearIcon).toBeTruthy();
    }));
  });
});

@Component({
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions">
      @if (!inputTrigger) {
        <textarea tri-input [(ngModel)]="inputValue" mentionTrigger></textarea>
      } @else {
        <textarea rows="1" tri-input [(ngModel)]="inputValue" mentionTrigger></textarea>
      }
    </tri-mention>
  `
})
class TriTestSimpleMentionComponent {
  inputValue: string = '@angular';
  inputTrigger = false;
  suggestions = ['angular', 'ant-design', 'mention', '中文', 'にほんご'];
  @ViewChild(TriMentionComponent, { static: false }) mention!: TriMentionComponent;
  @ViewChild(TriMentionTriggerDirective, { static: false }) trigger!: TriMentionTriggerDirective;
}

@Component({
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention
      [suggestions]="webFrameworks"
      [valueWith]="valueWith"
      [prefix]="prefix"
      [placement]="'top'"
      [loading]="loading"
      (onSearchChange)="onSearchChange()"
    >
      <textarea tri-input [(ngModel)]="inputValue" mentionTrigger></textarea>
      <ng-container *mentionSuggestion="let framework">
        <span class="custom">{{ framework.name }} - {{ framework.type }}</span>
      </ng-container>
    </tri-mention>
  `
})
class TriTestPropertyMentionComponent {
  inputValue: string = '@angular';
  webFrameworks = [
    { name: 'React', type: 'JavaScript' },
    { name: 'Angular', type: 'JavaScript' },
    { name: 'Laravel', type: 'PHP' },
    { name: 'Flask', type: 'Python' },
    { name: 'Django', type: 'Python' }
  ];
  loading = false;
  prefix: string | string[] = '@';
  valueWith = (data: { name: string; type: string }): string => data.name;
  @ViewChild(TriMentionComponent, { static: false }) mention!: TriMentionComponent;
  @ViewChild(TriMentionTriggerDirective, { static: false }) trigger!: TriMentionTriggerDirective;

  setArrayPrefix(): void {
    this.prefix = ['@', '#'];
  }

  onSearchChange(): void {}

  fetchSuggestions(): void {
    this.webFrameworks = [];
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.webFrameworks = [
        { name: 'React', type: 'JavaScript' },
        { name: 'Angular', type: 'JavaScript' },
        { name: 'Laravel', type: 'PHP' },
        { name: 'Flask', type: 'Python' },
        { name: 'Django', type: 'Python' }
      ];
    }, 500);
  }
}

@Component({
  imports: [BidiModule, TriInputModule, TriMentionModule],
  template: `
    <div [dir]="direction">
      <tri-mention [suggestions]="[]">
        <textarea rows="1" tri-input mentionTrigger></textarea>
      </tri-mention>
    </div>
  `
})
class TriTestDirMentionComponent {
  direction: Direction = 'ltr';
}

@Component({
  imports: [TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="[]" [status]="status">
      <textarea rows="1" tri-input mentionTrigger></textarea>
    </tri-mention>
  `
})
class TriTestStatusMentionComponent {
  status: TriStatus = 'error';
}

@Component({
  imports: [TriFormModule, TriMentionModule],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-control [hasFeedback]="feedback" [validateStatus]="status">
          <tri-mention [suggestions]="[]">
            <textarea rows="1" mentionTrigger></textarea>
          </tri-mention>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
class TriTestMentionInFormComponent {
  status: TriFormControlStatusType = 'error';
  feedback = true;
}

@Component({
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention [suggestions]="suggestions" [variant]="variant">
      <textarea tri-input [(ngModel)]="inputValue" mentionTrigger></textarea>
    </tri-mention>
  `
})
class TriTestVariantMentionComponent {
  inputValue: string = '@angular';
  variant: 'outlined' | 'filled' | 'borderless' | 'underlined' = 'outlined';
  suggestions = ['angular', 'ant-design', 'mention'];
  @ViewChild(TriMentionComponent, { static: false }) mention!: TriMentionComponent;
}

@Component({
  imports: [FormsModule, TriInputModule, TriMentionModule],
  template: `
    <tri-mention
      [suggestions]="suggestions"
      [allowClear]="allowClear"
      [clearIcon]="useCustomClearIcon ? clearIconTemplate : null"
      (onClear)="onClear()"
    >
      <textarea tri-input [(ngModel)]="inputValue" mentionTrigger></textarea>
      <ng-template #clearIconTemplate>
        <span class="custom-clear-icon">×</span>
      </ng-template>
    </tri-mention>
  `
})
class TriTestClearMentionComponent {
  inputValue = '';
  suggestions = ['angular', 'ant-design', 'mention'];
  allowClear = false;
  useCustomClearIcon = false;

  @ViewChild(TriMentionComponent, { static: false }) mention!: TriMentionComponent;

  onClear(): void {}
}

class MockDirectionality {
  value = 'ltr';
  change = new Subject();
  valueSignal = signal('ltr');
}
