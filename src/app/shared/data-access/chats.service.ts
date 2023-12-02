import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, Subject, combineLatest, debounceTime, defer, distinctUntilChanged, map, switchMap, zip } from 'rxjs';
import { collection, doc, getDoc, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { collection as rxFireCollection, collectionCount, collectionData, doc as rxDoc } from 'rxfire/firestore';
import { FIRESTORE } from '../../app.config';
import { AuthService } from './auth.service';
import { UserData } from '../interfaces/user';
import { SidebarChat } from '../interfaces/chat';
import { SearchService } from '../../chat/data-access/search.service';
import { Message } from '../interfaces/message';

export interface ChatsState {
  chats: SidebarChat[] | null;
  currentChatId: string | null;
  messages: Message[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);
  private searchService = inject(SearchService);

  private chats$ = this.getChats();

  // state
  private state = signal<ChatsState>({
    chats: null,
    currentChatId: null,
    messages: null
  });

  chats = computed(() => {
    return this.state().chats && this.state().chats!.sort((a,b) => b[1].date?.toDate().getTime() - a[1].date?.toDate().getTime());
  });
  currentChatId = computed(() => this.state().currentChatId);
  currentSelectedChatUserData = computed(() => {
    if (this.chats() && this.currentChatId()) {
      return this.chats()!.find(chat => chat[0] === this.currentChatId())
    } else {
      return null;
    }
  });
  messages = computed(() => this.state().messages);

  userToCheckForChatExisting$ = new Subject<UserData>();
  chatIdFromFoundAndCurrentUser$ = this.userToCheckForChatExisting$.pipe(map((foundUser) => {
    this.searchService.resetUser$.next();
    const currentUserId = this.authService.user()?.uid!;
    const combinedId = currentUserId > foundUser.uid ? currentUserId + foundUser.uid : foundUser.uid + currentUserId;
    return combinedId;
  }));
  ifChatExists$ = this.chatIdFromFoundAndCurrentUser$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((id) => this.checkIfChatDoesExist(id))
  );
  handleUsersChatsCreating$ = zip([
    this.chatIdFromFoundAndCurrentUser$,
    this.ifChatExists$,
    this.userToCheckForChatExisting$
  ]).pipe(
    switchMap(([chatId, ifChatExist, foundUser]) => {
      if (!ifChatExist) {
        return combineLatest([
          this.createChatWithUser(chatId),
          this.updateChatsForBothUserForUserChatsDatabase(chatId, foundUser)
        ]);
      } else {
        return EMPTY;
      }
    })
  );

  currentChatId$ = new Subject<string>();
  currentChatData$ = this.currentChatId$.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((id) => this.getChat(id))
  )

  resetState$ = new Subject<void>();

  constructor() {
    this.handleUsersChatsCreating$.pipe(takeUntilDestroyed()).subscribe();

    this.chats$.pipe(takeUntilDestroyed())
      .subscribe((chats) => {
        this.state.update((state) => ({
          ...state,
          chats
        }))
      });

    this.currentChatId$.pipe(takeUntilDestroyed())
      .subscribe((currentChatId) => this.state.update((state) => ({ ...state, currentChatId })));

    this.currentChatData$.pipe(takeUntilDestroyed())
      .subscribe((messages) => {
        this.state.update((state) => ({ ...state, messages }))
      })
  }

  createChatWithUser(chatId: string) {
    const chatCollection = collection(this.firestore, 'chats');
    return defer(() => setDoc(doc(chatCollection, chatId), { messages: [] }));
  }

  updateChatsForBothUserForUserChatsDatabase(chatId: string, user: UserData) {
    const userChatCollection = collection(this.firestore, 'userChats');
    return zip([
      defer(() => updateDoc(doc(userChatCollection, this.authService.user()?.uid!), {
        [chatId + '.userInfo']: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        [chatId + '.date']: serverTimestamp()
      })),
      defer(() => updateDoc(doc(userChatCollection, user.uid), {
        [chatId + '.userInfo']: {
          uid: this.authService.user()!.uid,
          displayName: this.authService.user()!.displayName,
          photoURL: this.authService.user()!.photoURL
        },
        [chatId + '.date']: serverTimestamp()
      })),
    ])
  }

  checkIfChatDoesExist(chatUserId: string) {
    const chatCollection = query(
      collection(this.firestore, 'chats'),
      where('id', '==', chatUserId)
    )
    return collectionCount(chatCollection);
  }

  getChats() {
    const chatsDocRef = doc(this.firestore, 'userChats', this.authService.user()?.uid!);
    return rxDoc(chatsDocRef).pipe(map(d => d.data() ? Object.entries(d.data()!) : []));
  }

  getChat(chatId: string) {
    const chatsDocRef = doc(this.firestore, 'chats', chatId);
    return rxDoc(chatsDocRef).pipe(map((d) => {
      return d.data()?.['messages'];
    }));
  }
}
