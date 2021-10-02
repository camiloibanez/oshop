import { Component, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from 'app/shared/services/order.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { OrderWithKey } from 'app/shared/models/order';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnDestroy{
  subscription: Subscription;
  displayedColumns = ['name', 'datePlaced', 'View'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;


  constructor(private orderService: OrderService) { 
    this.subscription = this.orderService.getOrders().snapshotChanges()
      .subscribe((orders: any) => {
        let ordersList: OrderWithKey[] = [];

        orders.forEach((order: any) => {
          let json: any = order.payload.toJSON();
          json['key'] = order.payload.key;
          ordersList.push(json as OrderWithKey);
        });

        this.dataSource = new MatTableDataSource(ordersList);  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
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
      return order.shipping.name.toLowerCase().indexOf(filterValue) !== -1 || formatDate(order.datePlaced,'medium', 'en').toString().toLowerCase().indexOf(filterValue) !== -1;
    }

    return filterFunction;
  }

  private sortingDataAccessor = (item: any, property: string) => {
    switch (property) {
      case 'name': return item.shipping.name;
      default: return item[property];
    }
  };
}
