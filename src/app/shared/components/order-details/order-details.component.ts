import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OrderService } from 'shared/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {
  id: string;
  order: any;
  refundable: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private orderService: OrderService) { 

    this.id = this.route.snapshot.paramMap.get('id') || '';
    let now = new Date().getTime();
    if (this.id) this.orderService.getOrder(this.id).valueChanges().pipe(take(1))
      .subscribe(order => {
        this.order = order;
        this.refundable = now < (this.order.datePlaced + 172800000); // Less than 2 days since purchase
      });
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.id);
    alert('Order Canceled');
    this.route.url.subscribe(url => {
      if (url[0].path === 'order-success') {
        this.router.navigate(['/']);
      } else {
        url.pop();
        let returnUrl = url.map(s => s.path);
        console.log(returnUrl);
        this.router.navigate([...returnUrl]);  
      }
    });
  }
}
