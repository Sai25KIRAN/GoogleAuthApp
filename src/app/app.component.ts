import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-social-login-app';
  user: SocialUser | null = null;
  isLoggedIn = false;

  constructor(private authService: SocialAuthService, private http: HttpClient) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLoggedIn = (user != null || localStorage.getItem('token') != null);
      
      if (user && !localStorage.getItem('token')) {
        // Send idToken to the .NET Core Backend API
        this.sendTokenToBackend(user.idToken);
      }
    });
  }

  sendTokenToBackend(token: string) {
    this.http.post(`${environment.apiUrl}/api/auth/google-login`, { idToken: token })
      .subscribe({
        next: (res: any) => {
          console.log('Backend authentication successful!', res);
          // Store your application's JWT in LocalStorage here
          localStorage.setItem('token', res.token);
        },
        error: (err) => console.error('Backend authentication failed', err)
      });
  }

  // --- SIGN OUT METHOD ---
  signOut(): void {
    this.authService.signOut().then(() => {
      localStorage.removeItem('token'); // Clear your application's JWT
      this.user = null;
      this.isLoggedIn = false;
      console.log('User signed out successfully.');
    }).catch(err => {
      // Fallback if no active Google session exists globally
      localStorage.removeItem('token');
      this.user = null;
      this.isLoggedIn = false;
    });
  }
}