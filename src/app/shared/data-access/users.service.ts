import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, defer, switchMap } from 'rxjs';
import { collection, doc, setDoc } from 'firebase/firestore';
import { AddUserData } from '../interfaces/user';
import { FIRESTORE } from '../../app.config';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private firestore = inject(FIRESTORE);

  addUser$ = new Subject<AddUserData>();
  addUserChats$ = new Subject<AddUserData['uid']>();

  constructor() {
    this.addUser$.pipe(
      switchMap((user) => this.addUser(user)),
      takeUntilDestroyed()
    ).subscribe();

    this.addUserChats$.pipe(
      switchMap((user) => this.addInitialChatsForUser(user)),
      takeUntilDestroyed()
    ).subscribe();
  }

  addUser(user: AddUserData) {
    const usersCollection = collection(this.firestore, 'users');
    return defer(() => setDoc(doc(usersCollection, user.uid), user));
  }

  addInitialChatsForUser(userId: AddUserData['uid']) {
    const userChatsCollection = collection(this.firestore, 'userChats');
    return defer(() => setDoc(doc(userChatsCollection, userId), {}));
  }
}
