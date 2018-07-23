import { Component, OnInit } from '@angular/core';
import { TreasuryService } from '../../../treasury.service';
import { AuthService } from '../../../../../shared/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observation } from '../../../models/observation';
import { Router, ActivatedRoute } from '@angular/router';
import { SidenavService } from '../../../../../core/services/sidenav.service';

import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { ObservationStore } from '../observation.store';
import { MatSnackBar } from '@angular/material';
import { EObservationStatus } from '../../../models/Enums';

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
export class ObservationFormComponent implements OnInit {

  formObservation: FormGroup;
  churches: any;
  dates: any;
  params: any;
  values: any;
  editChurch: any;
  editChurchName: any;

  routeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: TreasuryService,
    private snackBar: MatSnackBar,
    private sidenavService: SidenavService,
    private store: ObservationStore,
    private treasuryService: TreasuryService,
  ) { }

  ngOnInit() {
    const unit = this.authService.getCurrentUnit();
    this.initConfigurations();
    this.initForm();
    this.service.loadAllChurches(unit.id).subscribe((data) => {
      this.churches = data;
    });

    this.routeSubscription = this.route.params.subscribe((data) => {
      if (data.id) {
        const val = this.store.loadObservation(Number(data.id));
        this.editObservation(val);
      }

    });
  }

  initForm(): void {
    this.formObservation = this.formBuilder.group({
      observation: ['', [Validators.required, Validators.minLength(3)]],
      churches: [null],
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
    this.sidenavService.close();
    this.router.navigate(['tesouraria/observacoes']);
  }

  saveObservation() {
    if (!this.formObservation.valid) {
      return;
    }
    this.routeSubscription = this.route.params.subscribe(params => {
      this.params = params['id'];
    });
    const unit = this.authService.getCurrentUnit();
    const responsible = this.authService.getCurrentUser();

    this.values = {
      id: this.params,
      description: this.formObservation.value.observation,
      date: this.formObservation.value.date,
      church: {
        id: this.editChurch ? this.editChurch : this.formObservation.value.churches.id,
        name: this.editChurchName ? this.editChurchName : this.formObservation.value.churches.name,
      },
      responsible: {
        id: responsible.id,
        name: responsible.name,
      },
      unit: unit.id,
      status: EObservationStatus.Open,
    };


    if (this.formObservation.valid) {
      this.treasuryService.saveObservation(this.values).subscribe((data) => {
        this.store.update(this.values);
        this.snackBar.open('Observação armazenado com sucesso!', 'OK', { duration: 5000 });
        this.formObservation.markAsUntouched();
        this.close();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar observação, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      return;
    }
  }

  editObservation(observation) {
    this.formObservation.setValue({
      observation: observation['0'].description,
      date: observation['0'].date,
      churches: null,
    });
    this.editChurch = Number(observation['0'].church.id);
    const unit = this.authService.getCurrentUnit();
    this.service.loadAllChurches(unit.id).subscribe((data) => {
      this.editChurchName = data.find(x => x.id == observation['0'].church.id).name;
    });
  }

  close() {
    // this.store.openOb(new Observation());
    this.sidenavService.close();
    this.router.navigate([this.router.url.replace('/novo', '').replace('distritos/' + this.values.id + '/editar', 'distritos')]);
    this.resetAllForms();
  }

  resetAllForms() {
    this.formObservation.reset();
  }
}
