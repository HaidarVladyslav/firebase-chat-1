import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap, zip } from 'rxjs';
import { updateProfile } from 'firebase/auth';
import { AuthService } from '../../../shared/data-access/auth.service';
import { RegisterCredentials } from '../../../shared/interfaces/credentials';
import { UsersService } from '../../../shared/data-access/users.service';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
  profileUpdated: boolean;
}

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  // sources
  error$ = new Subject<any>();
  createUser$ = new Subject<RegisterCredentials>();

  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        }),
      ),
    )
  );

  profileUpdated$ = zip([
    this.createUser$,
    this.userCreated$
  ]).pipe(
    switchMap(([credentials, user]) => {
      this.usersService.addUser$.next({ displayName: credentials.displayName, photoURL: credentials.photoURL, uid: user.user.uid, email: credentials.email });
      this.usersService.addUserChats$.next(user.user.uid);
      return updateProfile(user.user, { displayName: credentials.displayName, photoURL: credentials.photoURL })
    })
  );

  // state
  private state = signal<RegisterState>({
    status: 'pending',
    profileUpdated: true,
  });

  // selectors
  status = computed(() => this.state().status);
  profileUpdated = computed(() => this.state().profileUpdated);

  constructor() {
    // reducers
    // this.userCreated$.pipe(takeUntilDestroyed()).subscribe(() =>
    //   this.state.update((state) => ({
    //     ...state,
    //     status: 'success'
    //   }))
    // );

    this.createUser$.pipe(takeUntilDestroyed()).subscribe(() =>
      this.state.update((state) => ({
        ...state,
        status: 'creating',
        profileUpdated: false
      }))
    );

    this.error$.pipe(takeUntilDestroyed()).subscribe(() =>
      this.state.update((state) => ({
        ...state,
        status: 'error'
      }))
    );

    this.profileUpdated$.pipe(takeUntilDestroyed()).subscribe(() =>
      this.state.update((state) => ({
        ...state,
        profileUpdated: true,
        status: 'success'
      }))
    );
  }
}
