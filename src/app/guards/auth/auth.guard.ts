import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate() {
    if (!this.auth.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  canActivateChild(){
    if (!this.auth.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
  
}
