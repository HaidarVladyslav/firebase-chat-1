import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/data-access/auth.service';
import { SidebarComponent } from "./ui/sidebar/sidebar.component";
import { ChatBoxComponent } from "./ui/chat-box/chat-box.component";
import { SearchService } from './data-access/search.service';
import { ChatsService } from '../shared/data-access/chats.service';
import { InputService } from './data-access/input.service';
import { UploadService } from '../shared/data-access/upload.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  template: `
    <main class="chat-page w-screen h-screen flex justify-center items-center">
      <div class="overflow-hidden grid grid-cols-3 h-3/4 w-10/12 xl:w-2/3 border border-cyan-50 rounded-lg">
        <app-sidebar [user]="authService.user()!" [searchControl]="searchService.searchUserByDisplayNameControl$" [foundUsers]="searchService.users()" [chats]="chatsService.chats()" (foundUserSelect)="chatsService.userToCheckForChatExisting$.next($event)" (logout)="authService.logout()" (chatSelect)="chatsService.currentChatId$.next($event[0])" class="col-span-1 bg-indigo-700" />
        <app-chat-box [userName]="chatsService.currentSelectedChatUserData()?.[1]?.userInfo?.displayName!" [messages]="chatsService.messages()" [fileControl]="inputService.inputControl$.controls.fileControl" [currentUser]="authService.user()!" [senderUserPhoto]="chatsService.currentSelectedChatUserData()?.[1]?.userInfo?.photoURL!" [textControl]="inputService.inputControl$.controls.textControl" class="col-span-2" (send)="inputService.send$.next()" />
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarComponent, ChatBoxComponent],
  providers: [InputService, UploadService]
})
export default class ChatComponent {
  private router = inject(Router);
  public authService = inject(AuthService);
  public searchService = inject(SearchService);
  public chatsService = inject(ChatsService);
  public inputService = inject(InputService);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['login']);
      }
    })
  }
}
