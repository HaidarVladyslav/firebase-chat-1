import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterFormComponent } from "./ui/register-form/register-form.component";
import { RegisterService } from './data-access/register.service';
import { AuthService } from '../../shared/data-access/auth.service';
import { LoaderComponent } from "../../shared/ui/loader/loader.component";

@Component({
  selector: 'app-register',
  standalone: true,
  template: `
    @if(authService.user() === null) {
      <app-register-form [status]="registerService.status()" (register)="registerService.createUser$.next($event)" />
    } @else {
       <app-loader />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RegisterService],
  imports: [RegisterFormComponent, LoaderComponent]
})
export default class RegisterComponent {
  public registerService = inject(RegisterService);
  public authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user() && this.registerService.profileUpdated()) {
        this.router.navigate(['chat']);
      }
    })
  }
}
