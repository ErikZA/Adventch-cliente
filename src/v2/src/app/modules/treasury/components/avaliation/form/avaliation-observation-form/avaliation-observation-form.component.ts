import { Subscription } from 'rxjs';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { EObservationStatus } from '../../../../models/enums';
import { auth } from '../../../../../../auth/auth';

import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Church } from '../../../../models/church';
import { tap, switchMap, skipWhile, delay } from 'rxjs/operators';
import { Observation } from '../../../../models/observation';
import { TreasuryService } from '../../../../treasury.service';
import { ObservationDataComponent } from '../../../observation/observation-data/observation-data.component';


@Component({
  selector: 'app-avaliation-observation-form',
  templateUrl: './avaliation-observation-form.component.html',
  styleUrls: ['./avaliation-observation-form.component.scss']
})

@AutoUnsubscribe()
export class AvaliationObservationFormComponent implements OnInit, OnDestroy {


  formObservation: FormGroup;
  churches: Church[] = [];
  dates: any;
  observation: Observation;
  sub1: Subscription;
  loading = true;
  isSending = false;

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
       .pipe(
         tap((data) => { this.churches = data; }),
         switchMap(() => this.route.params),
         tap(({ id }) => this.loading = !!id),
         skipWhile(({ id }) => !id),
    //     switchMap(({ id }) => this.editObservation(id)),
         delay(300)
       ).subscribe(() => { this.loading = false; });

     this.observationDataComponent.openSidenav();
  }


  ngOnDestroy() {
    //this.observationDataComponent.closeSidenav();
  }

  initForm(): void {
    this.formObservation = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]]
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

  // closeSidenav() {
  //   this.router.navigate(['tesouraria/observacoes']);
  // }

  // saveObservation() {
  //   if (!this.formObservation.valid) {
  //     return;
  //   }
  //   const unit = auth.getCurrentUnit();
  //   const responsible = auth.getCurrentUser();
  //   this.isSending = true;
  //   const data = {
  //     id: !!this.observation ? this.observation.id : 0,
  //     responsible: responsible.id,
  //     unit: unit.id,
  //     status: EObservationStatus.Open,
  //     ...this.formObservation.value
  //   };
  //   this.treasuryService
  //     .saveObservation(data)
  //     .pipe(
  //       tap(() => {
  //         this.isSending = false;
  //         this.formObservation.markAsUntouched();
  //         this.observationDataComponent.closeSidenav();
  //       }),
  //       tap(() => this.observationDataComponent.getObservations()),
  //       tap(() => this.snackBar.open('Observação armazenado com sucesso!', 'OK', { duration: 5000 }))
  //     ).subscribe(() => { }, error => {
  //       console.log(error);
  //       this.snackBar.open('Erro ao salvar observação, tente novamente.', 'OK', { duration: 5000 });
  //     });
  // }

   editObservation(id: number) {
     return this.treasuryService.getObservation(id)
       .pipe(
         tap(data => {
           this.observation = data;
           this.formObservation.patchValue({
             description: data.description,
             date: data.date,
             church: data.church.id
           });
         })
       );
   }
   resetAllForms() {
     this.formObservation.reset();
   }
}
