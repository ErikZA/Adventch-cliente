import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RemoveProcuts, AddProducts, ReadProducts } from 'src/app/actions/products.action';
import { Products, ProductsReducer } from 'src/app/models/event.model';
import { RegisterEvent } from 'src/app/actions/newEvent.action';
import { SnackBarService } from 'src/app/shared/snack-bar/snack-bar.service';

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
    public snackbar: SnackBarService
  ) {
    this.product$ = store.select('product')
    this.store.dispatch(ReadProducts());
  }

  ngOnInit() {
    this.product$.subscribe((res: any) => this.products = res);
  }

  add() {
    AddProducts(
      this.formProduct.controls["name"].value,
      this.formProduct.controls["value"].value,
    )
    this.formProduct.reset();
  }

  remove(index: number) {
    RemoveProcuts(index)
  }

  finish() {
    this.store.dispatch(RegisterEvent());
    this.router.navigate(['/eventos'])
    this.snackbar.open("check_circle", "Eventos criado com success", 2000, "success")
  }

}
