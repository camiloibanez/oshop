import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'oshop';
  subscription: Subscription;

  constructor(private userService: UserService, private auth: AuthService, router: Router) {
    this.subscription = auth.user$.subscribe(user => {
      if (user) {
        userService.save(user);

        let returnUrl = localStorage.getItem('returnUrl');
        router.navigateByUrl(returnUrl || '/');
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
