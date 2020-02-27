import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RemoveProcuts, AddProducts, ReadProducts } from 'src/app/actions/products.action';
import { Products, ProductsReducer } from 'src/app/models/event.model';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {

  @Input('formProduct') formProduct: FormGroup;

  public products: Products[] = [];
  public product$: Observable<ProductsReducer>;

  constructor(
    public store: Store<any>,
    public router: Router,
  ) {
    this.product$ = store.select('product')
    this.store.dispatch(ReadProducts());
  }

  ngOnInit() {
    this.product$.subscribe((res: any) => this.products = res);
  }

  add() {
    AddProducts(
      this.formProduct,
      this.formProduct.controls["name"].value,
      this.formProduct.controls["value"].value,
    )
  }

  remove(index: number) {
    RemoveProcuts(index)
  }

}
