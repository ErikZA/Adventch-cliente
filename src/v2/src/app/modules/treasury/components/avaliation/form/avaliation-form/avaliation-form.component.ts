import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AvaliationEditInterface } from './../../../../interfaces/avaliation/avaliation-edit-interface';
import { AvaliationDataComponent } from './../../avaliation-data/avaliation-data.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { skipWhile, tap, delay, switchMap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ChurchService } from '../../../church/church.service';
import { ChurchAvaliationFormInterface } from '../../../../interfaces/avaliation/church-avaliation-form-interface';
import { EFeatures } from '../../../../../../shared/models/EFeatures.enum';
import { AvaliationService } from '../../avaliation.service';
import { AvaliationRequirementFormComponent } from '../avaliation-requirement-form/avaliation-requirement-form.component';
import { auth } from '../../../../../../auth/auth';
import { NewAvaliationInterface } from '../../../../interfaces/avaliation/new-avaliation-interface';
import { MatSnackBar } from '@angular/material';
import { UpdateAvaliationInterface } from '../../../../interfaces/avaliation/update-avaliation-interface';

@Component({
  selector: 'app-avaliation-form',
  templateUrl: './avaliation-form.component.html',
  styleUrls: ['./avaliation-form.component.scss']
})
@AutoUnsubscribe()
export class AvaliationFormComponent implements OnInit, OnDestroy {

  @ViewChild(AvaliationRequirementFormComponent)
  avaliationRequirementFormComponent: AvaliationRequirementFormComponent;

  sub1: Subscription;
  isSending = false;

  formAvaliation: FormGroup;
  avaliation: AvaliationEditInterface;
  loading = true;
  type: number;
  church: ChurchAvaliationFormInterface;
  year: number;
  month: number;

  constructor(
    private route: ActivatedRoute,
    private avaliationService: AvaliationService,
    private churchService: ChurchService,
    private formBuilder: FormBuilder,
    private avaliationDataComponent: AvaliationDataComponent,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForm();
    this.sub1 = this.route.data
      .pipe(
        skipWhile(({ feature }) => !feature),
        tap(({ feature }) => this.type = feature),
        switchMap(() => this.getDatasOfAvaliation()),
        switchMap(() => this.loadChurchForm()),
        switchMap(() => this.loadDataEdit()),
        delay(500)
      ).subscribe(() => this.loading = false);
    this.avaliationDataComponent.openSidenav();
  }

  ngOnDestroy(): void {
    this.avaliationDataComponent.closeSidenav();
  }

  private getDatasOfAvaliation() {
    return this.route.params
      .pipe(
        tap(({ year }) => this.loading = !!year),
        skipWhile(({ year }) => !year),
        tap(({ year }) => this.year = year),
        tap(({ month }) => this.month = month)
      );
  }

  private initForm(): void {
    this.formAvaliation = this.formBuilder.group({
      date: [new Date(), Validators.required]
    });
  }

  private loadChurchForm() {
    return this.route.params
      .pipe(
        skipWhile(({ id }) => !id),
        switchMap(({ id }) => this.getChurchForm(id))
      );
  }

  private getChurchForm(id: number) {
    return this.churchService
      .getChurchAvaliationForm(id)
      .pipe(
        skipWhile(church => !church),
        tap(church => this.church = church)
      );
  }

  private loadDataEdit() {
    return this.route.params
      .pipe(
        tap(({ idAvaliation }) => this.loading = !!idAvaliation),
        skipWhile(({ idAvaliation }) => !idAvaliation),
        switchMap(({ idAvaliation }) => this.getEditAvaliation(idAvaliation))
      );
  }

  private getEditAvaliation(idAvaliation: number) {
    return this.avaliationService
      .getAvaliationEditById(idAvaliation)
      .pipe(
        tap((data: AvaliationEditInterface) => {
          this.avaliation = data;
          this.setValueAvaliationEdit();
        })
      );
  }
  private setValueAvaliationEdit(): void {
    this.formAvaliation.setValue({
      date: this.avaliation.dateArrival
    });
  }

  public getTitleLabel() {
    switch (this.type) {
      case EFeatures.AvaliarAnualmente:
        return `${this.church.name} - ANUAL (${this.year})`;
      case EFeatures.AvaliarMensalmente:
        return `${this.church.name} - MENSAL (${this.month}/${this.year})`;
      default:
        break;
    }
  }

  public checkIsEdit(): boolean {
    return this.avaliation !== undefined && this.avaliation !== null;
  }

  public saveAvaliation(): void {
    this.isSending = true;
    if (this.formAvaliation.valid) {
      this.sendData()
        .pipe(
          tap(() => this.avaliationDataComponent.getChurchesAvaliations()),
          tap(() => this.avaliationDataComponent.closeSidenav()),
          tap(() => this.snackBar.open('Avaliação salva com sucesso!', 'OK', { duration: 3000 }),
            () => this.snackBar.open('Ocorreu um erro ao salvar a avaliação', 'OK', { duration: 3000 })),
          tap(() => this.isSending = false)
        ).subscribe();
    }
  }

  private sendData(): Observable<boolean> {
    return this.checkIsEdit() ?
      this.sendDataUpdate() :
      this.sendDataNew();
  }

  private sendDataUpdate(): Observable<boolean> {
    return this.type === EFeatures.AvaliarAnualmente ? this.sendDataUpdateYearly() : this.sendDataUpdateMonthly();
  }

  private sendDataUpdateMonthly(): Observable<boolean> {
    const avaliation = this.mapToUpdateAvaliation();
    return this.avaliationService
      .putUpdateAvaliationMonthly(this.avaliation.id, avaliation);
  }

  private sendDataUpdateYearly(): Observable<boolean> {
    const avaliation = this.mapToUpdateAvaliation();
    return this.avaliationService
      .putUpdateAvaliationYearly(this.avaliation.id, avaliation);
  }

  private mapToUpdateAvaliation(): UpdateAvaliationInterface {
    const { id } = auth.getCurrentUser();
    return {
      dateArrival: this.formAvaliation.get('date').value,
      idUser: id,
      avaliationRequirements: this.avaliationRequirementFormComponent
        .getAvaliationsRequirement()
    };
  }

  private sendDataNew(): Observable<boolean> {
    return this.type === EFeatures.AvaliarAnualmente ? this.sendDataNewYearly() : this.sendDataNewMonthly();
  }

  private sendDataNewYearly(): Observable<boolean> {
    const avaliation = this.mapToNewAvaliationYearly();
    return this.avaliationService
      .postNewAvaliationYearly(avaliation);
  }

  private sendDataNewMonthly(): Observable<boolean> {
    const avaliation = this.mapToNewAvaliationMonthly();
    return this.avaliationService
      .postNewAvaliationMonthly(avaliation);
  }

  private mapToNewAvaliationYearly(): NewAvaliationInterface {
    const { id } = auth.getCurrentUser();
    return {
      date: this.setDateYearly(),
      dateArrival: this.formAvaliation.get('date').value,
      idChurch: this.church.id,
      idUser: id,
      avaliationRequirements: this.avaliationRequirementFormComponent
        .getAvaliationsRequirement()
    };
  }

  private setDateYearly(): Date {
    const date = new Date();
    date.setFullYear(this.year);
    return date;
  }

  private mapToNewAvaliationMonthly(): NewAvaliationInterface {
    const { id } = auth.getCurrentUser();
    return {
      date: this.setDateMonthy(),
      dateArrival: this.formAvaliation.get('date').value,
      idChurch: this.church.id,
      idUser: id,
      avaliationRequirements: this.avaliationRequirementFormComponent
        .getAvaliationsRequirement()
    };
  }

  private setDateMonthy(): Date {
    const date = new Date();
    date.setMonth(this.month - 1);
    date.setFullYear(this.year);
    return date;
  }
}
