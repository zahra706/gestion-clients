import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ApplicationUser } from '../model/application-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7288/api/Auth'; 

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {}

  
  register(name: string, email: string, position: string, password: string): Observable<any> {
    const payload = {
      name,
      email,
      position,
      password
    };

    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError(this.handleError)
    );
  }

  
  login(userName: string, password: string): Observable<any> {
    const payload = {
      userName,
      password
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/login`, payload, { headers }).pipe(
      catchError(this.handleError),
      map(response => {
        
        const token = response.token.data.token;
        const expiryDate = response.token.data.expiryDate;
  
        if (!token || !expiryDate) {
          throw new Error('No token or expiry date received from the server');
        }
  
       
        this.setToken(token);
        this.setTokenExpiry(expiryDate);
        console.log('Token stored:', token); 
  
        
        return this.getUserProfile().pipe(
          map(userProfile => {
            this.setUserId(userProfile.id); 
            return response;
          })
        );
      }),
      
      switchMap(response => response)
    );
  }
  
  logout(): void {
    this.removeToken();
    this.removeUserId();
    this.removeTokenExpiry();
    this.router.navigate(['/login']);
  }

  
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  
  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }


  setTokenExpiry(expiryDate: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('tokenExpiry', expiryDate);
    }
  }

  
  removeTokenExpiry(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('tokenExpiry');
    }
  }

  
  setUserId(userId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userId', userId);
    }
  }

  getUserProfile(): Observable<ApplicationUser> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found. Please log in.'); 
      return throwError('No token found. Please log in.');
    }
  
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get<ApplicationUser>(`${this.apiUrl}/userProfile`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

 
  removeUserId(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userId');
    }
  }

  
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiryDate = this.getTokenExpiry();
    if (!token || !expiryDate) {
      return false;
    }
    return new Date(expiryDate) > new Date();
  }

  
  getTokenExpiry(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('tokenExpiry');
    }
    return null;
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      console.error('Server error:', error.error); 
      switch (error.status) {
        case 400:
          errorMessage = error.error.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
      }
    }
    return throwError(errorMessage);
  }
  isTokenExpired(token: string): boolean {
    if (!token) return true;
  
    const expiryDate = this.getTokenExpiry();
    if (!expiryDate) return true;
  
    return new Date(expiryDate) < new Date();
  }
}