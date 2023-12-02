import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, filter, map, switchMap, tap } from 'rxjs';
import { ref, uploadBytesResumable, TaskState } from 'firebase/storage';
import { percentage, getDownloadURL } from 'rxfire/storage';
import { FIREBASE_STORAGE } from '../../app.config';
import { AuthService } from './auth.service';

export type UploadStatus = TaskState | 'initial';

interface UploadState {
  status: UploadStatus,
  fileUrl: string,
  percentage: number,
}

@Injectable()
export class UploadService {
  private storage = inject(FIREBASE_STORAGE);
  private authService = inject(AuthService);
  private user = this.authService.user();

  state = signal<UploadState>({
    status: 'initial',
    fileUrl: '',
    percentage: 0
  });

  status = computed(() => this.state().status);
  percentage = computed(() => this.state().percentage);
  fileUrl = computed(() => this.state().fileUrl);

  fileToUpload$ = new Subject<File>();
  fileToUploadTask$ = this.fileToUpload$.pipe(map((file) =>
    uploadBytesResumable(ref(this.storage, file.name || this.user?.displayName || Date.now().toString()), file)
  ));
  fileUploadPercentage$ = this.fileToUploadTask$.pipe(switchMap((task) => percentage(task)));

  reset$ = new Subject<void>();

  constructor() {
    this.fileUploadPercentage$.pipe(
      tap((data) => this.state.update((state) => ({ ...state, status: data.snapshot.state, percentage: Number(data.progress.toFixed(2)) }))),
      filter((data) => data.progress === 100 && data.snapshot.state === 'success'),
      switchMap((data) => getDownloadURL(data.snapshot.ref)),
      takeUntilDestroyed()
    ).subscribe((fileUrl) =>
      this.state.update((state) => ({
        ...state,
        fileUrl
      }))
    );

    this.reset$.subscribe(() => this.state.update((state) => ({
      ...state,
      status: 'initial',
      percentage: 0,
      fileUrl: ''
    })));
  }
}
