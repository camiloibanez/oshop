import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ProductWithKey } from '../models/product';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges()
      .pipe(map((x: any) => new ShoppingCart(x.items)));
  }

  async addToCart(product: ProductWithKey) { 
    this.updateItem(product, 1);
  }

  async removeFromCart(product: ProductWithKey) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId') ;
    if (cartId) return cartId;
  
    let result = await this.create();
    localStorage.setItem('cartId', result.key || '');
    return result.key || '';
  }

  private async updateItem(product: ProductWithKey, change: number) {
    let cartId = await this.getOrCreateCartId();
    let cartItem = this.getItem(cartId, product.key);
    let item$ = cartItem.snapshotChanges();
    item$.pipe(take(1)).subscribe(item => {
      let quantity = (item.payload.child('quantity').val() || 0) + change;
      if (quantity === 0) cartItem.remove();
      else cartItem.update({
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    });
  }
}
