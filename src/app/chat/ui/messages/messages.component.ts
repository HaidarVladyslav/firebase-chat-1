import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, signal } from '@angular/core';
import { MessageComponent } from "../message/message.component";
import { Message } from '../../../shared/interfaces/message';
import { AuthUser } from '../../../shared/data-access/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessageComponent],
  template: `
    <div #scrollable class="messages bg-indigo-200 p-2">
      @for (message of messagesS(); track message.id) {
        <app-message [message]="message" [currentUser]="currentUser" [senderUserPhoto]="senderUserPhoto" />
      } @empty {
        <p>You don't have any messages yet.</p>
      }
    </div>
  `,
  styles: `
    :host {
      transition: background-color 0.3s ease;
      background-clip: content-box;
      &:hover {
        transition: background-color 0.3s ease;
        &::-webkit-scrollbar-thumb {
          @apply bg-indigo-500;
          @apply border-indigo-300;
        }
        &::-webkit-scrollbar-track {
          @apply bg-indigo-300;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnChanges, AfterViewChecked {
  @ViewChild('scrollable', { static: true }) private scrollable!: ElementRef;
  @Input({ required: true }) set messages(value: Message[] | null) {
    this.messagesS.set(value);
  };
  @Input({ required: true }) currentUser!: AuthUser;
  @Input({ required: true }) senderUserPhoto!: string;
  messagesS = signal<Message[] | null>(null);

  private isInitialViewChecked: boolean = true;

  ngAfterViewChecked(): void {
    // TO DO - distinguish changes for initial instant scroll into view
    if (this.isInitialViewChecked) {
      this.scrollToBottom('instant');
    }
    this.isInitialViewChecked = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkForMessagesChangesFromCurrentUserToScrollBottom(changes);
  }

  scrollToBottom(speed: 'smooth' | 'instant' = 'instant') {
    const el: HTMLDivElement = this.scrollable.nativeElement;
    el.scrollIntoView({ 'behavior': speed, block: 'end', inline: 'nearest' });
  }

  private checkForMessagesChangesFromCurrentUserToScrollBottom(changes: SimpleChanges) {
    if (changes['messages'] && 
    changes['messages'].currentValue && 
    changes['messages'].currentValue[changes['messages'].currentValue.length - 1].sender === this.currentUser!.uid && 
    changes['messages'].currentValue.length === changes['messages'].previousValue?.length) {
      this.scrollToBottom('smooth');
    }
  }
}
