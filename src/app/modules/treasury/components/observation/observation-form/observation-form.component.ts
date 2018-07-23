import { Component, OnInit, OnDestroy } from '@angular/core';
import { TreasuryService } from '../../../treasury.service';
import { AuthService } from '../../../../../shared/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
    this.initConfigurations();
    this.initForm();

    const unit = this.authService.getCurrentUnit();
    this.service.loadChurches(unit.id).subscribe((data) => {
      this.churches = data;
    });

    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.close();
    });

    this.routeSubscription = this.route.params.subscribe((data) => {
      if (data.id) {
        const val = this.store.loadObservation(Number(data.id));
        if (val.length === 1) {
          this.editObservation(val);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
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
      id: this.params == undefined ? 0 : this.params,
      responsible: responsible.id,
      unit: unit.id,
      status: EObservationStatus.Open,
      ...this.formObservation.value
    };
    if (this.formObservation.valid) {
      this.treasuryService.saveObservation(this.values).subscribe((data: Observation) => {
        this.store.update(data);
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
    this.formObservation = new FormGroup({
      description: new FormControl({value: observation['0'].description, disabled: false}, Validators.required),
      date: new FormControl({value: observation['0'].date, disabled: false}, Validators.required),
      church: new FormControl({value: observation['0'].church.id, disabled: false}, Validators.required),
    });

    this.editChurch = Number(observation['0'].church.id);
    const unit = this.authService.getCurrentUnit();
    this.service.loadChurches(unit.id).subscribe((data) => {
      this.editChurchName = data.find(x => x.id == observation['0'].church.id).name;
    });
  }

  close() {
    // this.store.openOb(new Observation());
    this.sidenavService.close();
    this.router.navigate(['tesouraria/observacoes']);
    this.resetAllForms();
  }

  resetAllForms() {
    this.formObservation.reset();
  }
}
