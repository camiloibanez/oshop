import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  id: string;
  order: any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private orderService: OrderService) { 

    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) this.orderService.getOrder(this.id).valueChanges().pipe(take(1)).subscribe(order => this.order = order);
  }

  ngOnInit() {
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.id);
    alert('Order Canceled');
    this.route.url.subscribe(url => {
      url.pop();
      let returnUrl = url.map(s => s.path);
      this.router.navigate([...returnUrl]);
    });
    
  }


}
