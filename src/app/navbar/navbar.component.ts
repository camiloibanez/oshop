import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUser } from '../models/app-user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  appUser?: AppUser;
  subscription: Subscription;

  constructor(private auth: AuthService) { 
    this.subscription = auth.appUser$.subscribe(appUser => this.appUser = appUser ? appUser : undefined);
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
