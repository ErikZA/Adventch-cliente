import { DistrictsDataComponent } from './../districts-data/districts-data.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { auth } from '../../../../../auth/auth';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription, Observable } from 'rxjs';
import { switchMap, tap, skipWhile, delay } from 'rxjs/operators';
import { DistrictService } from '../district.service';
import { DistrictNewInterface } from '../../../interfaces/district/district-new-interface';
import { DistrictUpdateInterface } from '../../../interfaces/district/district-update-interface';
import { UserDistrictListInterface } from '../../../interfaces/district/user-district-list-interface';
import { DistrictEditInterface } from '../../../interfaces/district/district-edit-interface';

@Component({
  selector: 'app-districts-form',
  templateUrl: './districts-form.component.html',
  styleUrls: ['./districts-form.component.scss']
})
@AutoUnsubscribe()
export class DistrictsFormComponent implements OnInit, OnDestroy {

  formDistrict: FormGroup;
  params: any;
  users: UserDistrictListInterface[] = [];
  district: DistrictEditInterface;
  sub1: Subscription;

  loading = true;
  isSending = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private districtsDataComponent: DistrictsDataComponent,
    private districtService: DistrictService
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
    const { id } = auth.getCurrentUnit();
    return this.districtService.getUsersDistrictsList(id).pipe(
      tap((data) => this.users = data)
    );
  }

  private checkIsEdit(): boolean {
    return this.district !== undefined && this.district !== null;
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Distrito' : 'Novo Distrito';
  }

  private initForm(): void {
    this.formDistrict = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^ ]+( [^ ]+)*$/)]],
      analystId: [null, Validators.required]
    });
  }

  public saveDistrict(): void {
    if (this.formDistrict.valid) {
      this.isSending = true;
      this.sendData()
        .pipe(
          switchMap(() => this.districtsDataComponent.getData()),
          tap(() => this.districtsDataComponent.closeSidenav(),
          () => this.snackBar.open('Ocorreu um erro ao salvar o distrito', 'OK', { duration: 3000 })),
          tap(() => this.snackBar.open('Distrito salvo com sucesso!', 'OK', { duration: 3000 })),
          tap(() => this.isSending = false)
        ).subscribe();
    }
  }

  private sendData() {
    return this.checkIsEdit() ?
        this.sendDataEdit() :
        this.sendDataNew();
  }

  private sendDataNew(): Observable<boolean> {
    return this.districtService.postDistrict(this.getDataNew());
  }

  private getDataNew(): DistrictNewInterface {
    const _district = this.formDistrict.value;
    const { id } = auth.getCurrentUnit();
    _district.unitId = id;
    return _district as DistrictNewInterface;
  }

  private sendDataEdit(): Observable<boolean> {
    const { id } = this.district;
    return this.districtService.putDistrict(id, this.getDataEdit());
  }

  private getDataEdit(): DistrictUpdateInterface {
    return this.formDistrict.value as DistrictUpdateInterface;
  }

  private editDistrict(id: number) {
    return this.districtService.getDistrictEdit(id)
    .pipe(
      tap(res => {
        this.district = res;
        this.setValuesEdit(res);
      })
    );
  }

  private setValuesEdit(res: DistrictEditInterface) {
    this.formDistrict.patchValue({
      name: res.name,
      analystId: res.analystId
    });
  }
}
