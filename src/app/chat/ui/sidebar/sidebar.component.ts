import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'firebase/auth';
import { NavbarComponent } from "../navbar/navbar.component";
import { SearchComponent } from "../search/search.component";
import { ChatsComponent } from "../chats/chats.component";
import { UserData } from '../../../shared/interfaces/user';
import { SidebarChat } from '../../../shared/interfaces/chat';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <app-navbar [user]="user" (logout)="logout.emit()" />
    <app-search [searchControl]="searchControl" [foundUsers]="foundUsers" (foundUserSelect)="foundUserSelect.emit($event)" />
    <app-chats [chats]="chats" (chatSelect)="chatSelect.emit($event)" />
  `,
  styles: `
      :host {
        position: relative;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarComponent, SearchComponent, ChatsComponent]
})
export class SidebarComponent {
  @Output() logout = new EventEmitter<void>();
  @Output() foundUserSelect = new EventEmitter<UserData>();
  @Output() chatSelect = new EventEmitter<SidebarChat>();
  @Input({ required: true }) user!: User;
  @Input({ required: true }) searchControl!: FormControl;
  @Input({ required: true }) foundUsers!: UserData[] | null;
  @Input({ required: true }) chats!: SidebarChat[] | null;
}
