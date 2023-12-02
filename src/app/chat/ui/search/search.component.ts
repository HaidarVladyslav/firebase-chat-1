import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserData } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="search border-b border-slate-200">
      <div class="search-form p-2.5">
        <input [formControl]="searchControl" class="bg-transparent border-none text-white outline-none placeholder-gray-100" type="text" placeholder="Find a user">
      </div>
      @if (foundUsers) {
        @for (user of foundUsers; track user.uid) {
          <div (click)="foundUserSelect.emit(user)" class="search-list p-2.5 flex items-center gap-2.5 text-white cursor-pointer hover:bg-indigo-900 transition-all">
            <img class="h-12 w-12 bg-gray-100 rounded-full object-cover dark:bg-gray-600" [src]="user.photoURL" [alt]="user.displayName">
            <div class="search-list__item">
              <span class="font-bold">{{ user.displayName }}</span>
            </div>
          </div>
        } @empty {
          <div class="search-list p-2.5 flex items-center justify-center gap-2.5 text-white">
            <span class="font-bold">Users Not Found</span>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  @Input({ required: true }) searchControl!: FormControl;
  @Input({ required: true }) foundUsers!: UserData[] | null;
  @Output() foundUserSelect = new EventEmitter<UserData>();
}
