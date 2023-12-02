import { Injectable, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, defer, merge, switchMap, zip } from 'rxjs';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import * as uuid from 'uuid';
import { FIRESTORE } from '../../app.config';
import { ChatsService } from '../../shared/data-access/chats.service';
import { AuthService } from '../../shared/data-access/auth.service';
import { UploadService } from '../../shared/data-access/upload.service';
import { Message } from '../../shared/interfaces/message';

@Injectable()
export class InputService {
  private chatsService = inject(ChatsService);
  private firestore = inject(FIRESTORE);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private uploadService = inject(UploadService);

  // sources
  currentChatId = this.chatsService.currentChatId;

  inputControl$ = this.fb.group({
    textControl: ['', [Validators.required]],
    fileControl: [''],
  });

  send$ = new Subject<void>();

  constructor() {
    this.send$.pipe(
      switchMap(() => merge(
        this.sendMessage(),
        this.updateLastUsersChatMessage()
      )),
      takeUntilDestroyed()
    ).subscribe(() => (this.inputControl$.reset(), this.inputControl$.updateValueAndValidity(), this.uploadService.reset$.next()));

    effect(() => {
      if (!this.currentChatId()) {
        this.inputControl$.disable();
      } else {
        this.inputControl$.enable();
      }
    })

    effect(() => {
      if (this.uploadService.fileUrl()) {
        this.inputControl$.controls.fileControl.setValue(this.uploadService.fileUrl());
      }
    })
  }

  sendMessage() {
    const chatDoc = doc(this.firestore, 'chats', this.currentChatId()!);
    const message: Message = {
      id: uuid.v4(),
      text: this.inputControl$.getRawValue().textControl!,
      sender: this.authService.user()!.uid,
      date: Timestamp.now(),
    };
    if (this.inputControl$.controls.fileControl.value?.length) {
      message.img = this.inputControl$.controls.fileControl.value
    }
    return defer(() => updateDoc(chatDoc, {
      messages: arrayUnion(message)
    }));
  }

  updateLastUsersChatMessage() {
    const currentUserChatDoc = doc(this.firestore, 'userChats', this.authService.user()!.uid);
    const userChatDoc = doc(this.firestore, 'userChats', this.chatsService.currentSelectedChatUserData()?.[1].userInfo.uid!);
    return zip([
      defer(() => updateDoc(currentUserChatDoc, {
        [this.chatsService.currentChatId() + '.lastMessage']: {
          text: this.inputControl$.controls.textControl.value
        },
        [this.chatsService.currentChatId() + '.date']: serverTimestamp()
      })),
      defer(() => updateDoc(userChatDoc, {
        [this.chatsService.currentChatId() + '.lastMessage']: {
          text: this.inputControl$.controls.textControl.value
        },
        [this.chatsService.currentChatId() + '.date']: serverTimestamp()
      })),
    ])
  }

}
