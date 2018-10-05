import { Subscription } from 'rxjs';
import { ChurchDataComponent } from './../church-data/church-data.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Districts } from '../../../models/districts';
import { State } from '../../../../../shared/models/state.model';
import { City } from '../../../../../shared/models/city.model';
import { TreasuryService } from '../../../treasury.service';
import { Church } from '../../../models/church';
import { auth } from '../../../../../auth/auth';



import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';
import { switchMap, tap, delay, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-church-form',
  templateUrl: './church-form.component.html',
  styleUrls: ['./church-form.component.scss']
})
@AutoUnsubscribe()
export class ChurchFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  districts: Districts[] = [];
  states: State[] = [];
  cities: City[] = [];
  church: Church;

  // Subs
  sub1: Subscription;
  sub2: Subscription;

  loading = true;
  isSending = false;
  constructor(
    private formBuilder: FormBuilder,
    private service: TreasuryService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private churchDataComponent: ChurchDataComponent
  ) {}

  ngOnInit() {
    this.initForm();
    this.sub1 = this.loadDistricts()
      .pipe(
        switchMap(() => this.loadStates()),
        switchMap(() => this.route.params),
        tap(({ id }) => this.loading = !!id),
        skipWhile(({ id }) => !id),
        switchMap(({ id }) => this.edit(id))
      ).subscribe(() => this.loading = false);
    this.sub2 = this.form
      .get('state')
      .valueChanges
      .pipe(
        switchMap(value => this.loadCities(value))
      ).subscribe();
    this.churchDataComponent.openSidenav();
  }

  ngOnDestroy() {
    this.churchDataComponent.closeSidenav();
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

  public loadCities(stateid) {
    return this.service
      .getCities(stateid)
      .pipe(
        tap((data: City[]) => {
          this.form.get('city').enable();
          this.cities = data;
        })
      );
  }

  public save(): void {
    if (this.form.valid) {
      this.isSending = true;
      const unit = auth.getCurrentUnit();
      const data = {
        id: !!this.church ? this.church.id : 0,
        unit: unit.id,
        ...this.form.value
      };
      this.service
        .saveChurch(data)
        .pipe(
          switchMap(() => this.churchDataComponent.getData())
        ).subscribe(() => {
          this.isSending = false;
          this.churchDataComponent.closeSidenav();
          this.snackBar.open('Salvo com sucesso!', 'OK', { duration: 5000 });
        }, err => {
          console.log(err);
          this.snackBar.open('Erro ao salvar igreja, tente novamente.', 'OK', { duration: 5000 });
        });
    }
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Igreja' : 'Nova Igreja';
  }

  private checkIsEdit(): boolean {
    return this.church !== undefined && this.church !== null;
  }

  public edit(id: number) {
    return this.service
      .getChurch(id)
      .pipe(
        delay(500),
        tap(church => {
          this.church = church;
          this.setValues(church);
        }),
        delay(100)
      );
  }

  private loadDistricts() {
    return this.service
      .getDistricts(auth.getCurrentUnit().id)
      .pipe(
        tap((data: Districts[]) => { this.districts = data; })
      );
  }

  private loadStates() {
    return this.service
      .getStates().pipe(
        tap((data: State[]) => { this.states = data; })
      );
  }

  private setValues(church: Church): void {
    this.form.patchValue({
      name: church.name,
      code: church.code,
      district: church.district.id,
      state: church.city.state.id,
      city: church.city.id,
      address: church.address,
      complement: church.complement,
      cep: church.cep
    });
  }
}
