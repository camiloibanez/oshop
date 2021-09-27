import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProductWithKey } from 'src/app/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnDestroy {
  // products: any[] = [];
  // filteredProducts: any[] = [];
  subscription: Subscription;
  displayedColumns = ['title', 'price', 'Edit'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private productService: ProductService) { 
    this.subscription = this.productService.getAll().snapshotChanges()
      .subscribe(products => {
        // this.filteredProducts = this.products = products;
        let productsList: ProductWithKey[] = [];

        products.forEach(product => {
          let json: any = product.payload.toJSON();
          json['key'] = product.payload.key;
          productsList.push(json as ProductWithKey);
        });
        
        this.dataSource = new MatTableDataSource(productsList);  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // filter(query: string) {
  //   this.filteredProducts = (query) ?
  //     this.products.filter(p => p.payload.child('title').val().toLowerCase().includes(query.toLowerCase())) :
  //     this.products;
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private createFilter(): (product: ProductWithKey, filterValue: string) => boolean {
    let filterFunction = function (product: ProductWithKey, filterValue: string): boolean {
      return product.title.toLowerCase().indexOf(filterValue) !== -1 || product.price.toFixed(2).toString().indexOf(filterValue) !== -1;
    }

    return filterFunction;
  }

}
