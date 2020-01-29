import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { AddAdress } from '../../../../actions/newEvent.action';

@Component({
  selector: 'app-adress-form',
  templateUrl: './adress-form.component.html',
  styleUrls: ['./adress-form.component.scss']
})
export class AdressFormComponent implements OnInit {

  @Input('formAdrees') formAdrees: FormGroup;

  constructor(
    public http: HttpClient,
    private store: Store<any>
  ) { }

  ngOnInit() {
  }

  getCep() {
    const cep = this.formAdrees.controls["cep"].value

    this.http.get(`https://viacep.com.br/ws/${cep}/json`).subscribe((res: any) => {
      const { localidade, bairro, logradouro, uf } = res;

      this.formAdrees.controls["city"].setValue(localidade)
      this.formAdrees.controls["neighborhood"].setValue(bairro)
      this.formAdrees.controls["street"].setValue(logradouro)
      this.formAdrees.controls["uf"].setValue(uf)
    })

  }

  sendAdress() {
    this.store.dispatch(AddAdress(
      this.formAdrees.controls["cep"].value,
      this.formAdrees.controls["street"].value,
      this.formAdrees.controls["neighborhood"].value,
      this.formAdrees.controls["city"].value,
      this.formAdrees.controls["uf"].value,
      this.formAdrees.controls["complement"].value,
      this.formAdrees.controls["number"].value,
    ));
  }

}
