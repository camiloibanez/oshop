import { Component, Input } from '@angular/core';
import { CategoryService } from 'app/shared/services/category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {
  categories$: any;
  @Input('category') category: string | null = '';

  constructor(categoryService: CategoryService) { 
    this.categories$ = categoryService.getAll();
  }

}
