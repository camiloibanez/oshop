import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { switchMap} from 'rxjs/operators';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import { ProductWithKey } from '../models/product';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductWithKey[] = [];
  filteredProducts: ProductWithKey[] = [];
  category: string | null = '';
  cart$: Observable<ShoppingCart> | undefined;
  pageEvent: PageEvent = new PageEvent;
  
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService) { 
      console.log(route);
  };

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();
  }

  private populateProducts() {
    this.productService
      .getAll().snapshotChanges()
      .pipe(switchMap(products => {
        products.forEach((product) => {
          this.products.push({
            key: product.key || '',
            title: product.payload.child('title').val(),
            price: product.payload.child('price').val(),
            category: product.payload.child('category').val(),
            imageUrl: product.payload.child('imageUrl').val(),
          });
        });
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        
        (<HTMLInputElement>document.getElementById('catalog-filter')).value = '';
        this.categoryFilter();
      });
  }

  private categoryFilter() {
    this.filteredProducts = (this.category) ?
      this.products.filter(p => p.category === this.category) :
      this.products;
      this.paginator?.firstPage();
      return this.filteredProducts;
    }

  titleFilter(query: string) {
    this.filteredProducts = (this.category) ?
      this.textFilter(query, this.categoryFilter()) :
      this.textFilter(query, this.products);
  }

  private textFilter(query: string, productsList: ProductWithKey[]) {
    return (query) ?
      productsList.filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase())) :
      productsList;
  }
}
