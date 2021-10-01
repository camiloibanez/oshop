import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppUser } from '../models/app-user';
import { ShoppingCart } from '../models/shopping-cart';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  appUser?: AppUser;
  subscription: Subscription = new Subscription;
  cart$: Observable<ShoppingCart | null> | undefined;

  constructor(
    private router: Router,
    private auth: AuthService, 
    private shoppingCartService: ShoppingCartService) { 
    
  }

  async ngOnInit() {
    this.subscription = this.auth.appUser$.subscribe(appUser => this.appUser = appUser ? appUser : undefined);
    this.cart$ = (await this.shoppingCartService.getCart());

  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
