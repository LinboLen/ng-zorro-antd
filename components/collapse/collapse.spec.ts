/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { Component, DebugElement, provideZoneChangeDetection, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { provideMockDirectionality } from 'ng-zorro-antd/core/testing';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriCollapsePanelComponent } from './collapse-panel.component';
import { TriCollapseComponent } from './collapse.component';
import { TriCollapseModule } from './collapse.module';

describe('collapse', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [
        provideNzIconsTesting(),
        provideNzNoAnimation(),
        provideZoneChangeDetection(),
        provideMockDirectionality()
      ]
    });
  });

  describe('collapse basic', () => {
    let fixture: ComponentFixture<TriTestCollapseBasicComponent>;
    let testComponent: TriTestCollapseBasicComponent;
    let collapse: DebugElement;
    let panels: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCollapseBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      collapse = fixture.debugElement.query(By.directive(TriCollapseComponent));
      panels = fixture.debugElement.queryAll(By.directive(TriCollapsePanelComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(collapse.nativeElement!.classList).toContain('ant-collapse');
      expect(panels.every(panel => panel.nativeElement.classList.contains('ant-collapse-item'))).toBe(true);
    });

    it('should border work', () => {
      fixture.detectChanges();
      expect(collapse.nativeElement!.classList).not.toContain('ant-collapse-borderless');
      testComponent.bordered = false;
      fixture.detectChanges();
      expect(collapse.nativeElement!.classList).toContain('ant-collapse-borderless');
    });

    it('should showArrow work', () => {
      fixture.detectChanges();
      expect(panels[0].nativeElement.querySelector('.ant-collapse-arrow').firstElementChild).toBeDefined();
      testComponent.showArrow = false;
      fixture.detectChanges();
      expect(panels[0].nativeElement.querySelector('.ant-collapse-arrow')).toBeNull();
    });

    it('should active work', () => {
      fixture.detectChanges();
      expect(panels[0].nativeElement.classList).not.toContain('ant-collapse-item-active');
      testComponent.active01 = true;
      fixture.detectChanges();
      expect(panels[0].nativeElement.classList).toContain('ant-collapse-item-active');
      expect(testComponent.active01Change).toHaveBeenCalledTimes(0);
    });

    it('should click work', () => {
      fixture.detectChanges();
      expect(panels[0].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active01).toBe(false);
      panels[0].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      expect(testComponent.active01).toBe(true);
      expect(panels[0].nativeElement.classList).toContain('ant-collapse-item-active');
      expect(testComponent.active01Change).toHaveBeenCalledTimes(1);
    });

    it('should disabled work', () => {
      testComponent.disabled = true;
      fixture.detectChanges();
      expect(panels[1].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active02).toBe(false);
      panels[1].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      expect(testComponent.active02).toBe(false);
      expect(panels[1].nativeElement.classList).toContain('ant-collapse-item-disabled');
      expect(panels[1].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active02Change).toHaveBeenCalledTimes(0);
    });

    it('should accordion work', () => {
      testComponent.accordion = true;
      fixture.detectChanges();
      expect(panels[0].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active01).toBe(false);
      panels[0].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      expect(testComponent.active01).toBe(true);
      expect(testComponent.active02).toBe(false);
      expect(panels[0].nativeElement.classList).toContain('ant-collapse-item-active');
      expect(panels[1].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active01Change).toHaveBeenCalledTimes(1);
      expect(testComponent.active02Change).toHaveBeenCalledTimes(0);
      panels[1].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      expect(testComponent.active01).toBe(false);
      expect(testComponent.active02).toBe(true);
      expect(panels[0].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(panels[1].nativeElement.classList).toContain('ant-collapse-item-active');
      expect(testComponent.active01Change).toHaveBeenCalledTimes(2);
      expect(testComponent.active02Change).toHaveBeenCalledTimes(1);
    });

    it('should click to fold up work with accordion', () => {
      testComponent.accordion = true;
      fixture.detectChanges();
      expect(panels[0].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active01).toBe(false);
      panels[0].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      panels[1].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      panels[0].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      expect(testComponent.active01).toBe(true);
      expect(testComponent.active02).toBe(false);
      expect(panels[0].nativeElement.classList).toContain('ant-collapse-item-active');
      expect(panels[1].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active01Change).toHaveBeenCalledTimes(3);
      expect(testComponent.active02Change).toHaveBeenCalledTimes(2);
      panels[0].nativeElement.querySelector('.ant-collapse-header').click();
      fixture.detectChanges();
      expect(testComponent.active01).toBe(false);
      expect(testComponent.active02).toBe(false);
      expect(panels[0].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(panels[1].nativeElement.classList).not.toContain('ant-collapse-item-active');
      expect(testComponent.active01Change).toHaveBeenCalledTimes(4);
      expect(testComponent.active02Change).toHaveBeenCalledTimes(2);
    });

    it('should header work', () => {
      fixture.detectChanges();
      expect(panels[0].nativeElement.querySelector('.ant-collapse-header').innerText).toBe('string');
    });

    it('should extra work', () => {
      fixture.detectChanges();
      expect(panels[0].nativeElement.querySelector('.ant-collapse-extra')).toBeFalsy();

      testComponent.showExtra = 'Extra';
      fixture.detectChanges();
      const extraEl = panels[0].nativeElement.querySelector('.ant-collapse-extra');
      expect(extraEl!).not.toBeFalsy();
      expect(extraEl!.innerText).toBe('Extra');
    });
  });

  describe('collapse template', () => {
    let fixture: ComponentFixture<TriTestCollapseTemplateComponent>;
    let panels: DebugElement[];
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCollapseTemplateComponent);
      fixture.detectChanges();
      panels = fixture.debugElement.queryAll(By.directive(TriCollapsePanelComponent));
    });

    it('should header work', () => {
      fixture.detectChanges();
      expect(panels[0].nativeElement.querySelector('.ant-collapse-header').innerText).toBe('template');
    });
  });

  describe('collapse icon', () => {
    let fixture: ComponentFixture<TriTestCollapseIconComponent>;
    let panels: DebugElement[];
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCollapseIconComponent);
      fixture.detectChanges();
      panels = fixture.debugElement.queryAll(By.directive(TriCollapsePanelComponent));
    });

    it('should icon work', () => {
      fixture.detectChanges();
      expect(panels[0].nativeElement.querySelector('.anticon-right')).toBeDefined();
      expect(panels[1].nativeElement.querySelector('.anticon-double-right')).toBeDefined();
      expect(panels[2].nativeElement.querySelector('.anticon-caret-right')).toBeDefined();
    });
  });

  describe('collapse collapsible', () => {
    let fixture: ComponentFixture<TriTestCollapseCollapsibleComponent>;
    let panel: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCollapseCollapsibleComponent);
      fixture.detectChanges();
      panel = fixture.debugElement.query(By.directive(TriCollapsePanelComponent));
    });

    it('should only toggle by icon when nzCollapsible is "icon"', () => {
      const headerEl = panel.nativeElement.querySelector('.ant-collapse-header') as HTMLElement;
      expect(headerEl.classList).toContain('ant-collapse-icon-collapsible-only');
      // initial state
      expect(panel.nativeElement.classList).not.toContain('ant-collapse-item-active');

      // click header text should NOT toggle
      (panel.nativeElement.querySelector('.ant-collapse-header-text') as HTMLElement).click();
      fixture.detectChanges();
      expect(panel.nativeElement.classList).not.toContain('ant-collapse-item-active');

      // click icon should toggle open
      (panel.nativeElement.querySelector('.ant-collapse-expand-icon') as HTMLElement).click();
      fixture.detectChanges();
      expect(panel.nativeElement.classList).toContain('ant-collapse-item-active');

      // click header text again should NOT toggle
      (panel.nativeElement.querySelector('.ant-collapse-header-text') as HTMLElement).click();
      fixture.detectChanges();
      expect(panel.nativeElement.classList).toContain('ant-collapse-item-active');

      // click icon should toggle close
      (panel.nativeElement.querySelector('.ant-collapse-expand-icon') as HTMLElement).click();
      fixture.detectChanges();
      expect(panel.nativeElement.classList).not.toContain('ant-collapse-item-active');
    });

    it('should not toggle when nzCollapsible is "disabled"', () => {
      fixture.componentInstance.collapsible = 'disabled';
      fixture.detectChanges();

      const header = panel.nativeElement.querySelector('.ant-collapse-header') as HTMLElement;
      header.click();
      fixture.detectChanges();
      expect(panel.nativeElement.classList).not.toContain('ant-collapse-item-active');

      const icon = panel.nativeElement.querySelector('.ant-collapse-expand-icon') as HTMLElement;
      icon.click();
      fixture.detectChanges();
      expect(panel.nativeElement.classList).not.toContain('ant-collapse-item-active');
    });

    it('should toggle by header when nzCollapsible is "header"', () => {
      // Recreate fixture and set mode BEFORE first detectChanges so listeners bind to header
      const localFixture = TestBed.createComponent(TriTestCollapseCollapsibleComponent);
      localFixture.componentInstance.collapsible = 'header';
      localFixture.detectChanges();
      const localPanel = localFixture.debugElement.query(By.directive(TriCollapsePanelComponent));

      const header = localPanel.nativeElement.querySelector('.ant-collapse-header') as HTMLElement;
      expect(header.classList).toContain('ant-collapse-header-collapsible-only');
      expect(localPanel.nativeElement.classList).not.toContain('ant-collapse-item-active');

      // click header toggles
      (localPanel.nativeElement.querySelector('.ant-collapse-header-text') as HTMLElement).click();
      localFixture.detectChanges();
      expect(localPanel.nativeElement.classList).toContain('ant-collapse-item-active');

      // click header toggles again (close)
      (localPanel.nativeElement.querySelector('.ant-collapse-header-text') as HTMLElement).click();
      localFixture.detectChanges();
      expect(localPanel.nativeElement.classList).not.toContain('ant-collapse-item-active');

      // clicking icon (which is inside header) should also toggle because header listens
      (localPanel.nativeElement.querySelector('.ant-collapse-expand-icon') as HTMLElement).click();
      localFixture.detectChanges();
      expect(localPanel.nativeElement.classList).toContain('ant-collapse-item-active');
    });
  });

  describe('RTL', () => {
    it('should className correct on dir change', () => {
      const fixture = TestBed.createComponent(TriTestCollapseBasicComponent);
      const directionality = TestBed.inject(Directionality);

      const collapse = fixture.debugElement.query(By.directive(TriCollapseComponent));

      fixture.detectChanges();
      expect(collapse.nativeElement!.classList).not.toContain('ant-collapse-rtl');

      directionality.valueSignal.set('rtl');
      fixture.detectChanges();
      expect(collapse.nativeElement!.classList).toContain('ant-collapse-rtl');
    });
  });

  describe('collapse size', () => {
    let fixture: ComponentFixture<TriTestCollapseSizeSpecComponent>;
    let collapse: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCollapseSizeSpecComponent);
      fixture.detectChanges();
      collapse = fixture.debugElement.query(By.directive(TriCollapseComponent));
    });

    it('should apply correct host classes for nzSize', () => {
      // default is middle: no small/large classes
      expect(collapse.nativeElement!.classList).not.toContain('ant-collapse-small');
      expect(collapse.nativeElement!.classList).not.toContain('ant-collapse-large');

      // small
      fixture.componentInstance.size = 'small';
      fixture.detectChanges();
      expect(collapse.nativeElement!.classList).toContain('ant-collapse-small');
      expect(collapse.nativeElement!.classList).not.toContain('ant-collapse-large');

      // large
      fixture.componentInstance.size = 'large';
      fixture.detectChanges();
      expect(collapse.nativeElement!.classList).toContain('ant-collapse-large');
      expect(collapse.nativeElement!.classList).not.toContain('ant-collapse-small');
    });
  });
});

@Component({
  selector: 'tri-test-basic-collapse',
  imports: [TriCollapseModule],
  template: `
    <ng-template #headerTemplate>template</ng-template>
    <tri-collapse [accordion]="accordion" [bordered]="bordered">
      <tri-collapse-panel
        [(activeChange)]="active01"
        (activeChange)="active01Change($event)"
        [header]="header"
        [showArrow]="showArrow"
        [extra]="showExtra"
      >
        <p>Panel01</p>
      </tri-collapse-panel>
      <tri-collapse-panel [(activeChange)]="active02" (activeChange)="active02Change($event)" [disabled]="disabled">
        <p>Panel02</p>
      </tri-collapse-panel>
    </tri-collapse>
  `
})
export class TriTestCollapseBasicComponent {
  @ViewChild('headerTemplate', { static: false }) headerTemplate!: TemplateRef<void>;
  accordion = false;
  bordered = true;
  disabled = false;
  active01 = false;
  active02 = false;
  showArrow = true;
  showExtra = '';
  header = 'string';
  active01Change = jasmine.createSpy<TriSafeAny>('active01 callback');
  active02Change = jasmine.createSpy<TriSafeAny>('active02 callback');
}

@Component({
  imports: [TriCollapseModule],
  template: `
    <ng-template #headerTemplate>template</ng-template>
    <tri-collapse>
      <tri-collapse-panel [header]="headerTemplate">
        <p>Panel01</p>
      </tri-collapse-panel>
    </tri-collapse>
  `
})
export class TriTestCollapseTemplateComponent {}

@Component({
  imports: [TriIconModule, TriCollapseModule],
  template: `
    <tri-collapse>
      <tri-collapse-panel>
        <p>Panel01</p>
      </tri-collapse-panel>
      <tri-collapse-panel expandedIcon="double-right">
        <p>Panel02</p>
      </tri-collapse-panel>
      <tri-collapse-panel [expandedIcon]="expandedIcon">
        <p>Panel01</p>
      </tri-collapse-panel>
      <ng-template #expandedIcon>
        <tri-icon type="caret-right" class="tri-collapse-arrow" />
      </ng-template>
    </tri-collapse>
  `
})
export class TriTestCollapseIconComponent {}

@Component({
  imports: [TriCollapseModule],
  template: `
    <tri-collapse>
      <tri-collapse-panel
        [(activeChange)]="active"
        [collapsible]="collapsible"
        [showArrow]="showArrow"
        header="Header"
      >
        <p>Content</p>
      </tri-collapse-panel>
    </tri-collapse>
  `
})
export class TriTestCollapseCollapsibleComponent {
  active = false;
  collapsible: 'disabled' | 'header' | 'icon' = 'icon';
  showArrow = true;
}

@Component({
  imports: [TriCollapseModule],
  template: `
    <tri-collapse [size]="size">
      <tri-collapse-panel header="header" active>
        <p>content</p>
      </tri-collapse-panel>
    </tri-collapse>
  `
})
export class TriTestCollapseSizeSpecComponent {
  size: 'small' | 'middle' | 'large' = 'middle';
}
