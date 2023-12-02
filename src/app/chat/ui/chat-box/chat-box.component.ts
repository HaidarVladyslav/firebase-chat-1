import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessagesComponent } from '../messages/messages.component';
import { InputComponent } from '../input/input.component';
import { Message } from '../../../shared/interfaces/message';
import { AuthUser } from '../../../shared/data-access/auth.service';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [MessagesComponent, InputComponent],
  template: `
    <div class="chat h-full flex flex-col">
      <div class="chat-info h-12 p-2 bg-indigo-500 flex justify-between items-center">
        @if (userName) {
          <span class="text-white font-bold">{{ userName }}</span>
          <div class="chat-icons flex gap-3 text-white text-2xl">
            <button type="button" class="flex justify-center items-center p-1 transition-all cursor-pointer rounded-md hover:bg-indigo-400"><ion-icon name="videocam"></ion-icon></button>
            <button type="button" class="flex justify-center items-center p-1 transition-all cursor-pointer rounded-md hover:bg-indigo-400"><ion-icon name="person-add"></ion-icon></button>
            <button type="button" class="flex justify-center items-center p-1 transition-all cursor-pointer rounded-md hover:bg-indigo-400"><ion-icon name="ellipsis-horizontal-sharp"></ion-icon></button>
          </div>
        } @else {
          <span class="text-white font-bold">Chat Not Selected</span>
        }
      </div>
      <app-messages [messages]="messages" [currentUser]="currentUser" [senderUserPhoto]="senderUserPhoto" class="block h-full bg-indigo-200 max-h-full overflow-auto" />
      <app-input [textControl]="textControl" [fileControl]="fileControl" (send)="send.emit()" />
    </div>
  `,
  styles: `
    :host {
      max-height: 100%;
      overflow-y: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatBoxComponent {
  @Output() send = new EventEmitter<void>();
  @Input({ required: true }) userName!: string | null;
  @Input({ required: true }) messages!: Message[] | null;
  @Input({ required: true }) textControl!: FormControl;
  @Input({ required: true }) fileControl!: FormControl;
  @Input({ required: true }) currentUser!: AuthUser;
  @Input({ required: true }) senderUserPhoto!: string;
}
