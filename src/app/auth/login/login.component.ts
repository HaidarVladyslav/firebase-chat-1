import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from "./ui/login-form/login-form.component";
import { LoginService } from './data-access/login.service';
import { AuthService } from '../../shared/data-access/auth.service';
import { LoaderComponent } from "../../shared/ui/loader/loader.component";

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
      @if(!authService.user()) {
        <app-login-form [loginStatus]="loginService.status()" (login)="loginService.login$.next($event)" />
      } @else {
       <app-loader />
      }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent, LoaderComponent]
})
export default class LoginComponent {
  public loginService = inject(LoginService);
  public authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['chat']);
      }
    })
  }
}
