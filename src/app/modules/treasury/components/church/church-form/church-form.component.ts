import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/operators';

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
export class ChurchFormComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadDistricts();
    this.loadStates();
    this.route.params.subscribe(params => {
      this.edit(params['id']);
    });
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      district: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      address: [null, Validators.required],
      cep: [null, Validators.required]
    });
  }

  public loadCities() {
    this.cities = [];
    const id = this.form.value.state;
    this.service.getCities(id == null || undefined ? this.form.get('state').value : id).subscribe((data: City[]) => {
      this.cities = Object.assign(this.cities, data as City[]);
    });
  }

  public save(): void {
    const unit = this.authService.getCurrentUnit();
    if (this.form.valid) {
      const data = {
        id: this.store.church.id,
        unit: unit.id,
        ...this.form.value
      }
      this.store.save(data);
      setTimeout(() => {
        this.reset();
      }, 5000);
    }
  }

  public checkState() {
    return this.form.get('state').value === null;
  }

  public edit(id){
    if (id == this.store.church.id) {
      this.loadCities();
      this.setValues();
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

  private reset() {
    this.form.reset();
    this.sidenavService.close();
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
