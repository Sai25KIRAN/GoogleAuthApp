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

  user: SocialUser | null = null;
  isLoggedIn = false;

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.authService.authState.subscribe((user) => {

      this.user = user;
      this.isLoggedIn = !!user;

      if (user?.idToken) {
        this.sendTokenToBackend(user.idToken);
      }

    });

  }

  sendTokenToBackend(idToken: string): void {

    this.http.post(
      `${environment.apiUrl}/api/auth/google-login`,
      {
        idToken: idToken
      }
    ).subscribe({

      next: (res: any) => {

        

        localStorage.setItem('token', res.token);

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  signOut() {

    this.authService.signOut();

    localStorage.removeItem('token');

    this.user = null;

    this.isLoggedIn = false;

  }

}