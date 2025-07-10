import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriImageModule, TriImageService } from 'ng-zorro-antd/image';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriImageModule, TriInputNumberModule],
  template: `
    <div>
      <label>
        <span>scale step:</span>
        <tri-input-number [(ngModel)]="scaleStep" [min]="0.1" [step]="1"></tri-input-number>
      </label>

      <button tri-button type="primary" (click)="onClick()">Preview</button>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `
  ]
})
export class TriDemoImageControlledPreviewComponent {
  private imageService = inject(TriImageService);
  scaleStep = 0.5;
  readonly images = [
    {
      src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      alt: ''
    }
  ];

  onClick(): void {
    this.imageService.preview(this.images, { zoom: 1, rotate: 0, scaleStep: this.scaleStep });
  }
}
