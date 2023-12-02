import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UploadService } from '../../../shared/data-access/upload.service';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="input bg-white px-2 py-4 flex justify-between items-center gap-5">
      <input [formControl]="textControl" class="w-full h-full border-0 outline-0 text-lg text-indigo-800 placeholder-gray-300" type="text" placeholder="Type something">
      <div class="send flex items-center gap-2.5">
        <button class="flex justify-center items-center cursor-pointer transition-all hover:bg-indigo-300 hover:text-white p-1 rounded-lg">
          <ion-icon class="text-2xl" name="attach-sharp"></ion-icon>
        </button>
        <input type="file" class="hidden" id="file" (change)="setPhoto($event)">
        <label for="file" class="flex justify-center items-center cursor-pointer">
            <ion-icon class="text-2xl" name="image-sharp"></ion-icon>
        </label>
        <button [disabled]="!textControl.valid" (click)="send.emit()" type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Send</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InputComponent {
  @Input({ required: true }) textControl!: FormControl;
  @Input({ required: true }) fileControl!: FormControl;
  @Output() send = new EventEmitter<void>();

  private uploadService = inject(UploadService);

  setPhoto(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files[0]) {
      const file = files[0];
      this.uploadService.fileToUpload$.next(file);
    }
  }
}
