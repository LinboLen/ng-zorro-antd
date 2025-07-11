import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriUploadFile, TriUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'tri-demo-upload-transform-file',
  imports: [TriButtonModule, TriIconModule, TriUploadModule],
  template: `
    <tri-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" [transformFile]="transformFile">
      <button tri-button>
        <tri-icon type="upload" />
        Upload
      </button>
    </tri-upload>
  `
})
export class TriDemoUploadTransformFileComponent {
  transformFile = (file: TriUploadFile): Observable<Blob> =>
    new Observable((observer: Observer<Blob>) => {
      const reader = new FileReader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.readAsDataURL(file as any);
      reader.onload = () => {
        const canvas = document.createElement('canvas');
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.onload = () => {
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = 'red';
          ctx.textBaseline = 'middle';
          ctx.fillText('Ant Design', 20, 20);
          canvas.toBlob(blob => {
            observer.next(blob!);
            observer.complete();
          });
        };
      };
    });
}
