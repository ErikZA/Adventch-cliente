import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Districts } from '../../../models/districts';
import { State } from '../../../../../shared/models/state.model';
import { City } from '../../../../../shared/models/city.model';
import { AuthService } from '../../../../../shared/auth.service';
import { TreasuryService } from '../../../treasury.service';
import { ChurchStore } from '../church.store';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { Church } from '../../../models/church';

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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private service: TreasuryService,
    private store: ChurchStore,
    private sidenavService: SidenavService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadDistricts();
    this.loadStates();
    this.route.params.subscribe(params => {
      this.edit(params['id']);
    });
    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.reset();
    });
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      district: [null, Validators.required],
      state: [null, Validators.required],
      city: [{value: null, disabled: true}, Validators.required],
      address: [null, Validators.required],
      cep: [null, Validators.required]
    });
  }

  public loadCities(isEdit) {
    this.cities = [];
    const id = this.form.value.state;
    this.service.getCities(id == null || undefined ? this.store.church.city.state.id : id).subscribe((data: City[]) => {
      this.form.get('city').enable();
      this.cities = Object.assign(this.cities, data as City[]);
      if (isEdit) {
        this.setValues();
      }
    });
  }

  public save(): void {
    if (this.form.valid) {
      const unit = this.authService.getCurrentUnit();
      const data = {
        id: this.store.church.id,
        unit: unit.id,
        ...this.form.value
      }
      this.service.saveChurch(data).subscribe((church: Church) => {
        this.store.update(church);
        this.reset();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar igreja, tente novamente.', 'OK', { duration: 5000 });
      });
    }
  }

  public reset() {
    this.form.markAsUntouched();
    this.form.reset();
    this.sidenavService.close();
    this.router.navigate([this.router.url.replace('/novo', '').replace('/editar', '')]);
  }

  public edit(id){
    if (id == this.store.church.id) {
      this.loadCities(true);
    }
  }

  private loadDistricts() {
    const unit = this.authService.getCurrentUnit();
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
    const church = this.store.church;
    this.form = new FormGroup({
      name: new FormControl({value: church.name, disabled: false}, Validators.required),
      code: new FormControl({value: church.code, disabled: false}, Validators.required),
      district: new FormControl({value: church.district.id, disabled: false}, Validators.required),
      state: new FormControl({value: church.city.state.id, disabled: false}, Validators.required),
      city: new FormControl({value: church.city.id, disabled: false}, Validators.required),
      address: new FormControl({value: church.address, disabled: false}, Validators.required),
      cep: new FormControl({value: church.cep, disabled: false}, Validators.required),
    });
  }
}
