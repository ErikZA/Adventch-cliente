import { Subscription } from 'rxjs/Subscription';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { TreasuryService } from '../../../treasury.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observation } from '../../../models/observation';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { EObservationStatus } from '../../../models/Enums';
import { auth } from '../../../../../auth/auth';
import { ObservationDataComponent } from '../observation-data/observation-data.component';
import 'rxjs/add/operator/takeLast';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
@AutoUnsubscribe()
export class ObservationFormComponent implements OnInit, OnDestroy {

  formObservation: FormGroup;
  churches: any;
  dates: any;
  params: any;
  values: any;
  editChurch: any;
  editChurchName: any;
  observation: Observation;

  loading = true;

  sub1: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: TreasuryService,
    private snackBar: MatSnackBar,
    private treasuryService: TreasuryService,
    private observationDataComponent: ObservationDataComponent
  ) { }

  ngOnInit() {
    this.initConfigurations();
    this.initForm();

    this.sub1 = this.service
      .loadChurches(auth.getCurrentUnit().id)
      .do((data) => { this.churches = data; })
      .switchMap(() => this.route.params)
      .do(({ id }) => this.loading = !!id)
      .skipWhile(({ id }) => !id)
      .switchMap(({ id }) => this.editObservation(id))
      .delay(300)
      .subscribe(() => { this.loading = false; });

    this.observationDataComponent.openSidenav();
  }
  ngOnDestroy() {
    this.observationDataComponent.closeSidenav();
  }
  initForm(): void {
    this.formObservation = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      church: [null],
      date: [null]
    });
  }
  initConfigurations() {
    this.dates = {
      now: new Date(new Date().setFullYear(new Date().getFullYear())),
      // min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
      // max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    };
    moment.locale('pt');
  }

  closeSidenav() {
    this.router.navigate(['tesouraria/observacoes']);
  }

  saveObservation() {
    if (!this.formObservation.valid) {
      return;
    }
    const unit = auth.getCurrentUnit();
    const responsible = auth.getCurrentUser();

    this.values = {
      id: !!this.observation ? this.observation.id : 0,
      responsible: responsible.id,
      unit: unit.id,
      status: EObservationStatus.Open,
      ...this.formObservation.value
    };
    this.treasuryService
      .saveObservation(this.values)
      .do(() => {
        this.formObservation.markAsUntouched();
        this.observationDataComponent.closeSidenav();
      })
      .switchMap(() => this.observationDataComponent.getData())
      .do(() => this.snackBar.open('Observação armazenado com sucesso!', 'OK', { duration: 5000 }))
      .subscribe(() => {}, error => {
        console.log(error);
        this.snackBar.open('Erro ao salvar observação, tente novamente.', 'OK', { duration: 5000 });
      });
  }
  editObservation(id: number) {
    return this.treasuryService.getObservation(id).do(data => {
      this.observation = data;
      this.formObservation.patchValue({
        description: data.description,
        date: data.date,
        church: data.church.id
      });
    });
  }
  resetAllForms() {
    this.formObservation.reset();
  }
}
