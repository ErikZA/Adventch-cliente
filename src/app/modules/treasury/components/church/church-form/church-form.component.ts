import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material';

import { Districts } from '../../../models/districts';
import { State } from '../../../../../shared/models/state.model';
import { City } from '../../../../../shared/models/city.model';
import { AuthService } from '../../../../../shared/auth.service';
import { TreasuryService } from '../../../treasury.service';
import { ChurchStore } from '../church.store';
import { SidenavService } from '../../../../../core/services/sidenav.service';

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
    private sidenavService: SidenavService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadDistricts();
    this.loadStates();
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

  /*setValues(): void {
    this.form = new FormGroup({
      city: new FormControl({value: '', disabled: true}, Validators.required),
    });
  }*/

  public loadCities(state) {
    this.cities = [];
    this.service.getCities(this.form.get('state').value).subscribe((data: City[]) => {
      this.cities = Object.assign(this.cities, data as City[]);
    });
  }

  public save(): void {
    const unit = this.authService.getCurrentUnit();
    if (this.form.valid) {
      const data = {
        id: 0,
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

}
