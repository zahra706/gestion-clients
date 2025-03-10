import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Allow access to the login page without a token
    if (this.router.url === '/login') {
      return true;
    }
  
    // Check for a valid token for all other routes
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }


  
}
