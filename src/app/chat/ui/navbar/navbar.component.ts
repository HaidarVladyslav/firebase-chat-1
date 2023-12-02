import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <header class="flex items-center justify-between text-white bg-indigo-900 h-12 p-2.5">
      <h1 class="font-bold hidden xl:block">Chat App</h1>
      <div class="user flex gap-2.5 items-center w-full xl:w-max">
        <img class="h-6 w-6 bg-gray-100 rounded-full object-cover dark:bg-gray-600" [src]="user.photoURL" [alt]="user.displayName">
        <span>{{ user.displayName }}</span>
        <button (click)="logout.emit()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ml-auto absolute md:static left-2 bottom-2">logout</button>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  @Output() logout = new EventEmitter<void>();
  @Input({ required: true }) user!: User;
}
