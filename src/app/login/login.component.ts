import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the login form
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]], // Use userName instead of email
      password: ['', Validators.required]
    });

    // Initialize the registration form
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required], // Add position field
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Handle login form submission
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = ''; // Réinitialisation des erreurs
  
      console.log('Form Values:', this.loginForm.value); // 🔍 Debug
  
      this.authService.login(
        this.loginForm.value.userName,
        this.loginForm.value.password
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful:', response);
          this.router.navigate(['/profile']); // Redirection après connexion
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login failed:', error);
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
  

  // Handle registration form submission
  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = ''; // Clear previous error messages
  
      console.log('Register form values:', this.registerForm.value); // Debug form data
  
      this.authService.register(
        this.registerForm.value.name,
        this.registerForm.value.email,
        this.registerForm.value.position,
        this.registerForm.value.password
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Inscription réussie:', response); // Check response
          alert('Inscription réussie ! Connectez-vous maintenant.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Inscription échouée:', error); // Debug error
          this.errorMessage = error; // Show the actual error message
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
  
}