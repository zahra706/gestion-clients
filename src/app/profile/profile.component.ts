// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ApplicationUser } from '../model/application-user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
  
})
export class ProfileComponent implements OnInit {
  user: ApplicationUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserProfile().subscribe({
      next: (data: ApplicationUser) => {
        this.user = data;
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération du profil utilisateur', err);
        if (err === 'No token found. Please log in.') {
          this.router.navigate(['/login']); // Redirect to login if no token is found
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}