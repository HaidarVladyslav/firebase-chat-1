import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarChat } from '../../../shared/interfaces/chat';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [],
  template: `
    @if(!chats) {
      <div>
        <p class="text-sm text-gray-300 text-center">Loading</p>
      </div>
    } @else {
      <div class="chats">
        @for (chat of chats; track chat[0]) {
          <div (click)="chatSelect.emit(chat)" class="chats-item p-2.5 flex items-center gap-2.5 text-white cursor-pointer hover:bg-indigo-900 transition-all">
            <img class="h-12 w-12 bg-gray-100 rounded-full object-cover dark:bg-gray-600" [src]="chat[1].userInfo.photoURL" [alt]="chat[1].userInfo.displayName">
            <div>
              <span class="font-bold">{{ chat[1].userInfo.displayName }}</span>
              <p class="text-sm text-gray-300">{{ chat[1].lastMessage?.text }}</p>
            </div>
          </div>
        } @empty {
          <div>
            <p class="text-sm text-gray-300">You don't have chats yet</p>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent {
  @Input({ required: true }) chats!: SidebarChat[] | null;
  @Output() chatSelect = new EventEmitter<SidebarChat>();
}
