import { ChurchDataComponent } from './../church-data/church-data.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { Districts } from '../../../models/districts';
import { State } from '../../../../../shared/models/state.model';
import { City } from '../../../../../shared/models/city.model';
import { TreasuryService } from '../../../treasury.service';
import { Church } from '../../../models/church';
import { auth } from '../../../../../auth/auth';

@Component({
  selector: 'app-church-form',
  templateUrl: './church-form.component.html',
  styleUrls: ['./church-form.component.scss']
})
export class ChurchFormComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  subscribeUnit: Subscription;

  form: FormGroup;
  districts: Districts[];
  states: State[];
  cities: City[];
  church: Church;

  constructor(
    private formBuilder: FormBuilder,
    private service: TreasuryService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private churchDataComponent: ChurchDataComponent
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadDistricts();
    this.loadStates();
    this.route.params.subscribe(params => {
      const idParsed = parseInt(params.id, 10);
      if (!idParsed) {
        return;
      }
      this.edit(idParsed);
    });
    this.subscribeUnit = auth.currentUnit.subscribe(() => {
      this.reset();
    });
    this.churchDataComponent.sidenavRight.open();
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
    this.closeSidenav();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      district: [null, Validators.required],
      state: [null, Validators.required],
      city: [{value: null, disabled: true}, Validators.required],
      address: [null, Validators.required],
      complement: [null],
      cep: [null, Validators.required]
    });
  }

  public loadCities() {
    this.cities = [];
    const id = this.form.value.state;
    this.service.getCities(id).subscribe((data: City[]) => {
      this.form.get('city').enable();
      this.cities = Object.assign(this.cities, data as City[]);
    });
  }

  public save(): void {
    if (this.form.valid) {
      const unit = auth.getCurrentUnit();
      const data = {
        id: !!this.church ? this.church.id : 0,
        unit: unit.id,
        ...this.form.value
      };
      this.service.saveChurch(data).subscribe((church: Church) => {
        this.reset();
        this.churchDataComponent.getData();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar igreja, tente novamente.', 'OK', { duration: 5000 });
      });
    }
  }

  public reset() {
    this.form.markAsUntouched();
    this.form.reset();
    this.closeSidenav();
  }

  public closeSidenav(): void {
    this.churchDataComponent.closeSidenav();
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar' : 'Nova';
  }

  private checkIsEdit(): boolean {
    return this.church !== undefined && this.church !== null;
  }

  public edit(id: number) {
    this.service.getChurch(id).subscribe(church => {
      this.church = church;
      this.setValues();
    });
  }

  private loadDistricts() {
    const unit = auth.getCurrentUnit();
    this.districts = [];
    this.service.getDistricts(unit.id).subscribe((data: Districts[]) => {
      this.districts = Object.assign(this.districts, data as Districts[]);
    });
  }

  private loadStates() {
    this.states = [];
    this.service.getStates().subscribe((data: State[]) => {
      this.states = Object.assign(this.states, data as State[]);
    });
  }

  private setValues(): void {
    this.form = new FormGroup({
      name: new FormControl({value: this.church.name, disabled: false}, Validators.required),
      code: new FormControl({value: this.church.code, disabled: false}, Validators.required),
      district: new FormControl({value: this.church.district.id, disabled: false}, [Validators.required, Validators.min(1)]),
      state: new FormControl({value: this.church.city.state.id, disabled: false}, Validators.required),
      city: new FormControl({value: this.church.city.id, disabled: false}, Validators.required),
      address: new FormControl({value: this.church.address, disabled: false}, Validators.required),
      complement: new FormControl({value: this.church.complement, disabled: false}),
      cep: new FormControl({value: this.church.cep, disabled: false}, Validators.required),
    });
    this.loadCities();
  }
}
