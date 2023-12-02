import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterStatus } from '../../data-access/register.service';
import { RegisterCredentials } from '../../../../shared/interfaces/credentials';
import { UploadService } from '../../../../shared/data-access/upload.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, NgIf],
  template: `
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="fixed bottom-0 top-0 left-0 right-0 w-96 h-fit m-auto grid items-center bg-zinc-100 p-4 rounded-xl border-slate-100">
    <h3 class="text-2xl text-center font-bold text-purple-700">Chat App</h3>
    <p class="text-lg text-center"><small>Register</small></p>
    <div class="form-control mb-2">
      <label for="display_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">display name</label>
      <input formControlName="displayName" type="text" id="display_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required>
    </div>
    <div class="form-control mb-2">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email</label>
      <input formControlName="email" type="text" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@john.com" required>
    </div>
    <div class="form-control mb-2">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">password</label>
      <input formControlName="password" type="text" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="password" required>
    </div>
    <div class="form-control my-2">
      <label for="photoUrl" class="flex mb-2 text-sm font-medium text-gray-900 dark:text-white items-center text-sky-600 gap-2">
      <ion-icon class="text-2xl" name="image-outline"></ion-icon> <span>Add an avatar</span>
      </label>
      <input (change)="setPhoto($event)" type="file" id="photoUrl" class="hidden" required>
      <div *ngIf="uploadingStatus() === 'running' || uploadingStatus() === 'success'" class="h-2.5 w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div class="h-2.5 bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all" [style.width.%]="percentage()" [class.bg-green-400]="uploadingStatus() === 'success' || percentage() === 100"></div>
      </div>
    </div>
    <div class="flex justify-center">
      <button [disabled]="status === 'creating' || !registerForm.valid || uploadingStatus() !== 'success'" type="submit" class="text-white bg-blue-700 font-medium mt-2 rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      [ngClass]="{'bg-blue-400 dark:bg-blue-500 cursor-not-allowed': !registerForm.valid,
      'hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300': registerForm.valid
    }"
      >Sign up</button>
    </div>
    <p class="text-center text-base mt-2">You do have an account? <a routerLink="/login" class="text-blue-600 hover:underline dark:text-blue-500">Login</a></p>
  </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [UploadService]
})
export class RegisterFormComponent {
  @Input({ required: true }) status!: RegisterStatus;
  @Output() register = new EventEmitter<RegisterCredentials>();

  private fb = inject(FormBuilder);
  private uploadService = inject(UploadService);
  uploadingStatus = this.uploadService.status;
  percentage = this.uploadService.percentage;

  registerForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    photoURL: ''
    // confirmPassword: ['', [Validators.required]]
  });

  setPhoto(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files[0]) {
      const file = files[0];
      this.uploadService.fileToUpload$.next(file);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const credentials = this.registerForm.getRawValue();
      credentials.photoURL = this.uploadService.fileUrl();
      this.register.emit(credentials);
      this.uploadService.reset$.next();
    }
  }
}
