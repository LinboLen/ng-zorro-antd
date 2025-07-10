import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: '',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      listType="picture"
      [previewFile]="previewFile"
    >
      <button tri-button>
        <tri-icon type="upload" />
        Upload
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadPreviewFileComponent {
  constructor(private http: HttpClient) {}

  previewFile = (file: TriUploadFile): Observable<string> => {
    console.log('Your upload file:', file);
    return this.http
      .post<{ thumbnail: string }>(`https://next.json-generator.com/api/json/get/4ytyBoLK8`, {
        body: file
      })
      .pipe(map(res => res.thumbnail));
  };
}
