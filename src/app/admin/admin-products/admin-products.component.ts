import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProductWithKey } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnDestroy {
  subscription: Subscription;
  displayedColumns = ['title', 'price', 'Edit'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  categories$: any;
  categoryFilter: string = '';
  titleFilter: string = '';
  filterValues = {
    title: '',
    category: ''
  };

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private productService: ProductService, private categoryService: CategoryService) { 
    this.categories$ = this.categoryService.getAll();

    this.subscription = this.productService.getAll().snapshotChanges()
      .subscribe(products => {
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

  applyFilter() {
    this.filterValues['title'] = this.titleFilter.trim().toLowerCase();
    this.filterValues['category'] = this.categoryFilter.trim().toLowerCase();

    this.dataSource.filter = JSON.stringify(this.filterValues);

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private createFilter(): (product: ProductWithKey, filterValues: string) => boolean {
    let filterFunction = function (product: ProductWithKey, filterValues: string): boolean {
      let searchString = JSON.parse(filterValues);
      return (product.title.toLowerCase().indexOf(searchString['title']) !== -1 || 
        product.price.toFixed(2).toString().indexOf(searchString['title']) !== -1) &&
        product.category.toLowerCase().indexOf(searchString['category']) !== -1;
    }

    return filterFunction;
  }

}
