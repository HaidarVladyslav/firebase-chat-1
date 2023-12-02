import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Message } from '../../../shared/interfaces/message';
import { AuthUser } from '../../../shared/data-access/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="message flex gap-5 mb-2" [class.owner]="currentUser!.uid === message.sender">
      <div class="message-info flex flex-col font-light text-gray-600 min-w-40">
        <img class="h-10 w-10 bg-gray-100 rounded-full object-cover dark:bg-gray-600" [src]="currentUser!.uid === message.sender ? currentUser?.photoURL : senderUserPhoto" alt="walking girl">
        <span>{{ message.date.toDate() | date: 'hh:mm' }}</span>
      </div>
      <div class="message-content max-w-4/5 flex flex-start flex-col items-start gap-2.5 mb-2.5">
        <p class="w-full bg-slate-50 px-4 py-1.5 rounded-r-lg rounded-b-lg break-all min-h-36">{{ message.text }}</p>
        @if(message.img) {
          <img class="max-h-96 max-w-xs bg-gray-100 rounded object-cover dark:bg-gray-600" [src]="message.img" [alt]="message.img">
        }
      </div>
    </div>
  `,
  styles: `
    .owner {
      flex-direction: row-reverse;

      .message-content {
        align-items: flex-end;
      }

      p {
        color: white;
        @apply bg-indigo-400;
        border-top-right-radius: 0;
        border-top-left-radius: 8px;
      }
    }

    .min-w-40 {
      min-width: 40px;
    }

    .min-h-36 {
      min-height: 36px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {
  @Input({ required: true }) message!: Message;
  @Input({ required: true }) currentUser!: AuthUser;
  @Input({ required: true }) senderUserPhoto!: string;
}
