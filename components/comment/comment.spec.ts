/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriCommentComponent } from './comment.component';
import { TriDemoCommentBasicComponent } from './demo/basic';
import { TriDemoCommentEditorComponent } from './demo/editor';
import { TriDemoCommentListComponent } from './demo/list';
import { TriDemoCommentNestedComponent } from './demo/nested';

describe('NzCommentComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  describe('default', () => {
    it('should basic work', () => {
      const fixture = TestBed.createComponent(TriDemoCommentBasicComponent);
      const component = fixture.componentInstance;
      const comment = fixture.debugElement.query(By.directive(TriCommentComponent));
      fixture.detectChanges();

      expect(comment.nativeElement.classList).toContain('ant-comment');
      expect(comment.nativeElement.querySelector('nz-avatar[nz-comment-avatar]')).toBeTruthy();
      expect(comment.nativeElement.querySelector('nz-comment-content')).toBeTruthy();
      expect(comment.nativeElement.querySelector('.ant-comment-content-author-name')).toBeTruthy();
      expect(comment.nativeElement.querySelector('.ant-comment-content-author-time')).toBeTruthy();
      expect(comment.nativeElement.querySelector('.ant-comment-content-author-name').innerText).toBe('Han Solo');
      expect(comment.nativeElement.querySelector('.ant-comment-content-author-time').innerText).toBe(component.time);
    });

    it('should actions work', () => {
      const fixture = TestBed.createComponent(TriDemoCommentBasicComponent);
      const component = fixture.componentInstance;
      const comment = fixture.debugElement.query(By.directive(TriCommentComponent));
      fixture.detectChanges();

      expect(component.likes).toBe(0);
      expect(component.dislikes).toBe(0);
      expect(comment.nativeElement.classList).toContain('ant-comment');
      expect(comment.nativeElement.querySelectorAll('.ant-comment-actions li>span').length).toBe(3);
      expect(comment.nativeElement.querySelector('.ant-comment-actions li>span .like').innerText).toBe(
        component.likes.toString()
      );
      expect(comment.nativeElement.querySelector('.ant-comment-actions li>span .dislike').innerText).toBe(
        component.dislikes.toString()
      );

      component.like();
      fixture.detectChanges();

      expect(component.likes).toBe(1);
      expect(component.dislikes).toBe(0);
      expect(comment.nativeElement.querySelector('.ant-comment-actions li>span .like').innerText).toBe(
        component.likes.toString()
      );
      expect(comment.nativeElement.querySelector('.ant-comment-actions li>span .dislike').innerText).toBe(
        component.dislikes.toString()
      );

      component.dislike();
      fixture.detectChanges();

      expect(component.likes).toBe(0);
      expect(component.dislikes).toBe(1);
      expect(comment.nativeElement.querySelector('.ant-comment-actions li>span .like').innerText).toBe(
        component.likes.toString()
      );
      expect(comment.nativeElement.querySelector('.ant-comment-actions li>span .dislike').innerText).toBe(
        component.dislikes.toString()
      );
    });

    it('should list work', () => {
      const fixture = TestBed.createComponent(TriDemoCommentListComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      let comments = fixture.debugElement.queryAll(By.directive(TriCommentComponent));
      fixture.detectChanges();
      expect(component.data.length === comments.length).toBeTruthy();

      component.data.forEach((e, i) => {
        const comment = comments[i];
        expect(comment.nativeElement.querySelector('nz-avatar[nz-comment-avatar]')).toBeTruthy();
        expect(comment.nativeElement.querySelector('.ant-comment-content-author-name').innerText).toBe(e.author);
        expect(comment.nativeElement.querySelector('.ant-comment-content-detail p').innerText).toBe(e.content);
        expect(comment.nativeElement.querySelector('.ant-comment-content-author-time').innerText).toBe(e.datetime);
      });

      component.data = [{ ...component.data[0] }];
      fixture.detectChanges();
      comments = fixture.debugElement.queryAll(By.directive(TriCommentComponent));
      expect(component.data.length === comments.length).toBeTruthy();
    });

    it('should editor work', fakeAsync(() => {
      const fixture = TestBed.createComponent(TriDemoCommentEditorComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('nz-comment .ant-comment-content-detail textarea'))).toBeTruthy();
      let comments = fixture.debugElement.queryAll(By.css('nz-list nz-comment'));
      expect(component.data.length).toBe(0);
      expect(component.data.length === comments.length).toBeTruthy();

      component.inputValue = 'Test Comment 0';
      component.handleSubmit();
      tick(1000);
      fixture.detectChanges();

      component.inputValue = 'Test Comment 1';
      component.handleSubmit();
      tick(1000);
      fixture.detectChanges();

      comments = fixture.debugElement.queryAll(By.css('nz-list nz-comment'));

      component.data.forEach((e, i) => {
        const comment = comments[i];
        expect(comment.nativeElement.querySelector('nz-avatar[nz-comment-avatar]')).toBeTruthy();
        expect(comment.nativeElement.querySelector('.ant-comment-content-author-name').innerText).toBe(e.author);
        expect(comment.nativeElement.querySelector('.ant-comment-content-detail p').innerText).toBe(e.content);
        expect(comment.nativeElement.querySelector('.ant-comment-content-author-time').innerText).toBe(e.displayTime);
      });
    }));

    it('should nested work', () => {
      const fixture = TestBed.createComponent(TriDemoCommentNestedComponent);
      fixture.detectChanges();

      const rootComment = fixture.debugElement.query(By.directive(TriCommentComponent));
      expect(rootComment.nativeElement).toBeTruthy();

      const levelTwoComment = rootComment.query(By.directive(TriCommentComponent));
      expect(levelTwoComment.nativeElement).toBeTruthy();

      const levelThreeComments = levelTwoComment.queryAll(By.directive(TriCommentComponent));
      expect(levelThreeComments.length).toBe(2);
    });
  });

  describe('RTL', () => {
    it('should className correct on dir change', () => {
      const fixture = TestBed.createComponent(TriTestCommentRtlComponent);
      const comment = fixture.debugElement.query(By.directive(TriCommentComponent));
      fixture.detectChanges();
      expect(comment.nativeElement.classList).toContain('ant-comment-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(comment.nativeElement.classList).not.toContain('ant-comment-rtl');
    });
  });
});

@Component({
  imports: [BidiModule, TriDemoCommentBasicComponent],
  template: `
    <div [dir]="direction">
      <tri-demo-comment-basic></tri-demo-comment-basic>
    </div>
  `
})
export class TriTestCommentRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
