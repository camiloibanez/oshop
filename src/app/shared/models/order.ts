import { Shipping } from "./shipping";
import { ShoppingCart } from "./shopping-cart";

export interface OrderWithKey {
  datePlaced: number;
  items: any[];
  key: string;
  userId: string;
  shipping: Shipping;
  totalPrice: number;
}

export class Order {
  datePlaced: number;
  items: any[] = [];
  totalPrice: number;
  totalItems: number;

  constructor(public userId: string, public shipping: Shipping, shoppingCart: ShoppingCart) {
      this.datePlaced = new Date().getTime();

      this.items = shoppingCart.items.map(i => {
          return {
            product: {
              title: i.title,
              imageUrl: i.imageUrl,
              price: i.price
            },
            quantity: i.quantity,
            totalPrice: i.totalPrice
          }
      });

      this.totalPrice = shoppingCart.totalPrice;
      this.totalItems = shoppingCart.totalItemsCount;

  }
}