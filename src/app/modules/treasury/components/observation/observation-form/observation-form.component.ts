import { Component, OnInit, OnDestroy } from '@angular/core';
import { TreasuryService } from '../../../treasury.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observation } from '../../../models/observation';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';
import { EObservationStatus } from '../../../models/Enums';
import { auth } from '../../../../../auth/auth';
import { ObservationDataComponent } from '../observation-data/observation-data.component';

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
export class ObservationFormComponent implements OnInit, OnDestroy {

  subscribeUnit: Subscription;

  formObservation: FormGroup;
  churches: any;
  dates: any;
  params: any;
  values: any;
  editChurch: any;
  editChurchName: any;

  routeSubscription: Subscription;

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

    this.service.loadChurches(auth.getCurrentUnit().id).subscribe((data) => {
      this.churches = data;
    });

    this.routeSubscription = this.route.params.subscribe((data) => {
      const id = parseInt(data.id, 10);
      if (Number.isInteger(id)) {
        this.editObservation(id);
      }
    });
    this.observationDataComponent.sidenavRight.open();
  }
  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
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
    this.routeSubscription = this.route.params.subscribe(params => {
      this.params = params['id'];
    });
    const unit = auth.getCurrentUnit();
    const responsible = auth.getCurrentUser();

    this.values = {
      id: this.params === undefined ? 0 : this.params,
      responsible: responsible.id,
      unit: unit.id,
      status: EObservationStatus.Open,
      ...this.formObservation.value
    };
    if (this.formObservation.valid) {
      this.treasuryService.saveObservation(this.values).subscribe((data: Observation) => {
        this.snackBar.open('Observação armazenado com sucesso!', 'OK', { duration: 5000 });
        this.formObservation.markAsUntouched();
        this.observationDataComponent.closeSidenav();
        this.observationDataComponent.getData();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar observação, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      return;
    }
  }
  editObservation(id: number) {
    this.treasuryService.getObservation(id).subscribe(data => {
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
