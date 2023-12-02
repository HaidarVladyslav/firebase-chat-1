import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginStatus } from '../../data-access/login.service';
import { Credentials } from '../../../../shared/interfaces/credentials';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
  <form [formGroup]="loginForm" (ngSubmit)="login.emit(loginForm.getRawValue())" class="fixed bottom-0 top-0 left-0 right-0 w-96 h-fit m-auto grid items-center bg-zinc-100 p-4 rounded-xl border-slate-100">
    <h3 class="text-2xl text-center font-bold text-purple-700">Chat App</h3>
    <p class="text-lg text-center"><small>Login</small></p>
    <div class="form-control mb-2">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email</label>
      <input formControlName="email" type="text" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@john.com" required>
    </div>
    <div class="form-control mb-2">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">password</label>
      <input formControlName="password" type="text" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="password" required>
    </div>
    <div class="flex justify-center">
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium mt-2 rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign in</button>
    </div>
    <p class="text-center text-base mt-2">You don't have an account? <a routerLink="/register" class="text-blue-600 hover:underline dark:text-blue-500">Register</a></p>
  </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  @Input({ required: true }) loginStatus!: LoginStatus;
  @Output() login = new EventEmitter<Credentials>();

  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: [''],
    password: ['']
  });
}
