import { Component, computed, signal, TemplateRef, viewChild } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-custom-action-icon',
  imports: [TriUploadModule, TriIconModule, TriButtonModule],
  template: `
    <tri-upload [showUploadList]="showUploadList()" [fileList]="fileList()">
      <button tri-button>Upload</button>
    </tri-upload>

    <ng-template #extra let-file>
      <span>({{ file.size }} KB)</span>
    </ng-template>
    <ng-template #downloadIcon><tri-icon type="snippets" /></ng-template>
    <ng-template #removeIcon><tri-icon type="github" /></ng-template>
    <ng-template #previewIcon><tri-icon type="apple" /></ng-template>
  `
})
export class TriDemoUploadCustomActionIconComponent {
  protected readonly downloadIcon = viewChild<TemplateRef<{ $implicit: TriUploadFile }>>('downloadIcon');
  protected readonly removeIcon = viewChild<TemplateRef<{ $implicit: TriUploadFile }>>('removeIcon');
  protected readonly previewIcon = viewChild<TemplateRef<{ $implicit: TriUploadFile }>>('previewIcon');
  protected readonly extra = viewChild<TemplateRef<{ $implicit: TriUploadFile }>>('extra');

  protected readonly fileList = signal<TriUploadFile[]>([
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      size: 100,
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    },
    {
      uid: '2',
      name: 'yyy.png',
      size: 200,
      status: 'done',
      url: 'http://www.baidu.com/yyy.png'
    },
    {
      uid: '3',
      name: 'zzz.png',
      size: 300,
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png'
    }
  ]);

  protected readonly showUploadList = computed(() => ({
    extra: this.extra(),
    downloadIcon: this.downloadIcon(),
    removeIcon: this.removeIcon(),
    previewIcon: this.previewIcon(),
    showRemoveIcon: true,
    showPreviewIcon: true,
    showDownloadIcon: true
  }));
}
