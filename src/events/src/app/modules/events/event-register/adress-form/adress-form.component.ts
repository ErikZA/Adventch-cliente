import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adress-form',
  templateUrl: './adress-form.component.html',
  styleUrls: ['./adress-form.component.scss']
})
export class AdressFormComponent implements OnInit {

  @Input('formAdrees') formAdrees: FormGroup;

  constructor(
    public http: HttpClient,
  ) { }

  ngOnInit() {
  }

  getCep() {
    const { cep } = this.formAdrees.value;

    fetch(`https://viacep.com.br/ws/${cep}/json`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => {
        const { localidade, bairro, logradouro, uf } = res;
        this.formAdrees.controls["city"].setValue(localidade)
        this.formAdrees.controls["neighborhood"].setValue(bairro)
        this.formAdrees.controls["street"].setValue(logradouro)
        this.formAdrees.controls["state"].setValue(uf)
      })
  }

}
