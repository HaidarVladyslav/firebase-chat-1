import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Observable, Subject, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { collection, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { UserData } from '../../shared/interfaces/user';
import { FIRESTORE } from '../../app.config';

export interface SearchUsersState {
  users: UserData[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private firestone = inject(FIRESTORE);

  // state
  private state = signal<SearchUsersState>({
    users: null
  });

  // selectors
  users = computed(() => this.state().users);

  searchUserByDisplayNameControl$ = new FormControl('');
  searchUser$ = this.searchUserByDisplayNameControl$.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  resetUser$ = new Subject<void>();
  reset$ = this.resetUser$.pipe(tap(() => this.searchUserByDisplayNameControl$.setValue('')));

  constructor() {
    this.searchUser$.pipe(
      switchMap((name) => {
        if (!name || !name?.length) {
          return of(null);
        } else {
          return this.getUsersByDisplayName(name)
        }
      }),
      takeUntilDestroyed()
    ).subscribe((data) => {
      this.state.update((state) => ({
        ...state,
        users: data
      }))
    }
    );

    this.reset$.pipe(takeUntilDestroyed())
      .subscribe(() => this.state.update((state) => ({ ...state, users: null })));
  }

  getUsersByDisplayName(name: UserData['displayName']) {
    const usersCollection = query(
      collection(this.firestone, 'users'),
      where('displayName', '==', name)
      // orderBy(),
      // limit(50)
    );

    return collectionData(usersCollection, { idField: 'id' }) as Observable<UserData[]>;
  }
}
