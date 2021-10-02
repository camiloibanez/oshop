import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OrderWithKey } from 'shared/models/order';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnDestroy{
  subscription: Subscription;
  displayedColumns = ['totalPrice', 'datePlaced', 'View'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    private authService: AuthService,
    private orderService: OrderService) { 

      this.subscription = this.authService.user$.pipe(switchMap(u => 
        this.orderService.getOrdersByUser(u?.uid || '').snapshotChanges()
      )).subscribe(orders => {
        let ordersList: OrderWithKey[] = [];
        
        orders.forEach(order => {
          let json: any = order.payload.toJSON();
          json['key'] = order.payload.key;
          ordersList.push(json as OrderWithKey);
        });

        this.dataSource = new MatTableDataSource(ordersList);  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
      });
    }

      
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private createFilter(): (order: OrderWithKey, filterValue: string) => boolean {
    let filterFunction = function (order: OrderWithKey, filterValue: string): boolean {
      return order.totalPrice.toFixed(2).toString().indexOf(filterValue) !== -1 || formatDate(order.datePlaced,'medium', 'en').toString().toLowerCase().indexOf(filterValue) !== -1;
    }

    return filterFunction;
  }
}
