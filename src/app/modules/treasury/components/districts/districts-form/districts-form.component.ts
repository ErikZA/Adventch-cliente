import { DistrictsDataComponent } from './../districts-data/districts-data.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Districts } from '../../../models/districts';
import { AuthService } from '../../../../../shared/auth.service';
import { TreasuryService } from '../../../treasury.service';
import { auth } from '../../../../../auth/auth';
import { User } from '../../../../../shared/models/user.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { switchMap, tap, skipWhile, delay } from 'rxjs/operators';

@Component({
  selector: 'app-districts-form',
  templateUrl: './districts-form.component.html',
  styleUrls: ['./districts-form.component.scss']
})
@AutoUnsubscribe()
export class DistrictsFormComponent implements OnInit, OnDestroy {

  formDistrict: FormGroup;
  params: any;
  users: User[] = [];
  district: Districts;
  sub1: Subscription;

  loading = true;
  isSending = false;

  constructor(
    private formBuilder: FormBuilder,
    private treasuryService: TreasuryService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    private service: TreasuryService,
    private districtsDataComponent: DistrictsDataComponent
  ) { }

  ngOnInit() {
    this.initForm();
    this.sub1 = this.loadAnalysts()
      .pipe(
        switchMap(() => this.route.params),
        tap(({ id }) => this.loading = !!id),
        skipWhile(({ id }) => !id),
        switchMap(({ id }) => this.editDistrict(id)),
        delay(300)
      ).subscribe(() => { this.loading = false; });
    this.districtsDataComponent.openSidenav();
  }

  ngOnDestroy() {
    this.districtsDataComponent.closeSidenav();
  }

  private loadAnalysts() {
    const unit = this.authService.getCurrentUnit();
    return this.service.getUsers2(unit.id).pipe(
      tap((data) => {
      this.users = data;
      })
    );
  }

  private checkIsEdit(): boolean {
    return this.district !== undefined && this.district !== null;
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Distrito' : 'Novo Distrito';
  }

  initForm(): void {
    this.formDistrict = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^ ]+( [^ ]+)*$/)]],
      analyst: [null, Validators.required]
    });
  }

  saveDistrict() {
    if (!this.formDistrict.valid) {
      return;
    }
    this.isSending = true;
    const unit = auth.getCurrentUnit();
    // modificar para id, caso de conflito
    const valor = this.users.filter(x => x.id === this.formDistrict.value.analyst);
    const data = {
      id: this.checkIsEdit() ? this.district.id : 0,
      name: this.formDistrict.value.name,
      analyst: {
        id: this.formDistrict.value.analyst,
        name: valor[0].name,
      },
      id_unit: unit.id
    };
    this.treasuryService.saveDistricts(data)
      .pipe(
        tap(() => {
          this.isSending = false;
          this.formDistrict.markAsUntouched();
          this.districtsDataComponent.closeSidenav();
        }),
        switchMap(() => this.districtsDataComponent.getData()),
        tap(() => this.snackBar.open('Distrito salvo com sucesso!', 'OK', { duration: 5000 }))
      ).subscribe(null, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar distrito, tente novamente.', 'OK', { duration: 5000 });
      });
  }
  editDistrict(id: number) {
    return this.treasuryService.getDistrict(id)
    .pipe(
      tap(res => {
        this.district = res;
        this.formDistrict.patchValue({
          name: res.name,
          analyst: res.analyst.id
        });
      })
    );
  }
  resetAllForms() {
    this.formDistrict.reset();
  }
}
